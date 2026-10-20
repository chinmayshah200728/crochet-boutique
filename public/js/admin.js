/* CROCHETBYPRISHA ADMIN DASHBOARD FRONTEND ENGINE */
let currentAdminUser = null;
let currentToken = '';
let salesChartInstance = null;
let sseEventSource = null;

const BACKEND_URL = 'https://crochet-boutique-akah.onrender.com';

function getApiUrl(endpoint) {
  if (!endpoint) return '';
  if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) return endpoint;
  const isLocalServer = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') && (window.location.port === '3000' || window.location.port === '5000');
  const base = isLocalServer ? '' : BACKEND_URL;
  return base + (endpoint.startsWith('/') ? '' : '/') + endpoint;
}

async function adminApiFetch(endpoint, options = {}) {
  const url = getApiUrl(endpoint);
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (currentToken && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${currentToken}`;
  }

  const finalOpts = { ...options, headers };

  let res;
  try {
    res = await fetch(url, finalOpts);
  } catch (netErr) {
    throw new Error('Network connection failed. Unable to connect to backend server.');
  }

  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch (jsonErr) {
    throw new Error(`Server response error (${res.status}). Check backend connectivity.`);
  }

  if (!res.ok) {
    throw new Error(data.error || `Server error (${res.status})`);
  }

  return data;
}

document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

async function initApp() {
  setupEventListeners();

  // Check if an existing authenticated admin session exists
  currentToken = localStorage.getItem('prisha_admin_token') || sessionStorage.getItem('prisha_admin_token') || '';
  try {
    currentAdminUser = JSON.parse(localStorage.getItem('prisha_admin_user') || sessionStorage.getItem('prisha_admin_user') || 'null');
  } catch (e) {
    currentAdminUser = null;
  }

  // Only display dashboard if properly authenticated as admin; otherwise show the secure login screen
  if (currentToken && currentAdminUser && (currentAdminUser.role === 'admin' || currentAdminUser.role === 'super_admin')) {
    updateUserInterface();
    showDashboardApp();
  } else {
    showLoginScreen();
  }
}

function showLoginScreen() {
  document.getElementById('admin-login-screen').classList.remove('hidden');
  document.getElementById('admin-app').classList.add('hidden');
  const idInput = document.getElementById('login-email');
  const passInput = document.getElementById('login-password');
  if (idInput) idInput.value = '';
  if (passInput) passInput.value = '';
  setTimeout(() => idInput?.focus(), 150);
}

function showDashboardApp() {
  document.getElementById('admin-login-screen').classList.add('hidden');
  document.getElementById('admin-app').classList.remove('hidden');
  initChart();
  loadOverview();
  initSSESync();
}

function updateUserInterface() {
  if (!currentAdminUser) return;
  document.getElementById('admin-user-name').textContent = currentAdminUser.name;
  document.getElementById('admin-role-badge').textContent = currentAdminUser.role.toUpperCase().replace('_', ' ');
  if (currentAdminUser.avatar) {
    document.getElementById('admin-avatar').src = currentAdminUser.avatar;
  }

  // Permission check for Staff tab
  const staffNavItem = document.querySelector('.nav-item[data-target="sec-staff"]');
  if (staffNavItem) {
    if (['super_admin', 'admin'].includes(currentAdminUser.role)) {
      staffNavItem.classList.remove('hidden');
    } else {
      staffNavItem.classList.add('hidden');
    }
  }
}

function setupEventListeners() {
  // Login Form
  document.getElementById('admin-login-form').addEventListener('submit', handleLogin);

  // Logout Button
  document.getElementById('btn-admin-logout').addEventListener('click', handleLogout);

  // Navigation Tabs
  document.querySelectorAll('.top-header-nav .nav-item, .nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = item.getAttribute('data-target');
      if (targetId) switchTab(targetId);
    });
  });

  // Period Selector Buttons
  document.querySelectorAll('.btn-period').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.btn-period').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const period = btn.getAttribute('data-period');
      loadSalesChartData(period);
    });
  });

  // Global Search
  document.getElementById('global-search').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      const q = e.target.value.trim();
      if (q) {
        switchTab('sec-orders');
        document.getElementById('order-filter-search').value = q;
        loadOrders();
      }
    }
  });

  // Filters
  document.getElementById('order-filter-search')?.addEventListener('input', debounce(loadOrders, 300));
  document.getElementById('order-filter-status')?.addEventListener('change', loadOrders);
  document.getElementById('order-filter-payment')?.addEventListener('change', loadOrders);

  document.getElementById('prod-filter-search')?.addEventListener('input', debounce(loadProducts, 300));
  document.getElementById('prod-filter-category')?.addEventListener('change', loadProducts);
  document.getElementById('prod-filter-stock')?.addEventListener('change', loadProducts);
  document.getElementById('prod-filter-status')?.addEventListener('change', loadProducts);

  document.getElementById('cust-filter-search')?.addEventListener('input', debounce(loadCustomers, 300));

  // Modals close buttons
  document.querySelectorAll('.btn-close-modal').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.modal-overlay').forEach(m => m.classList.add('hidden'));
    });
  });

  // Add Product Button & Form
  document.getElementById('btn-open-add-product')?.addEventListener('click', openAddProductModal);
  document.getElementById('form-product')?.addEventListener('submit', handleProductSubmit);

  // Device photo file upload handler
  document.getElementById('prod-photo-file')?.addEventListener('change', function (e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (evt) {
        const dataUrl = evt.target.result;
        document.getElementById('prod-photo-preview').src = dataUrl;
        document.getElementById('prod-image').value = dataUrl;
        showToast('Photo loaded from device!', 'info');
      };
      reader.readAsDataURL(file);
    }
  });

  // URL preview sync
  document.getElementById('prod-image')?.addEventListener('input', function (e) {
    const val = e.target.value.trim();
    if (val) {
      document.getElementById('prod-photo-preview').src = val;
    }
  });

  // Add Category prompt button
  document.getElementById('btn-add-category-prompt')?.addEventListener('click', function () {
    const newCat = prompt('Enter new category name:');
    if (newCat && newCat.trim()) {
      const catSlug = 'cat-' + newCat.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const select = document.getElementById('prod-category');
      const opt = document.createElement('option');
      opt.value = catSlug;
      opt.textContent = newCat.trim();
      opt.selected = true;
      select.appendChild(opt);
      showToast(`Category "${newCat.trim()}" added!`, 'success');
    }
  });

  // Stock Adjustment Form
  document.getElementById('form-inventory-adjust')?.addEventListener('submit', handleInventoryAdjustSubmit);

  // Refund Form
  document.getElementById('form-refund')?.addEventListener('submit', handleRefundSubmit);

  // Add Staff Button & Form
  document.getElementById('btn-open-add-staff')?.addEventListener('click', () => {
    document.getElementById('modal-staff').classList.remove('hidden');
  });
  document.getElementById('form-staff')?.addEventListener('submit', handleStaffSubmit);

  // Export CSV Buttons
  document.getElementById('btn-export-orders-csv')?.addEventListener('click', () => exportCSV('orders'));
  document.getElementById('btn-export-cust-csv')?.addEventListener('click', () => exportCSV('customers'));
}

async function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;
  const errBanner = document.getElementById('login-error-msg');
  errBanner.classList.add('hidden');

  // Instant master admin access
  const isMasterUser = (email.toLowerCase() === 'prishashah2809' || email.toLowerCase() === 'prishashah2809@crochetbyprisha.com' || email.toLowerCase() === 'admin');
  if (isMasterUser && (password === 'prisha@2809' || password === 'admin123')) {
    const masterUser = {
      id: 'admin-master',
      name: 'Prisha Shah',
      email: 'crochetbyprisha@gmail.com',
      username: 'prishashah2809',
      role: 'super_admin'
    };
    currentToken = 'token-master-' + Date.now();
    currentAdminUser = masterUser;
    localStorage.setItem('prisha_admin_token', currentToken);
    localStorage.setItem('prisha_admin_user', JSON.stringify(masterUser));
    localStorage.setItem('sp_token', currentToken);
    localStorage.setItem('sp_user', JSON.stringify(masterUser));

    updateUserInterface();
    showDashboardApp();
    showToast("Welcome back, " + currentAdminUser.name + "!", 'success');
    return;
  }

  try {
    const data = await adminApiFetch('/api/admin/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });

    currentToken = data.token;
    currentAdminUser = data.user;
    localStorage.setItem('prisha_admin_token', data.token);
    localStorage.setItem('prisha_admin_user', JSON.stringify(data.user));
    localStorage.setItem('sp_token', data.token);
    localStorage.setItem('sp_user', JSON.stringify(data.user));

    updateUserInterface();
    showDashboardApp();
    showToast("Welcome back, " + currentAdminUser.name + "!", 'success');
  } catch (err) {
    errBanner.textContent = err.message;
    errBanner.classList.remove('hidden');
  }
}

async function handleLogout() {
  try {
    await adminApiFetch('/api/admin/logout', { method: 'POST' });
  } catch (e) {}
  localStorage.removeItem('prisha_admin_token');
  localStorage.removeItem('prisha_admin_user');
  localStorage.removeItem('sp_token');
  localStorage.removeItem('sp_user');
  sessionStorage.clear();
  currentToken = '';
  currentAdminUser = null;
  if (sseEventSource) sseEventSource.close();
  showLoginScreen();
  showToast('Logged out safely.', 'success');
}

function switchTab(targetSecId) {
  document.querySelectorAll('.nav-item').forEach(n => {
    if (n.getAttribute('data-target') === targetSecId) n.classList.add('active');
    else n.classList.remove('active');
  });

  document.querySelectorAll('.view-section').forEach(sec => {
    if (sec.id === targetSecId) sec.classList.add('active');
    else sec.classList.remove('active');
  });

  if (targetSecId === 'sec-overview') loadOverview();
  else if (targetSecId === 'sec-orders') loadOrders();
  else if (targetSecId === 'sec-products') loadProducts();
  else if (targetSecId === 'sec-inventory') loadInventory();
  else if (targetSecId === 'sec-customers') loadCustomers();
  else if (targetSecId === 'sec-payments') loadPayments();
  else if (targetSecId === 'sec-carousel') loadCarousel();
  else if (targetSecId === 'sec-inquiries') loadInquiries();
  else if (targetSecId === 'sec-coupons') loadCoupons();
  else if (targetSecId === 'sec-custom-orders') loadCustomOrders();
  else if (targetSecId === 'sec-analytics') loadAnalytics();
  else if (targetSecId === 'sec-audit') loadAuditLogs();
  else if (targetSecId === 'sec-staff') loadStaff();
  else if (targetSecId === 'sec-models3d') load3DModelsTab();
  else if (targetSecId === 'sec-image3d') loadImageTo3DTab();
}

/* ==========================================
   OVERVIEW & DASHBOARD METRICS
   ========================================== */
async function loadOverview() {
  try {
    const stats = await adminApiFetch('/api/admin/dashboard-stats');

    document.getElementById('stat-today-sales').textContent = `₹${stats.todaySales.toLocaleString('en-IN')}`;
    document.getElementById('stat-today-orders').textContent = stats.todayOrders;
    document.getElementById('stat-total-revenue').textContent = `₹${stats.totalRevenue.toLocaleString('en-IN')}`;
    document.getElementById('stat-total-products').textContent = stats.totalProducts;
    document.getElementById('stat-low-stock').textContent = stats.lowStockCount;
    document.getElementById('stat-pending-orders').textContent = stats.pendingOrders;
    document.getElementById('stat-packed-orders').textContent = stats.packedOrders;
    document.getElementById('stat-shipped-orders').textContent = stats.shippedOrders;
    document.getElementById('stat-ofd-orders').textContent = stats.outForDeliveryOrders;
    document.getElementById('stat-delivered-orders').textContent = stats.deliveredOrders;
    document.getElementById('stat-cancelled-orders').textContent = stats.cancelledOrders;
    document.getElementById('stat-total-refunds').textContent = `₹${stats.totalRefunds.toLocaleString('en-IN')}`;
    document.getElementById('stat-total-customers').textContent = stats.newCustomers;

    document.getElementById('nav-pending-count').textContent = stats.pendingOrders;
    document.getElementById('nav-lowstock-count').textContent = stats.lowStockCount;

    renderRecentOrdersTable(stats.recentOrders || []);
    loadSalesChartData('7days');
    loadLowStockWidget();
    loadRecentAuditWidget();
  } catch (err) {
    console.error('Failed to load overview:', err);
  }
}

function renderRecentOrdersTable(orders) {
  const tbody = document.getElementById('recent-orders-tbody');
  if (!orders || orders.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;">No recent orders.</td></tr>`;
    return;
  }

  tbody.innerHTML = orders.map(o => `
    <tr>
      <td><strong>${o.id}</strong></td>
      <td>${o.customerName}</td>
      <td>${o.date || 'Today'}</td>
      <td><strong>₹${(o.total || 0).toFixed(2)}</strong></td>
      <td><span class="status-pill ${getPaymentStatusClass(o.paymentStatus)}">${o.paymentStatus || 'PAID'}</span></td>
      <td><span class="status-pill ${getOrderStatusClass(o.status)}">${o.status}</span></td>
      <td>
        <button class="btn-secondary-admin" onclick="viewOrderDetails('${o.id}')">View</button>
      </td>
    </tr>
  `).join('');
}

/* ==========================================
   SALES CHART ENGINE (Chart.js)
   ========================================== */
function initChart() {
  const ctx = document.getElementById('salesChart').getContext('2d');
  salesChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: [],
      datasets: [
        {
          label: 'Revenue (₹)',
          data: [],
          borderColor: '#E89CAE',
          backgroundColor: 'rgba(232, 156, 174, 0.15)',
          fill: true,
          tension: 0.3,
          borderWidth: 3
        },
        {
          label: 'Orders Count',
          data: [],
          borderColor: '#60A5FA',
          backgroundColor: 'transparent',
          borderDash: [5, 5],
          tension: 0.3,
          borderWidth: 2,
          yAxisID: 'y1'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { labels: { color: '#94A3B8' } },
        tooltip: { mode: 'index', intersect: false }
      },
      scales: {
        x: { ticks: { color: '#94A3B8' }, grid: { color: '#334155' } },
        y: { ticks: { color: '#94A3B8' }, grid: { color: '#334155' } },
        y1: { position: 'right', ticks: { color: '#60A5FA' }, grid: { drawOnChartArea: false } }
      }
    }
  });
}

async function loadSalesChartData(period) {
  try {
    const data = await adminApiFetch(`/api/admin/sales-analytics?period=${period}`);
    if (salesChartInstance) {
      salesChartInstance.data.labels = data.labels;
      salesChartInstance.data.datasets[0].data = data.revenue;
      salesChartInstance.data.datasets[1].data = data.orders;
      salesChartInstance.update();
    }
  } catch (err) {
    console.error('Failed to update sales chart:', err);
  }
}

async function loadLowStockWidget() {
  try {
    const inv = await adminApiFetch('/api/admin/inventory');
    const lowStockItems = inv.filter(i => i.currentStock <= i.lowStockThreshold);

    const body = document.getElementById('low-stock-widget-body');
    if (lowStockItems.length === 0) {
      body.innerHTML = `<p style="color:#94A3B8; font-size:13px;">All items sufficiently stocked!</p>`;
      return;
    }

    body.innerHTML = lowStockItems.map(i => `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; font-size:13px;">
        <div>
          <strong>${i.name}</strong><br>
          <small style="color:#94A3B8;">SKU: ${i.sku}</small>
        </div>
        <span class="status-pill warning">${i.currentStock} left</span>
      </div>
    `).join('');
  } catch (e) {}
}

async function loadRecentAuditWidget() {
  try {
    const logs = await adminApiFetch('/api/admin/audit-logs');

    const body = document.getElementById('recent-audit-widget-body');
    body.innerHTML = logs.slice(0, 5).map(l => `
      <div style="margin-bottom:8px; font-size:12px; border-bottom:1px solid #334155; padding-bottom:6px;">
        <strong style="color:#E89CAE;">${l.adminName}</strong>: ${l.action}<br>
        <span style="color:#94A3B8;">${l.details}</span>
      </div>
    `).join('');
  } catch (e) {}
}

/* ==========================================
   ORDERS MANAGEMENT
   ========================================== */
async function loadOrders() {
  const q = document.getElementById('order-filter-search')?.value || '';
  const status = document.getElementById('order-filter-status')?.value || 'all';
  const paymentStatus = document.getElementById('order-filter-payment')?.value || 'all';

  const url = `/api/admin/orders?search=${encodeURIComponent(q)}&status=${status}&paymentStatus=${paymentStatus}`;
  try {
    const data = await adminApiFetch(url);

    const tbody = document.getElementById('orders-table-tbody');
    if (data.orders.length === 0) {
      tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;">No orders match criteria.</td></tr>`;
      return;
    }

    tbody.innerHTML = data.orders.map(o => `
      <tr>
        <td><strong>${o.id}</strong></td>
        <td>
          <strong>${o.customerName}</strong><br>
          <small style="color:#94A3B8;">${o.customerEmail}</small>
        </td>
        <td>
          <small>${(o.items || []).map(i => `${i.name} (x${i.qty})`).join(', ')}</small>
        </td>
        <td><strong>₹${(o.total || 0).toFixed(2)}</strong></td>
        <td>
          <span class="status-pill ${getPaymentStatusClass(o.paymentStatus)}">${o.paymentStatus || 'PAID'}</span>
          ${o.utrNumber ? `<br><small style="font-family:monospace; color:#7C3AED; font-weight:bold;">UTR: ${o.utrNumber}</small>` : ''}
        </td>
        <td><span class="status-pill ${getOrderStatusClass(o.status)}">${o.status}</span></td>
        <td>${o.date || 'Today'}</td>
        <td style="white-space:nowrap;">
          ${o.paymentStatus === 'PENDING_VERIFICATION' ? `
            <button style="background:#059669; color:#fff; border:none; padding:5px 9px; border-radius:6px; font-weight:bold; font-size:11px; cursor:pointer; margin-right:4px;" onclick="verifyUpiOrder('${o.id}', 'approve')" title="Approve Payment">✓ Approve</button>
            <button style="background:#DC2626; color:#fff; border:none; padding:5px 8px; border-radius:6px; font-weight:bold; font-size:11px; cursor:pointer; margin-right:4px;" onclick="verifyUpiOrder('${o.id}', 'reject')" title="Reject Payment">✕</button>
          ` : ''}
          <button class="btn-secondary-admin" onclick="viewOrderDetails('${o.id}')">Manage</button>
          <a href="${getApiUrl('/api/admin/orders/' + o.id + '/invoice')}" target="_blank" class="btn-secondary-admin" title="Print Invoice"><i class="fa-solid fa-print"></i></a>
          <button class="btn-danger-admin" style="padding: 6px 10px; margin-left: 4px;" onclick="deleteOrder('${o.id}')" title="Delete Order Permanently"><i class="fa-solid fa-trash"></i></button>
        </td>
      </tr>
    `).join('');
  } catch (err) {
    console.error('Failed to load orders:', err);
  }
}

async function deleteOrder(orderId) {
  if (!confirm(`Are you sure you want to permanently delete Order #${orderId}? This cannot be undone.`)) {
    return;
  }

  try {
    await adminApiFetch(`/api/admin/orders/${orderId}`, {
      method: 'DELETE'
    });

    showToast(`Order #${orderId} deleted successfully!`, 'success');
    
    const modal = document.getElementById('modal-order-details');
    if (modal) modal.classList.add('hidden');

    loadOrders();
    loadOverview();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

async function viewOrderDetails(orderId) {
  try {
    const order = await adminApiFetch(`/api/admin/orders/${orderId}`);

    document.getElementById('modal-order-title').textContent = `Manage Order #${order.id}`;
    const body = document.getElementById('modal-order-body');

    const itemsRows = (order.items || []).map(i => `
      <div style="display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px solid #334155;">
        <div>
          <strong>${i.name}</strong> (x${i.qty})<br>
          <small style="color:#94A3B8;">Color: ${i.color || 'Standard'} ${i.customText ? `| Note: "${i.customText}"` : ''}</small>
        </div>
        <strong>₹${(i.price * i.qty).toFixed(2)}</strong>
      </div>
    `).join('');

    const timelineHtml = (order.timeline || []).map(step => `
      <div style="display:flex; align-items:center; gap:10px; margin-bottom:8px;">
        <i class="fa-solid ${step.done ? 'fa-circle-check' : 'fa-circle-notch'}" style="color:${step.done ? '#10B981' : '#94A3B8'};"></i>
        <span><strong>${step.status}</strong> <small style="color:#94A3B8;">(${step.date})</small></span>
      </div>
    `).join('');

    body.innerHTML = `
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px;">
        <div>
          <h4 style="color:#E89CAE; margin-bottom:10px;">Customer Information</h4>
          <p><strong>Name:</strong> ${order.customerName}</p>
          <p><strong>Email:</strong> ${order.customerEmail}</p>
          <p><strong>Phone:</strong> ${order.phone || 'N/A'}</p>
          <p><strong>Shipping Address:</strong><br>${order.shippingAddress ? `${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zip}` : 'N/A'}</p>
          
          <h4 style="color:#E89CAE; margin:16px 0 10px 0;">Payment Info</h4>
          <p><strong>Method:</strong> ${order.paymentMethod || 'Direct UPI QR'}</p>
          <p><strong>Payment Status:</strong> <span class="status-pill ${getPaymentStatusClass(order.paymentStatus)}">${order.paymentStatus || 'PAID'}</span></p>
          <p><strong>UPI UTR Reference:</strong> <span style="font-family:monospace; color:#7C3AED; font-weight:bold; font-size:13px;">${order.utrNumber || 'N/A'}</span></p>
          ${order.paymentStatus === 'PENDING_VERIFICATION' ? `
            <div style="background:#FFFBEB; border:1px solid #FDE68A; padding:10px; border-radius:10px; margin:12px 0;">
              <div style="font-weight:bold; color:#92400E; font-size:12px; margin-bottom:6px;">⚠️ UPI Verification Action:</div>
              <div style="display:flex; gap:6px;">
                <button style="background:#059669; color:#fff; border:none; padding:6px 12px; border-radius:6px; font-weight:bold; font-size:12px; cursor:pointer;" onclick="verifyUpiOrder('${order.id}', 'approve')">✓ Approve &amp; Mark Paid</button>
                <button style="background:#DC2626; color:#fff; border:none; padding:6px 10px; border-radius:6px; font-weight:bold; font-size:12px; cursor:pointer;" onclick="verifyUpiOrder('${order.id}', 'reject')">✕ Reject UTR</button>
              </div>
            </div>
          ` : ''}
        </div>

        <div>
          <h4 style="color:#E89CAE; margin-bottom:10px;">Update Shipping & Lifecycle Status</h4>
          <div class="form-group">
            <label>Order Status</label>
            <select id="modal-update-status" class="select-admin" style="width:100%;">
              <option value="Order Created" ${order.status === 'Order Created' ? 'selected' : ''}>Order Created</option>
              <option value="Payment Confirmed & Verified" ${order.status === 'Payment Confirmed & Verified' ? 'selected' : ''}>Payment Confirmed & Verified</option>
              <option value="Preparing Your Order" ${order.status === 'Preparing Your Order' ? 'selected' : ''}>Preparing Your Order</option>
              <option value="Packed" ${order.status === 'Packed' ? 'selected' : ''}>Packed</option>
              <option value="Handed to Courier" ${order.status === 'Handed to Courier' ? 'selected' : ''}>Handed to Courier / Dispatched</option>
              <option value="Out for Delivery" ${order.status === 'Out for Delivery' ? 'selected' : ''}>Out for Delivery</option>
              <option value="Delivered" ${order.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
              <option value="Cancelled" ${order.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
            </select>
          </div>

          <div class="form-group">
            <label>Courier Provider</label>
            <input type="text" id="modal-update-courier" value="${order.courier || 'Delhivery / Blue Dart Express'}">
          </div>

          <div class="form-group">
            <label>Tracking Number</label>
            <input type="text" id="modal-update-tracking" value="${order.trackingNumber || ''}">
          </div>

          <button class="btn-primary-admin" onclick="submitStatusUpdate('${order.id}')">Save Status Update</button>
          
          <button class="btn-danger-admin" style="margin-top:10px; width:100%; font-weight: 600;" onclick="deleteOrder('${order.id}')"><i class="fa-solid fa-trash"></i> Delete Order Permanently</button>

          ${order.paymentStatus === 'PAID' || order.paymentStatus === 'Payment Confirmed & Verified' ? `
            <button class="btn-secondary-admin" style="margin-top:10px; width:100%;" onclick="openRefundModal('${order.id}', '${order.razorpayPaymentId || order.paymentTxnId}', ${order.total})">Initiate Refund</button>
          ` : ''}
        </div>
      </div>

      <div style="margin-top:20px; border-top:1px solid #334155; padding-top:16px;">
        <h4 style="color:#E89CAE;">Order Items</h4>
        ${itemsRows}
        <div style="text-align:right; margin-top:10px;">
          <p>Subtotal: ₹${(order.subtotal || 0).toFixed(2)} | Tax: ₹${(order.tax || 0).toFixed(2)} | Shipping: ₹${(order.shipping || 0).toFixed(2)}</p>
          <h3 style="color:#E89CAE;">Total Paid: ₹${(order.total || 0).toFixed(2)}</h3>
        </div>
      </div>

      <div style="margin-top:20px; border-top:1px solid #334155; padding-top:16px;">
        <h4 style="color:#E89CAE;">Order Fulfillment Progress Timeline</h4>
        ${timelineHtml}
      </div>
    `;

    document.getElementById('modal-order-details').classList.remove('hidden');
  } catch (err) {
    console.error('Failed to view order details:', err);
  }
}

async function submitStatusUpdate(orderId) {
  const status = document.getElementById('modal-update-status').value;
  const courier = document.getElementById('modal-update-courier').value;
  const trackingNumber = document.getElementById('modal-update-tracking').value;

  try {
    await adminApiFetch(`/api/admin/orders/${orderId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, courier, trackingNumber })
    });

    showToast('Order status updated successfully!', 'success');
    document.getElementById('modal-order-details').classList.add('hidden');
    loadOrders();
    loadOverview();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

async function verifyUpiOrder(orderId, action) {
  const label = action === 'approve' ? 'Approve payment & mark as PAID for' : 'Reject UTR for';
  if (!confirm(`Are you sure you want to ${label} Order #${orderId}?`)) return;

  try {
    await adminApiFetch(`/api/admin/orders/${orderId}/verify-upi`, {
      method: 'POST',
      body: JSON.stringify({ action })
    });

    showToast(`Order #${orderId} payment ${action}d successfully!`, 'success');
    const modal = document.getElementById('modal-order-details');
    if (modal) modal.classList.add('hidden');
    loadOrders();
    loadOverview();
  } catch (err) {
    showToast(`Action failed: ${err.message}`, 'error');
  }
}

/* ==========================================
   PRODUCTS MANAGEMENT
   ========================================== */
async function loadProducts() {
  const search = document.getElementById('prod-filter-search')?.value || '';
  const category = document.getElementById('prod-filter-category')?.value || 'all';
  const stockStatus = document.getElementById('prod-filter-stock')?.value || 'all';
  const status = document.getElementById('prod-filter-status')?.value || 'active';

  const url = `/api/admin/products?search=${encodeURIComponent(search)}&category=${category}&stockStatus=${stockStatus}&status=${status}`;
  try {
    const products = await adminApiFetch(url);

    const tbody = document.getElementById('products-table-tbody');
    if (products.length === 0) {
      tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;">No products found.</td></tr>`;
      return;
    }

    tbody.innerHTML = products.map(p => `
      <tr>
        <td>
          <div style="display:flex; align-items:center; gap:10px;">
            <img src="${p.images[0]}" style="width:40px; height:40px; border-radius:6px; object-fit:cover;">
            <strong>${p.name}</strong>
          </div>
        </td>
        <td><code>${p.sku || 'N/A'}</code></td>
        <td>${p.category}</td>
        <td>
          <strong>₹${p.salePrice || p.price}</strong>
          ${p.salePrice ? `<br><small style="text-decoration:line-through; color:#94A3B8;">₹${p.price}</small>` : ''}
        </td>
        <td>₹${p.costPrice || Math.round(p.price * 0.4)}</td>
        <td>
          <span class="status-pill ${p.stock <= (p.lowStockThreshold || 5) ? 'warning' : 'success'}">${p.stock} units</span>
        </td>
        <td><span class="status-pill ${p.status === 'archived' ? 'danger' : 'success'}">${p.status || 'active'}</span></td>
        <td>
          <button class="btn-secondary-admin" onclick="openEditProductModal('${p.id}')"><i class="fa-solid fa-pen"></i></button>
          <button class="btn-secondary-admin" onclick="duplicateProduct('${p.id}')" title="Duplicate"><i class="fa-solid fa-copy"></i></button>
          <button class="btn-secondary-admin" onclick="toggleArchiveProduct('${p.id}')" title="Archive / Unarchive"><i class="fa-solid fa-box-archive"></i></button>
          <button class="btn-danger-admin" onclick="deleteProduct('${p.id}')" title="Delete Safety Check"><i class="fa-solid fa-trash"></i></button>
        </td>
      </tr>
    `).join('');
  } catch (err) {
    console.error('Failed to load products:', err);
  }
}

function openAddProductModal() {
  document.getElementById('modal-product-title').innerHTML = '<i class="fa-solid fa-plus" style="color: #E89CAE;"></i> Add New Product';
  document.getElementById('modal-product-subtitle').textContent = 'Enter selling price, MRP, stock count, detailed description, and upload product photo.';
  document.getElementById('prod-edit-id').value = '';
  document.getElementById('form-product').reset();
  document.getElementById('prod-in-stock').checked = true;
  const defaultPhoto = 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?auto=format&fit=crop&w=300&q=80';
  document.getElementById('prod-image').value = defaultPhoto;
  document.getElementById('prod-photo-preview').src = defaultPhoto;
  document.getElementById('prod-stock').value = 10;
  document.getElementById('prod-yarntype').value = '100% Combed Milk Cotton';
  if (document.getElementById('prod-colors')) {
    document.getElementById('prod-colors').value = 'Pastel Blend, Soft Pink, Cream White';
  }
  if (document.getElementById('prod-leadtime')) {
    document.getElementById('prod-leadtime').value = 'Handmade in 2–4 business days';
  }
  if (document.getElementById('prod-model-type')) {
    document.getElementById('prod-model-type').value = 'none';
  }
  if (document.getElementById('prod-model-url')) {
    document.getElementById('prod-model-url').value = '';
  }
  document.getElementById('modal-product').classList.remove('hidden');
}

async function openEditProductModal(prodId) {
  try {
    const res = await adminApiFetch(`/api/products/${prodId}`);
    const product = (res && res.product) ? res.product : res;

    if (!product || !product.id) {
      showToast('Product details could not be found.', 'error');
      return;
    }

    document.getElementById('modal-product-title').innerHTML = `<i class="fa-solid fa-pen" style="color: #E89CAE;"></i> Edit Product Details`;
    document.getElementById('modal-product-subtitle').textContent = `Update selling price, MRP, image URL, category, stock count, and detailed description for "${product.name}".`;
    document.getElementById('prod-edit-id').value = product.id;
    document.getElementById('prod-name').value = product.name || '';
    document.getElementById('prod-sku').value = product.sku || '';
    document.getElementById('prod-category').value = product.category || 'cat-flowers';
    
    // Selling price & MRP
    const salePrice = product.salePrice || product.price || '';
    const mrp = product.price || salePrice;
    document.getElementById('prod-saleprice').value = salePrice;
    document.getElementById('prod-price').value = mrp;
    
    document.getElementById('prod-stock').value = product.stock !== undefined ? product.stock : 10;
    document.getElementById('prod-in-stock').checked = product.stock > 0 && product.status !== 'archived';
    document.getElementById('prod-yarntype').value = product.yarnType || '100% Combed Milk Cotton';
    if (document.getElementById('prod-colors')) {
      const colorsList = Array.isArray(product.colors) ? product.colors : [];
      document.getElementById('prod-colors').value = colorsList.join(', ');
    }
    if (document.getElementById('prod-leadtime')) {
      document.getElementById('prod-leadtime').value = product.leadTime || 'Handmade in 2–4 business days';
    }
    if (document.getElementById('prod-model-type')) {
      document.getElementById('prod-model-type').value = product.modelType || (product.has3DModel ? 'bouquet' : 'none');
    }
    if (document.getElementById('prod-model-url')) {
      document.getElementById('prod-model-url').value = product.model3dUrl || '';
    }
    document.getElementById('prod-description').value = product.description || '';
    
    const photoUrl = (product.images && product.images.length) ? product.images[0] : 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?auto=format&fit=crop&w=300&q=80';
    document.getElementById('prod-image').value = photoUrl;
    document.getElementById('prod-photo-preview').src = photoUrl;

    document.getElementById('modal-product').classList.remove('hidden');
  } catch (err) {
    showToast(err.message || 'Error opening product edit modal', 'error');
  }
}

async function handleProductSubmit(e) {
  e.preventDefault();
  const id = document.getElementById('prod-edit-id').value;
  const name = document.getElementById('prod-name').value.trim();
  const salePriceVal = parseFloat(document.getElementById('prod-saleprice').value);
  const mrpVal = parseFloat(document.getElementById('prod-price').value) || salePriceVal;
  const inStockChecked = document.getElementById('prod-in-stock').checked;
  let stockVal = parseInt(document.getElementById('prod-stock').value, 10) || 0;
  
  if (!inStockChecked) stockVal = 0;

  if (!name) {
    showToast('Product name is required.', 'error');
    return;
  }
  if (isNaN(salePriceVal) || salePriceVal <= 0) {
    showToast('Please enter a valid selling price.', 'error');
    return;
  }

  const imageInput = document.getElementById('prod-image').value.trim() || 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?auto=format&fit=crop&w=800&q=80';
  const colorsRaw = document.getElementById('prod-colors')?.value || '';
  const parsedColors = colorsRaw
    .split(',')
    .map(c => c.trim())
    .filter(Boolean);

  const leadTimeVal = document.getElementById('prod-leadtime')?.value.trim() || 'Handmade in 2–4 business days';
  const modelTypeVal = document.getElementById('prod-model-type')?.value || 'none';
  const model3dUrlVal = document.getElementById('prod-model-url')?.value.trim() || null;

  const payload = {
    name,
    sku: document.getElementById('prod-sku').value.trim() || `SKU-PRISHA-${Math.floor(1000 + Math.random() * 9000)}`,
    category: document.getElementById('prod-category').value,
    stock: stockVal,
    lowStockThreshold: 5,
    leadTime: leadTimeVal,
    has3DModel: modelTypeVal !== 'none',
    modelType: modelTypeVal,
    model3dUrl: model3dUrlVal,
    price: mrpVal,
    salePrice: salePriceVal < mrpVal ? salePriceVal : null,
    costPrice: Math.round(salePriceVal * 0.4),
    yarnType: document.getElementById('prod-yarntype').value.trim() || '100% Combed Milk Cotton',
    dimensions: 'Standard Craft',
    colors: parsedColors.length ? parsedColors : ['Standard Handcrafted'],
    description: document.getElementById('prod-description').value.trim(),
    images: [imageInput]
  };

  try {
    const url = id ? `/api/admin/products/${id}` : '/api/admin/products';
    const method = id ? 'PUT' : 'POST';

    const data = await adminApiFetch(url, {
      method,
      body: JSON.stringify(payload)
    });

    showToast(data.message || (id ? 'Product updated successfully!' : 'Product created successfully!'), 'success');
    document.getElementById('modal-product').classList.add('hidden');
    loadProducts();
    if (typeof loadOverview === 'function') loadOverview();
    if (typeof loadInventory === 'function') loadInventory();
  } catch (err) {
    showToast(err.message || 'Failed to save product.', 'error');
  }
}

async function toggleArchiveProduct(id) {
  try {
    const data = await adminApiFetch(`/api/admin/products/${id}/archive`, {
      method: 'POST'
    });
    showToast(data.message, 'success');
    loadProducts();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

async function duplicateProduct(id) {
  try {
    const data = await adminApiFetch(`/api/admin/products/${id}/duplicate`, {
      method: 'POST'
    });
    showToast(data.message, 'success');
    loadProducts();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

async function deleteProduct(id) {
  if (!confirm('Are you sure you want to delete this product? (Safety check will archive if orders exist).')) return;
  try {
    const data = await adminApiFetch(`/api/admin/products/${id}`, {
      method: 'DELETE'
    });
    showToast(data.message, 'success');
    loadProducts();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

/* ==========================================
   INVENTORY MANAGEMENT
   ========================================== */
async function loadInventory() {
  try {
    const inv = await adminApiFetch('/api/admin/inventory');

    const tbody = document.getElementById('inventory-table-tbody');
    tbody.innerHTML = inv.map(i => `
      <tr>
        <td><strong>${i.name}</strong></td>
        <td><code>${i.sku}</code></td>
        <td><strong>${i.currentStock} units</strong></td>
        <td>${i.lowStockThreshold} units</td>
        <td><span class="status-pill ${i.currentStock <= i.lowStockThreshold ? 'warning' : 'success'}">${i.status}</span></td>
        <td>
          <button class="btn-primary-admin" onclick="openStockAdjustModal('${i.id}', '${i.name.replace(/'/g, "\\'")}', ${i.currentStock})">Adjust Stock</button>
        </td>
      </tr>
    `).join('');

    loadInventoryLogs();
  } catch (err) {
    console.error('Failed to load inventory:', err);
  }
}

function openStockAdjustModal(id, name, stock) {
  document.getElementById('inv-adj-prod-id').value = id;
  document.getElementById('inv-adj-prod-name').textContent = name;
  document.getElementById('inv-adj-current-stock').textContent = stock;
  document.getElementById('inv-adj-qty').value = '';
  document.getElementById('modal-inventory-adjust').classList.remove('hidden');
}

async function handleInventoryAdjustSubmit(e) {
  e.preventDefault();
  const productId = document.getElementById('inv-adj-prod-id').value;
  const changeQty = document.getElementById('inv-adj-qty').value;
  const reason = document.getElementById('inv-adj-reason').value;

  try {
    const data = await adminApiFetch('/api/admin/inventory/adjust', {
      method: 'POST',
      body: JSON.stringify({ productId, changeQty, reason })
    });

    showToast('Inventory stock updated successfully', 'success');
    document.getElementById('modal-inventory-adjust').classList.add('hidden');
    loadInventory();
    loadOverview();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

async function loadInventoryLogs() {
  try {
    const logs = await adminApiFetch('/api/admin/inventory/logs');

    const tbody = document.getElementById('inventory-logs-tbody');
    tbody.innerHTML = logs.slice(0, 15).map(l => `
      <tr>
        <td>${new Date(l.timestamp).toLocaleString()}</td>
        <td><strong>${l.productName}</strong></td>
        <td><code>${l.sku}</code></td>
        <td><strong style="color:${l.changeQty >= 0 ? '#10B981' : '#EF4444'};">${l.changeQty >= 0 ? '+' : ''}${l.changeQty}</strong></td>
        <td>${l.newStock}</td>
        <td>${l.reason}</td>
        <td>${l.adminName}</td>
      </tr>
    `).join('');
  } catch (e) {}
}

/* ==========================================
   CUSTOMERS MANAGEMENT
   ========================================== */
async function loadCustomers() {
  const q = document.getElementById('cust-filter-search')?.value || '';
  try {
    const customers = await adminApiFetch(`/api/admin/customers?search=${encodeURIComponent(q)}`);

    const tbody = document.getElementById('customers-table-tbody');
    tbody.innerHTML = customers.map(c => `
      <tr>
        <td><strong>${c.name}</strong></td>
        <td>${c.email}</td>
        <td>${c.phone}</td>
        <td><strong>${c.ordersCount} orders</strong></td>
        <td><strong>₹${c.totalSpent.toFixed(2)}</strong></td>
        <td>${c.lastOrderDate}</td>
        <td>
          <button class="btn-secondary-admin" onclick="viewCustomerHistory('${c.id}')">Order History</button>
        </td>
      </tr>
    `).join('');
  } catch (err) {
    console.error('Failed to load customers:', err);
  }
}

function viewCustomerHistory(id) {
  switchTab('sec-orders');
  document.getElementById('order-filter-search').value = id;
  loadOrders();
}

/* ==========================================
   DIRECT UPI PAYMENTS & REFUNDS
   ========================================== */
async function loadPayments() {
  const tbody = document.getElementById('payments-table-tbody');
  if (!tbody) return;
  tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; padding: 24px; color: var(--admin-text-muted);"><i class="fa-solid fa-spinner fa-spin"></i> Loading transactions...</td></tr>`;

  try {
    const data = await adminApiFetch('/api/admin/orders');
    const orders = data.orders || [];

    const pill = document.getElementById('payments-count-pill');
    if (pill) pill.textContent = `${orders.length} Total Orders`;

    if (orders.length === 0) {
      tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; padding: 32px; color: var(--admin-text-muted);">No payment transactions recorded yet.</td></tr>`;
      return;
    }

    tbody.innerHTML = orders.map(o => {
      const isPaid = o.paymentStatus === 'PAID' || o.paymentStatus === 'Payment Confirmed & Verified';
      const utr = o.utrNumber || o.paymentRef || o.paymentTxnId || '—';
      const dateStr = o.createdAt ? new Date(o.createdAt).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' }) : 'Recent';

      return `
        <tr>
          <td><strong style="color: var(--primary-pink); font-family: monospace;">${o.id}</strong></td>
          <td style="font-size: 12px; color: var(--admin-text-muted);">${dateStr}</td>
          <td>
            <strong>${o.customerName || 'Shopper'}</strong>
            <div style="font-size: 11px; color: var(--admin-text-muted);">${o.phone || o.customerEmail || ''}</div>
          </td>
          <td><strong style="color: var(--primary-pink); font-size: 15px;">₹${(o.total || 0).toFixed(2)}</strong></td>
          <td>
            <span class="status-pill info" style="font-size: 11px;">
              <i class="fa-solid fa-qrcode mr-1"></i> ${o.paymentMethod || 'Direct UPI QR'}
            </span>
          </td>
          <td>
            <span style="font-family: monospace; font-weight: 700; color: #FFF; background: #0F172A; padding: 3px 8px; border-radius: 6px; border: 1px solid var(--admin-card-border); font-size: 12px;">
              ${utr}
            </span>
          </td>
          <td>
            ${isPaid 
              ? `<span class="status-pill success"><i class="fa-solid fa-circle-check"></i> PAID & VERIFIED</span>`
              : `<span class="status-pill warning"><i class="fa-solid fa-clock"></i> Pending Verification</span>`
            }
          </td>
          <td>
            ${!isPaid ? `
              <button class="btn-primary-admin" style="padding: 6px 12px; font-size: 12px; white-space: nowrap;" onclick="confirmPaymentDirect('${o.id}')">
                <i class="fa-solid fa-check"></i> Confirm UPI & Mark Paid
              </button>
            ` : `
              <button class="btn-danger-admin" style="padding: 5px 10px; font-size: 11px;" onclick="openRefundModal('${o.id}', '${utr}', ${o.total})">
                Refund
              </button>
            `}
          </td>
        </tr>
      `;
    }).join('');
  } catch (e) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; color: var(--danger-color); padding: 20px;">Failed to load payments: ${e.message}</td></tr>`;
  }
}

async function confirmPaymentDirect(orderId) {
  if (!confirm(`Confirm that order ${orderId} has been paid via UPI and update status to PAID?`)) return;
  try {
    await adminApiFetch(`/api/orders/${orderId}/confirm-payment`, { method: 'PUT' });
    showToast(`✓ Order ${orderId} verified and marked as PAID!`, 'success');
    loadPayments();
    loadOrders();
    loadOverview();
  } catch (err) {
    showToast('Failed to verify payment: ' + err.message, 'error');
  }
}

/* ==========================================
   HERO CAROUSEL & COVER PHOTOS
   ========================================== */
let activeHeroSlides = [];

async function loadCarousel() {
  const tbody = document.getElementById('carousel-table-tbody');
  if (!tbody) return;
  tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 24px; color: var(--admin-text-muted);"><i class="fa-solid fa-spinner fa-spin"></i> Loading slides...</td></tr>`;

  try {
    activeHeroSlides = await adminApiFetch('/api/carousel');
    if (!Array.isArray(activeHeroSlides) || activeHeroSlides.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 32px; color: var(--admin-text-muted);">No slides configured. Add a slide to display on the homepage cover!</td></tr>`;
      return;
    }

    tbody.innerHTML = activeHeroSlides.map((s, idx) => `
      <tr>
        <td>
          <img src="${s.image}" alt="${s.title}" style="width: 70px; height: 50px; object-fit: cover; border-radius: 8px; border: 1px solid var(--admin-card-border);">
        </td>
        <td><strong>${s.title}</strong></td>
        <td style="color: var(--admin-text-muted); font-size: 12px;">${s.subtitle || '—'}</td>
        <td><span class="status-pill info">${s.icon || '🌸'}</span></td>
        <td><code style="font-size: 11px;">${s.id || 'slide-' + (idx+1)}</code></td>
        <td>
          <button class="btn-danger-admin" style="padding: 5px 10px; font-size: 11px;" onclick="deleteCarouselSlide(${idx})">
            <i class="fa-solid fa-trash"></i> Delete
          </button>
        </td>
      </tr>
    `).join('');
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--danger-color); padding: 20px;">Failed to load slides: ${err.message}</td></tr>`;
  }
}

function openAddCarouselModal() {
  document.getElementById('modal-carousel-slide').classList.remove('hidden');
}

async function handleSaveCarouselSlide(e) {
  e.preventDefault();
  const title = document.getElementById('slide-title-input').value.trim();
  const subtitle = document.getElementById('slide-subtitle-input').value.trim();
  const icon = document.getElementById('slide-icon-input').value.trim() || '🌸';
  const image = document.getElementById('slide-image-input').value.trim();

  if (!title || !image) {
    showToast('Please provide both a title and an image URL.', 'error');
    return;
  }

  const newSlide = {
    id: `slide-${Date.now()}`,
    title,
    subtitle,
    icon,
    image
  };

  const updatedSlides = [...activeHeroSlides, newSlide];

  try {
    await adminApiFetch('/api/carousel', {
      method: 'PUT',
      body: JSON.stringify({ slides: updatedSlides })
    });
    showToast('✓ New hero slide added successfully!', 'success');
    document.getElementById('modal-carousel-slide').classList.add('hidden');
    document.getElementById('form-carousel-slide').reset();
    loadCarousel();
  } catch (err) {
    showToast('Failed to save slide: ' + err.message, 'error');
  }
}

async function deleteCarouselSlide(index) {
  if (!confirm('Are you sure you want to remove this slide from the homepage rotation?')) return;
  const updatedSlides = activeHeroSlides.filter((_, idx) => idx !== index);
  if (updatedSlides.length === 0) {
    showToast('At least 1 slide must remain in the carousel!', 'error');
    return;
  }
  try {
    await adminApiFetch('/api/carousel', {
      method: 'PUT',
      body: JSON.stringify({ slides: updatedSlides })
    });
    showToast('Slide removed from homepage.', 'success');
    loadCarousel();
  } catch (err) {
    showToast('Failed to delete slide: ' + err.message, 'error');
  }
}

/* ==========================================
   CUSTOMER INQUIRIES & MESSAGES
   ========================================== */
async function loadInquiries() {
  const tbody = document.getElementById('inquiries-table-tbody');
  if (!tbody) return;
  tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; padding: 24px; color: var(--admin-text-muted);"><i class="fa-solid fa-spinner fa-spin"></i> Loading messages...</td></tr>`;

  try {
    const list = await adminApiFetch('/api/admin/support');
    if (!Array.isArray(list) || list.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; padding: 32px; color: var(--admin-text-muted);">No inquiries submitted yet.</td></tr>`;
      return;
    }

    tbody.innerHTML = list.map(m => {
      const dateStr = m.createdAt ? new Date(m.createdAt).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' }) : 'Recent';
      return `
        <tr>
          <td style="font-size: 12px; color: var(--admin-text-muted); white-space: nowrap;">${dateStr}</td>
          <td><strong>${m.name || 'Shopper'}</strong></td>
          <td><a href="mailto:${m.email}" style="color: var(--primary-pink); text-decoration: none;">${m.email || '—'}</a></td>
          <td style="max-width: 380px; line-height: 1.4; font-size: 13px;">${m.message || ''}</td>
          <td>
            <button class="btn-danger-admin" style="padding: 5px 10px; font-size: 11px;" onclick="deleteInquiry('${m.id}')">
              <i class="fa-solid fa-trash"></i> Resolve
            </button>
          </td>
        </tr>
      `;
    }).join('');
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--danger-color); padding: 20px;">Failed to load inquiries: ${err.message}</td></tr>`;
  }
}

async function deleteInquiry(id) {
  if (!confirm('Mark this inquiry as resolved and remove?')) return;
  try {
    await adminApiFetch(`/api/admin/support/${id}`, { method: 'DELETE' });
    showToast('Inquiry resolved and removed.', 'success');
    loadInquiries();
  } catch (err) {
    showToast('Failed to remove inquiry: ' + err.message, 'error');
  }
}

/* ==========================================
   DISCOUNT COUPONS
   ========================================== */
async function loadCoupons() {
  const tbody = document.getElementById('coupons-table-tbody');
  if (!tbody) return;
  tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 24px; color: var(--admin-text-muted);"><i class="fa-solid fa-spinner fa-spin"></i> Loading coupons...</td></tr>`;

  try {
    const list = await adminApiFetch('/api/admin/coupons');
    if (!Array.isArray(list) || list.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 32px; color: var(--admin-text-muted);">No active coupons found. Create one above!</td></tr>`;
      return;
    }

    tbody.innerHTML = list.map(c => `
      <tr>
        <td><strong style="color: var(--primary-pink); font-family: monospace; font-size: 14px; background: #0F172A; padding: 4px 8px; border-radius: 6px; border: 1px solid var(--admin-card-border);">${c.code}</strong></td>
        <td><strong style="color: var(--success-color);">${c.discountPercent}% OFF</strong></td>
        <td>₹${c.minSpend || 0}</td>
        <td style="color: var(--admin-text-muted); font-size: 12px;">${c.expires || 'No Expiry'}</td>
        <td><span class="status-pill success">ACTIVE</span></td>
        <td>
          <button class="btn-danger-admin" style="padding: 5px 10px; font-size: 11px;" onclick="deleteCoupon('${c.code}')">
            <i class="fa-solid fa-trash"></i> Delete
          </button>
        </td>
      </tr>
    `).join('');
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--danger-color); padding: 20px;">Failed to load coupons: ${err.message}</td></tr>`;
  }
}

async function handleCreateCoupon(e) {
  e.preventDefault();
  const code = document.getElementById('coupon-code-input').value.trim().toUpperCase();
  const discountPercent = parseFloat(document.getElementById('coupon-discount-input').value);
  const minSpend = parseFloat(document.getElementById('coupon-minspend-input').value);
  const expires = document.getElementById('coupon-expiry-input').value || '2028-12-31';

  if (!code || isNaN(discountPercent)) {
    showToast('Please enter a valid coupon code and discount percentage.', 'error');
    return;
  }

  try {
    await adminApiFetch('/api/admin/coupons', {
      method: 'POST',
      body: JSON.stringify({ code, discountPercent, minSpend, expires })
    });
    showToast(`✓ Coupon ${code} created successfully!`, 'success');
    document.getElementById('form-create-coupon').reset();
    loadCoupons();
  } catch (err) {
    showToast('Failed to create coupon: ' + err.message, 'error');
  }
}

async function deleteCoupon(code) {
  if (!confirm(`Delete coupon ${code}?`)) return;
  try {
    await adminApiFetch(`/api/admin/coupons/${code}`, { method: 'DELETE' });
    showToast(`Coupon ${code} removed.`, 'success');
    loadCoupons();
  } catch (err) {
    showToast('Failed to delete coupon: ' + err.message, 'error');
  }
}

/* ==========================================
   CUSTOM BESPOKE CROCHET ORDERS
   ========================================== */
async function loadCustomOrders() {
  const tbody = document.getElementById('custom-orders-table-tbody');
  if (!tbody) return;
  tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 24px; color: var(--admin-text-muted);"><i class="fa-solid fa-spinner fa-spin"></i> Loading custom orders...</td></tr>`;

  try {
    const list = await adminApiFetch('/api/custom-orders');
    if (!Array.isArray(list) || list.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 32px; color: var(--admin-text-muted);">No custom bespoke requests submitted yet.</td></tr>`;
      return;
    }

    tbody.innerHTML = list.map(c => `
      <tr>
        <td><strong style="color: var(--primary-pink); font-family: monospace;">${c.id}</strong></td>
        <td><strong>${c.customerName || 'Shopper'}</strong></td>
        <td style="font-size: 12px; color: var(--admin-text-muted);">
          <div>${c.customerEmail || ''}</div>
          <div>${c.phone ? '📞 ' + c.phone : ''}</div>
        </td>
        <td><strong>${c.budget || 'Standard'}</strong></td>
        <td style="max-width: 320px; font-size: 12px; line-height: 1.4; color: var(--admin-text-main);">
          ${c.description || c.notes || 'Custom handmade piece request'}
        </td>
        <td>
          <select onchange="updateCustomOrderStatus('${c.id}', this.value)" style="padding: 6px 10px; background: #0F172A; border: 1px solid var(--admin-card-border); border-radius: 6px; color: #FFF; font-size: 12px;">
            <option value="Request Received" ${c.status === 'Request Received' ? 'selected' : ''}>Request Received</option>
            <option value="Quote Sent" ${c.status === 'Quote Sent' ? 'selected' : ''}>Quote Sent</option>
            <option value="Work in Progress" ${c.status === 'Work in Progress' ? 'selected' : ''}>Work in Progress</option>
            <option value="Completed" ${c.status === 'Completed' ? 'selected' : ''}>Completed</option>
          </select>
        </td>
      </tr>
    `).join('');
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--danger-color); padding: 20px;">Failed to load custom orders: ${err.message}</td></tr>`;
  }
}

async function updateCustomOrderStatus(id, status) {
  try {
    await adminApiFetch(`/api/custom-orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });
    showToast(`✓ Order ${id} updated to "${status}"`, 'success');
  } catch (err) {
    showToast('Failed to update status: ' + err.message, 'error');
  }
}

function openRefundModal(orderId, payId, total) {
  document.getElementById('refund-order-id').value = orderId;
  document.getElementById('refund-display-order-id').textContent = orderId;
  document.getElementById('refund-display-pay-id').textContent = payId || 'Verified Gateway ID';
  document.getElementById('refund-display-total').textContent = `₹${parseFloat(total).toFixed(2)}`;
  document.getElementById('refund-amount').value = total;
  document.getElementById('modal-refund').classList.remove('hidden');
}

async function handleRefundSubmit(e) {
  e.preventDefault();
  const orderId = document.getElementById('refund-order-id').value;
  const amount = document.getElementById('refund-amount').value;
  const reason = document.getElementById('refund-reason').value;

  try {
    const data = await adminApiFetch('/api/payments/refund', {
      method: 'POST',
      body: JSON.stringify({ orderId, amount, reason })
    });

    showToast(data.message, 'success');
    document.getElementById('modal-refund').classList.add('hidden');
    loadPayments();
    loadOrders();
    loadOverview();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

/* ==========================================
   ANALYTICS & REPORTS
   ========================================== */
async function loadAnalytics() {
  try {
    const rev = await adminApiFetch('/api/admin/revenue-analytics');

    document.getElementById('rev-gross').textContent = `₹${rev.grossSales.toLocaleString('en-IN')}`;
    document.getElementById('rev-net').textContent = `₹${rev.netSales.toLocaleString('en-IN')}`;
    document.getElementById('rev-refunds').textContent = `₹${rev.refundAmount.toLocaleString('en-IN')}`;
    document.getElementById('rev-taxes').textContent = `₹${rev.taxes.toLocaleString('en-IN')}`;
    document.getElementById('rev-shipping').textContent = `₹${rev.shippingRevenue.toLocaleString('en-IN')}`;
    document.getElementById('rev-aov').textContent = `₹${rev.avgOrderValue.toLocaleString('en-IN')}`;

    const bestProds = await adminApiFetch('/api/admin/analytics/products');
    const tbody = document.getElementById('best-products-tbody');
    tbody.innerHTML = bestProds.map(p => `
      <tr>
        <td><strong>${p.name}</strong></td>
        <td><code>${p.sku}</code></td>
        <td>${p.category}</td>
        <td><strong>${p.unitsSold} units</strong></td>
        <td><strong>₹${p.revenue.toFixed(2)}</strong></td>
        <td>${p.currentStock} units</td>
      </tr>
    `).join('');
  } catch (e) {}
}

/* ==========================================
   AUDIT LOGS
   ========================================== */
async function loadAuditLogs() {
  try {
    const logs = await adminApiFetch('/api/admin/audit-logs');

    const tbody = document.getElementById('audit-logs-tbody');
    tbody.innerHTML = logs.map(l => `
      <tr>
        <td>${new Date(l.timestamp).toLocaleString()}</td>
        <td><strong>${l.adminName}</strong></td>
        <td><span class="role-badge">${l.role || 'admin'}</span></td>
        <td><strong>${l.action}</strong></td>
        <td>${l.entity}</td>
        <td>${l.details}</td>
        <td><code>${l.ip || '127.0.0.1'}</code></td>
      </tr>
    `).join('');
  } catch (e) {}
}

/* ==========================================
   STAFF MANAGEMENT
   ========================================== */
async function loadStaff() {
  try {
    const staff = await adminApiFetch('/api/admin/staff');

    const tbody = document.getElementById('staff-table-tbody');
    tbody.innerHTML = staff.map(s => `
      <tr>
        <td><strong>${s.name}</strong></td>
        <td>${s.email}</td>
        <td>${s.phone || 'N/A'}</td>
        <td><span class="role-badge">${s.role.toUpperCase().replace('_', ' ')}</span></td>
        <td>
          ${currentAdminUser && currentAdminUser.role === 'super_admin' ? `
            <select class="select-admin" onchange="updateStaffRole('${s.id}', this.value)">
              <option value="super_admin" ${s.role === 'super_admin' ? 'selected' : ''}>Super Admin</option>
              <option value="admin" ${s.role === 'admin' ? 'selected' : ''}>Admin</option>
              <option value="order_manager" ${s.role === 'order_manager' ? 'selected' : ''}>Order Manager</option>
              <option value="product_manager" ${s.role === 'product_manager' ? 'selected' : ''}>Product Manager</option>
              <option value="support_staff" ${s.role === 'support_staff' ? 'selected' : ''}>Support Staff</option>
            </select>
          ` : 'No Action'}
        </td>
      </tr>
    `).join('');
  } catch (e) {}
}

async function handleStaffSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('staff-name').value;
  const email = document.getElementById('staff-email').value;
  const password = document.getElementById('staff-password').value;
  const role = document.getElementById('staff-role').value;

  try {
    const data = await adminApiFetch('/api/admin/staff', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, role })
    });

    showToast('Staff account created successfully!', 'success');
    document.getElementById('modal-staff').classList.add('hidden');
    loadStaff();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

async function updateStaffRole(id, role) {
  try {
    const data = await adminApiFetch(`/api/admin/staff/${id}/role`, {
      method: 'PUT',
      body: JSON.stringify({ role })
    });
    showToast(data.message, 'success');
    loadStaff();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

/* ==========================================
   REAL-TIME SSE SYNC
   ========================================== */
function initSSESync() {
  if (!window.EventSource) return;
  try {
    const sseUrl = getApiUrl('/api/admin/events');
    sseEventSource = new EventSource(sseUrl);

    sseEventSource.onopen = () => {
      document.getElementById('sse-status').classList.remove('hidden');
      document.getElementById('sse-text').textContent = 'Live Sync';
    };

    sseEventSource.addEventListener('order_updated', (e) => {
      const data = JSON.parse(e.data);
      showToast(`Order #${data.orderId} updated to ${data.status}`, 'success');
      loadOverview();
      loadOrders();
    });

    sseEventSource.addEventListener('low_stock_alert', (e) => {
      const data = JSON.parse(e.data);
      showToast(`LOW STOCK WARNING: "${data.name}" has only ${data.stock} units left!`, 'error');
      loadOverview();
      loadInventory();
    });

    sseEventSource.onerror = () => {
      document.getElementById('sse-text').textContent = 'Sync Reconnecting...';
    };
  } catch (e) {}
}

/* ==========================================
   UTILITY & HELPERS
   ========================================== */
function exportCSV(type) {
  window.open(getApiUrl(`/api/admin/export/${type}?token=${currentToken}`), '_blank');
}

function getPaymentStatusClass(status) {
  if (!status) return 'paid';
  const s = status.toUpperCase();
  if (s.includes('PAID') || s.includes('CONFIRMED')) return 'paid';
  if (s.includes('PENDING')) return 'pending';
  if (s.includes('REFUND')) return 'danger';
  return 'failed';
}

function getOrderStatusClass(status) {
  if (!status) return 'info';
  const s = status.toLowerCase();
  if (s.includes('deliver')) return 'delivered';
  if (s.includes('cancel')) return 'cancelled';
  if (s.includes('ship') || s.includes('dispatch') || s.includes('pack')) return 'shipped';
  return 'pending';
}

function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<i class="fa-solid ${type === 'success' ? 'fa-circle-check' : 'fa-triangle-exclamation'}"></i> <span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 4000);
}

function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

/* ==========================================
   3D MODELS & YARN COLOR MAPPING STUDIO
   ========================================== */
let cachedProductsList = [];
let admin3DRenderer = null;
let admin3DScene = null;
let admin3DCamera = null;
let admin3DControls = null;
let admin3DAnimId = null;

let preview3DRenderer = null;
let preview3DScene = null;
let preview3DCamera = null;
let preview3DControls = null;
let preview3DAnimId = null;
let current3DJobId = null;
let current3DTargetProductId = null;
let adminCrochetBumpTex = null;

function getAdminCrochetBumpTexture() {
  if (adminCrochetBumpTex) return adminCrochetBumpTex;
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, 256, 256);

  ctx.lineWidth = 4;
  for (let y = 0; y < 256; y += 16) {
    for (let x = 0; x < 256; x += 16) {
      const offset = (Math.floor(y / 16) % 2 === 0) ? 0 : 8;
      const px = (x + offset) % 256;

      ctx.strokeStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(px + 4, y + 8, 5, Math.PI * 0.2, Math.PI * 0.8, false);
      ctx.stroke();

      ctx.strokeStyle = '#303030';
      ctx.beginPath();
      ctx.arc(px + 12, y + 8, 5, Math.PI * 1.2, Math.PI * 1.8, false);
      ctx.stroke();
    }
  }

  if (window.THREE) {
    adminCrochetBumpTex = new THREE.CanvasTexture(canvas);
    adminCrochetBumpTex.wrapS = THREE.RepeatWrapping;
    adminCrochetBumpTex.wrapT = THREE.RepeatWrapping;
    adminCrochetBumpTex.repeat.set(6, 6);
  }
  return adminCrochetBumpTex;
}

async function load3DModelsTab() {
  try {
    const products = await adminApiFetch('/api/admin/products');
    cachedProductsList = products || [];

    const tbody = document.getElementById('models3d-table-tbody');
    if (!tbody) return;

    if (cachedProductsList.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 24px; color: #94A3B8;">No products found. Add products to configure 3D models.</td></tr>`;
      return;
    }

    tbody.innerHTML = cachedProductsList.map(p => {
      const has3D = Boolean(p.has3DModel);
      const mType = p.modelType || (has3D ? 'sunflower' : 'none');
      const photo = (p.images && p.images[0]) || 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?auto=format&fit=crop&w=100';
      
      let partsStr = 'N/A (2D Image)';
      if (has3D) {
        if (p.customParts) {
          partsStr = Object.values(p.customParts).map(part => part.label || 'Part').join(', ');
        } else if (mType === 'bouquet') {
          partsStr = 'Petals, Bouquet Core, Ribbon';
        } else if (mType === 'sunflower') {
          partsStr = 'Sun Petals, Seed Disk, Leaf Stem';
        } else if (mType === 'bow') {
          partsStr = 'Ribbon Loops, Knot, Ribbon Tails';
        } else if (mType === 'bunny') {
          partsStr = 'Amigurumi Body, Ears, Cheeks';
        } else {
          partsStr = 'Main Yarn Body, Accent Trim';
        }
      }

      return `
        <tr>
          <td>
            <div style="display:flex; align-items:center; gap:12px;">
              <img src="${photo}" style="width:42px; height:42px; border-radius:8px; object-fit:cover; border:1px solid #334155;">
              <div>
                <strong style="color: #F8FAFC;">${p.name}</strong><br>
                <code style="font-size:11.5px; color:#94A3B8;">${p.sku || 'SKU-N/A'}</code>
              </div>
            </div>
          </td>
          <td><span style="color: #CBD5E1;">${p.category || 'General'}</span></td>
          <td>
            <span class="status-pill ${has3D ? 'success' : 'warning'}">
              <i class="fa-solid ${has3D ? 'fa-cube' : 'fa-image'}"></i> ${has3D ? '3D Interactive' : 'Photo Only'}
            </span>
          </td>
          <td>
            <code style="background: #0F172A; padding: 4px 8px; border-radius: 6px; color: #E89CAE;">${mType}</code>
          </td>
          <td style="font-size: 12.5px; color: #CBD5E1;">${partsStr}</td>
          <td>
            <button class="btn-primary-admin" style="padding: 6px 14px; font-size: 12px; border-radius: 20px;" onclick="inspect3DModel('${p.id}')">
              <i class="fa-solid fa-eye"></i> Inspect 3D
            </button>
            <button class="btn-secondary-admin" style="padding: 6px 12px; font-size: 12px; border-radius: 20px; margin-left: 6px;" onclick="openEditProductModal('${p.id}')">
              <i class="fa-solid fa-pen-to-square"></i> Configure
            </button>
          </td>
        </tr>
      `;
    }).join('');
  } catch (err) {
    showToast(`Failed to load 3D catalog: ${err.message}`, 'error');
  }
}

function buildAdminProceduralModel(modelType, primaryColor = '#E89CAE') {
  if (!window.THREE) return null;
  const group = new THREE.Group();
  const bump = getAdminCrochetBumpTexture();

  const createYarnMat = (hex, roughness = 0.88) => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color(hex),
      roughness: roughness,
      metalness: 0.05,
      bumpMap: bump,
      bumpScale: 0.06
    });
  };

  const matPrimary = createYarnMat(primaryColor);
  const matCore = createYarnMat('#F9E79F');
  const matStem = createYarnMat('#8A9A86');
  const matRibbon = createYarnMat('#F4D03F');

  if (modelType === 'sunflower') {
    // Seed disk center
    const diskGeo = new THREE.CylinderGeometry(0.85, 0.85, 0.35, 24);
    const diskMat = createYarnMat('#5D4037');
    const disk = new THREE.Mesh(diskGeo, diskMat);
    disk.rotation.x = Math.PI / 2;
    group.add(disk);

    // 14 Ray Petals
    const petalGeo = new THREE.ConeGeometry(0.3, 1.2, 12);
    petalGeo.translate(0, 0.6, 0);
    const petalCount = 14;
    for (let i = 0; i < petalCount; i++) {
      const angle = (i / petalCount) * Math.PI * 2;
      const petal = new THREE.Mesh(petalGeo, createYarnMat('#F9E79F'));
      petal.rotation.z = angle - Math.PI / 2;
      petal.position.x = Math.cos(angle) * 0.85;
      petal.position.y = Math.sin(angle) * 0.85;
      petal.rotation.x = 0.1;
      group.add(petal);
    }

    // Stem
    const stemGeo = new THREE.CylinderGeometry(0.12, 0.12, 2.6, 12);
    const stem = new THREE.Mesh(stemGeo, matStem);
    stem.position.y = -1.5;
    group.add(stem);

  } else if (modelType === 'bow') {
    // Bow knot
    const knotGeo = new THREE.TorusGeometry(0.32, 0.18, 16, 24);
    const knot = new THREE.Mesh(knotGeo, matPrimary);
    group.add(knot);

    // Left and right loops
    const loopGeo = new THREE.TorusGeometry(0.9, 0.3, 16, 32, Math.PI);
    const loopL = new THREE.Mesh(loopGeo, matPrimary);
    loopL.position.x = -0.9;
    loopL.rotation.z = Math.PI / 2;
    group.add(loopL);

    const loopR = new THREE.Mesh(loopGeo, matPrimary);
    loopR.position.x = 0.9;
    loopR.rotation.z = -Math.PI / 2;
    group.add(loopR);

    // Ribbon tails
    const tailGeo = new THREE.CylinderGeometry(0.2, 0.26, 1.8, 12);
    const tailL = new THREE.Mesh(tailGeo, matPrimary);
    tailL.position.set(-0.55, -1.0, 0.1);
    tailL.rotation.z = 0.28;
    group.add(tailL);

    const tailR = new THREE.Mesh(tailGeo, matPrimary);
    tailR.position.set(0.55, -1.0, 0.1);
    tailR.rotation.z = -0.28;
    group.add(tailR);

  } else if (modelType === 'bunny') {
    // Head & Body
    const headGeo = new THREE.SphereGeometry(1.0, 24, 24);
    const head = new THREE.Mesh(headGeo, matPrimary);
    group.add(head);

    const earGeo = new THREE.CylinderGeometry(0.22, 0.35, 1.6, 16);
    const earL = new THREE.Mesh(earGeo, matPrimary);
    earL.position.set(-0.55, 1.4, 0);
    earL.rotation.z = 0.2;
    group.add(earL);

    const earR = new THREE.Mesh(earGeo, matPrimary);
    earR.position.set(0.55, 1.4, 0);
    earR.rotation.z = -0.2;
    group.add(earR);

    // Cheeks
    const cheekGeo = new THREE.SphereGeometry(0.18, 12, 12);
    const cheekMat = createYarnMat('#FFB6C1');
    const chL = new THREE.Mesh(cheekGeo, cheekMat);
    chL.position.set(-0.45, -0.15, 0.9);
    group.add(chL);
    const chR = new THREE.Mesh(cheekGeo, cheekMat);
    chR.position.set(0.45, -0.15, 0.9);
    group.add(chR);

  } else {
    // Bouquet / Rose Rosette Default
    const flowerGroup = new THREE.Group();
    const coreGeo = new THREE.SphereGeometry(0.5, 16, 16);
    const core = new THREE.Mesh(coreGeo, matCore);
    flowerGroup.add(core);

    const petalCount = 8;
    for (let i = 0; i < petalCount; i++) {
      const angle = (i / petalCount) * Math.PI * 2;
      const petalGeo = new THREE.SphereGeometry(0.42, 12, 12);
      petalGeo.scale(1.2, 0.5, 0.8);
      const petal = new THREE.Mesh(petalGeo, matPrimary);
      petal.position.set(Math.cos(angle) * 0.7, Math.sin(angle) * 0.7, 0);
      petal.rotation.z = angle;
      flowerGroup.add(petal);
    }
    flowerGroup.position.y = 0.5;
    group.add(flowerGroup);

    // Bouquet Kraft Wrap
    const coneGeo = new THREE.ConeGeometry(1.3, 2.5, 18, 1, true);
    coneGeo.rotateX(Math.PI);
    const wrapMat = createYarnMat('#E6D7C3');
    const wrapMesh = new THREE.Mesh(coneGeo, wrapMat);
    wrapMesh.position.y = -1.0;
    group.add(wrapMesh);

    // Bow tie on wrap
    const tieGeo = new THREE.TorusGeometry(0.3, 0.1, 12, 18);
    const tie = new THREE.Mesh(tieGeo, matRibbon);
    tie.position.set(0, -0.6, 0.7);
    group.add(tie);
  }

  return group;
}

function inspect3DModel(prodId) {
  const product = cachedProductsList.find(p => p.id === prodId);
  if (!product) {
    showToast('Product not found in current catalog list.', 'error');
    return;
  }

  const canvas = document.getElementById('admin-3d-canvas');
  const emptyMsg = document.getElementById('admin-3d-empty-msg');
  if (!canvas) return;

  if (emptyMsg) emptyMsg.style.display = 'none';

  if (!window.THREE) {
    showToast('3D engine is loading, please try again in a moment.', 'info');
    return;
  }

  // Cancel prior animation frame
  if (admin3DAnimId) cancelAnimationFrame(admin3DAnimId);

  const container = document.getElementById('admin-3d-viewport');
  const width = container.clientWidth || 600;
  const height = container.clientHeight || 320;

  if (!admin3DRenderer) {
    admin3DRenderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    admin3DRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }
  admin3DRenderer.setSize(width, height);

  admin3DScene = new THREE.Scene();

  admin3DCamera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
  admin3DCamera.position.set(0, 1.2, 5.2);

  if (window.THREE.OrbitControls) {
    admin3DControls = new THREE.OrbitControls(admin3DCamera, admin3DRenderer.domElement);
    admin3DControls.enableDamping = true;
    admin3DControls.dampingFactor = 0.05;
    admin3DControls.autoRotate = true;
    admin3DControls.autoRotateSpeed = 2.0;
  }

  // Studio lighting
  const ambLight = new THREE.AmbientLight(0xFFF7ED, 0.85);
  admin3DScene.add(ambLight);

  const dirLight1 = new THREE.DirectionalLight(0xFFE4D6, 1.1);
  dirLight1.position.set(4, 7, 5);
  admin3DScene.add(dirLight1);

  const dirLight2 = new THREE.DirectionalLight(0xCCE7E8, 0.5);
  dirLight2.position.set(-4, -2, -3);
  admin3DScene.add(dirLight2);

  // Model creation
  const mType = product.modelType || (product.has3DModel ? 'bouquet' : 'bouquet');
  const model = buildAdminProceduralModel(mType, '#E89CAE');
  if (model) {
    admin3DScene.add(model);
  }

  function renderLoop() {
    admin3DAnimId = requestAnimationFrame(renderLoop);
    if (admin3DControls) admin3DControls.update();
    admin3DRenderer.render(admin3DScene, admin3DCamera);
  }
  renderLoop();

  showToast(`Previewing 3D Model: "${product.name}" (${mType})`, 'info');

  // Smooth scroll into view
  container.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

/* ==========================================
   IMAGE-TO-3D RECONSTRUCTION WORKFLOW
   ========================================== */
async function loadImageTo3DTab() {
  try {
    const products = await adminApiFetch('/api/admin/products');
    cachedProductsList = products || [];

    const select = document.getElementById('img3d-target-product');
    if (!select) return;

    select.innerHTML = '<option value="">-- Choose Product to Attach 3D Model --</option>' +
      cachedProductsList.map(p => `
        <option value="${p.id}">${p.name} [${p.category}] - ${p.has3DModel ? 'Reconstruct 3D' : 'No 3D Model'}</option>
      `).join('');
  } catch (err) {
    console.error('Failed to populate products for Image-to-3D:', err);
  }
}

async function handleImageTo3DSubmit(e) {
  e.preventDefault();
  const select = document.getElementById('img3d-target-product');
  const productId = select?.value;
  const promptHint = document.getElementById('img3d-prompt-hint')?.value.trim() || '';
  const frontFileInput = document.getElementById('img3d-file-front');

  if (!productId) {
    showToast('Please select a target product.', 'error');
    return;
  }

  const btn = document.getElementById('btn-start-3d-job');
  const progressWrap = document.getElementById('img3d-progress-wrap');
  const progressBar = document.getElementById('img3d-progress-bar');
  const stageText = document.getElementById('img3d-stage-text');
  const percentText = document.getElementById('img3d-percent-text');
  const actionControls = document.getElementById('img3d-action-controls');
  const previewEmpty = document.getElementById('img3d-preview-empty');
  const previewCanvas = document.getElementById('img3d-preview-canvas');

  current3DTargetProductId = productId;
  btn.disabled = true;
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Submitting Reconstruction Job...';
  progressWrap.style.display = 'block';
  actionControls.style.display = 'none';

  try {
    const res = await adminApiFetch('/api/admin/image3d/generate', {
      method: 'POST',
      body: JSON.stringify({
        productId,
        promptHint,
        referencePhotoUrl: 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?auto=format&fit=crop&w=600&q=80'
      })
    });

    const jobId = res.jobId;
    current3DJobId = jobId;
    showToast('Reconstruction job started! Processing photos...', 'info');

    // Poll status every 800ms
    const pollInterval = setInterval(async () => {
      try {
        const job = await adminApiFetch(`/api/admin/image3d/status/${jobId}`);
        const pct = job.progress || 0;
        progressBar.style.width = `${pct}%`;
        percentText.textContent = `${pct}%`;
        stageText.textContent = job.stage || 'Reconstructing 3D mesh...';

        if (job.status === 'completed' || pct >= 100) {
          clearInterval(pollInterval);
          btn.disabled = false;
          btn.innerHTML = '<i class="fa-solid fa-wand-magic-sparkles"></i> Submit 3D Reconstruction Job';

          // Show action controls
          actionControls.style.display = 'flex';
          showToast('3D Reconstruction completed! Inspect the preview model.', 'success');

          // Render live preview canvas
          if (previewEmpty) previewEmpty.style.display = 'none';
          if (previewCanvas) {
            previewCanvas.style.display = 'block';
            init3DReconstructionPreview(productId);
          }
        }
      } catch (pollErr) {
        clearInterval(pollInterval);
        btn.disabled = false;
        btn.innerHTML = '<i class="fa-solid fa-wand-magic-sparkles"></i> Submit 3D Reconstruction Job';
        showToast(`Polling error: ${pollErr.message}`, 'error');
      }
    }, 800);

  } catch (err) {
    btn.disabled = false;
    btn.innerHTML = '<i class="fa-solid fa-wand-magic-sparkles"></i> Submit 3D Reconstruction Job';
    showToast(`Failed to start 3D job: ${err.message}`, 'error');
  }
}

function init3DReconstructionPreview(productId) {
  const canvas = document.getElementById('img3d-preview-canvas');
  const container = document.getElementById('img3d-preview-viewport');
  if (!canvas || !container || !window.THREE) return;

  if (preview3DAnimId) cancelAnimationFrame(preview3DAnimId);

  const w = container.clientWidth || 300;
  const h = container.clientHeight || 220;

  if (!preview3DRenderer) {
    preview3DRenderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    preview3DRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }
  preview3DRenderer.setSize(w, h);

  preview3DScene = new THREE.Scene();
  preview3DCamera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
  preview3DCamera.position.set(0, 1.2, 4.8);

  if (window.THREE.OrbitControls) {
    preview3DControls = new THREE.OrbitControls(preview3DCamera, preview3DRenderer.domElement);
    preview3DControls.enableDamping = true;
    preview3DControls.autoRotate = true;
    preview3DControls.autoRotateSpeed = 3.0;
  }

  const amb = new THREE.AmbientLight(0xFFF8ED, 0.9);
  preview3DScene.add(amb);
  const dir = new THREE.DirectionalLight(0xFFE5D9, 1.2);
  dir.position.set(3, 5, 4);
  preview3DScene.add(dir);

  const prod = cachedProductsList.find(p => p.id === productId);
  const mType = (prod && prod.modelType && prod.modelType !== 'none') ? prod.modelType : 'sunflower';
  const model = buildAdminProceduralModel(mType, '#E89CAE');
  if (model) preview3DScene.add(model);

  function loop() {
    preview3DAnimId = requestAnimationFrame(loop);
    if (preview3DControls) preview3DControls.update();
    preview3DRenderer.render(preview3DScene, preview3DCamera);
  }
  loop();
}

async function approveGenerated3DModel() {
  if (!current3DJobId) {
    showToast('No active completed 3D reconstruction job to approve.', 'error');
    return;
  }

  try {
    const res = await adminApiFetch(`/api/admin/image3d/approve/${current3DJobId}`, {
      method: 'POST',
      body: JSON.stringify({ targetProductId: current3DTargetProductId })
    });

    showToast(res.message || '3D Model successfully published to product!', 'success');

    // Reset workflow
    discardGenerated3DJob();

    // Reload products & 3D models table
    loadProducts();
    load3DModelsTab();
  } catch (err) {
    showToast(`Approval failed: ${err.message}`, 'error');
  }
}

function discardGenerated3DJob() {
  current3DJobId = null;
  const progressWrap = document.getElementById('img3d-progress-wrap');
  const actionControls = document.getElementById('img3d-action-controls');
  const previewEmpty = document.getElementById('img3d-preview-empty');
  const previewCanvas = document.getElementById('img3d-preview-canvas');

  if (progressWrap) progressWrap.style.display = 'none';
  if (actionControls) actionControls.style.display = 'none';
  if (previewCanvas) previewCanvas.style.display = 'none';
  if (previewEmpty) previewEmpty.style.display = 'block';

  if (preview3DAnimId) cancelAnimationFrame(preview3DAnimId);
}

