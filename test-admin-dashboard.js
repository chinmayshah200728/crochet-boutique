const http = require('http');

const BASE_URL = 'http://localhost:3000';

function makeRequest(method, path, body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      method: method,
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, data: parsed, raw: data });
        } catch (e) {
          resolve({ status: res.statusCode, data: null, raw: data });
        }
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

let superAdminToken = '';
let orderMgrToken = '';
let prodMgrToken = '';
let supportToken = '';

async function runAdminTests() {
  console.log('🚀 Starting Comprehensive Admin Dashboard Test Suite for crochetbyprisha...\n');
  let passed = 0;
  let failed = 0;

  function assert(condition, testName, detail = '') {
    if (condition) {
      console.log(`✅ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${testName} ${detail ? '-> ' + detail : ''}`);
      failed++;
    }
  }

  try {
    // 1. MASTER ADMIN LOGIN TEST
    let res = await makeRequest('POST', '/api/admin/login', { loginId: 'prishashah2809', password: 'prisha@2809' });
    assert(res.status === 200 && res.data.token && res.data.user.role === 'super_admin', '1. Master Super Admin Login (prishashah2809)');
    superAdminToken = res.data.token;
    orderMgrToken = res.data.token;
    prodMgrToken = res.data.token;
    supportToken = res.data.token;

    // 2. UNAUTHORIZED CUSTOMER REJECTION
    res = await makeRequest('POST', '/api/admin/login', { email: 'aria@example.com', password: 'admin123' });
    assert(res.status === 403, '5. Reject Customer Account Access to Admin Panel');

    res = await makeRequest('GET', '/api/admin/dashboard-stats');
    assert(res.status === 401, '6. Reject Unauthenticated Dashboard Request');

    // 4. ORDER MANAGEMENT, STATUS UPDATES & HARD DELETION
    // Create a temporary order to test lifecycle and deletion
    const tempOrderPayload = {
      items: [{ productId: 'prod-1', name: 'Pastel Bouquet', price: 499, qty: 1, color: 'Pastel Pink' }],
      shippingAddress: { name: 'Test User', address: '123 Test St', city: 'Mumbai', state: 'MH', zip: '400001' },
      paymentMethod: 'ONLINE',
      paymentTxnId: 'pay_test_del_123',
      subtotal: 499,
      shipping: 50,
      tax: 25,
      total: 574,
      customerName: 'Test Customer',
      customerEmail: 'testcustomer@example.com'
    };

    res = await makeRequest('POST', '/api/orders', tempOrderPayload);
    const testOrderId = res.data && res.data.order ? res.data.order.id : null;
    assert(res.status === 200 && testOrderId, '11. Create Test Order for Lifecycle & Deletion Verification');

    if (testOrderId) {
      res = await makeRequest('GET', `/api/admin/orders/${testOrderId}`, null, { 'Authorization': `Bearer ${orderMgrToken}` });
      assert(res.status === 200 && res.data.id === testOrderId, '12. View Detailed Order Info');

      res = await makeRequest('PUT', `/api/admin/orders/${testOrderId}/status`, {
        status: 'Packed',
        courier: 'Blue Dart Express',
        trackingNumber: 'TRK-TEST-99201'
      }, { 'Authorization': `Bearer ${orderMgrToken}` });
      assert(res.status === 200 && res.data.order.status === 'Packed', '13. Update Order Lifecycle to "Packed"');

      res = await makeRequest('GET', `/api/admin/orders/${testOrderId}/invoice`, null, { 'Authorization': `Bearer ${superAdminToken}` });
      assert(res.status === 200 && res.raw.includes('TAX INVOICE'), '14. Printable HTML Invoice Generation');

      // Test DELETE order endpoint
      res = await makeRequest('DELETE', `/api/admin/orders/${testOrderId}`, null, { 'Authorization': `Bearer ${superAdminToken}` });
      assert(res.status === 200 && res.data.orderId === testOrderId, '15. Hard Delete Order Endpoint (DELETE /api/admin/orders/:id)');
    }

    // 5. PRODUCT & CATALOG MANAGEMENT
    const newProd = {
      name: 'Automated Test Amigurumi Bunny',
      category: 'cat-plushies',
      price: 599.00,
      salePrice: 499.00,
      costPrice: 200.00,
      stock: 12,
      lowStockThreshold: 4,
      yarnType: '100% Cotton Thread',
      description: 'Test bunny crafted with love.'
    };
    res = await makeRequest('POST', '/api/admin/products', newProd, { 'Authorization': `Bearer ${prodMgrToken}` });
    assert(res.status === 200 && res.data.product.id && res.data.product.sku.includes('SKU-PRISHA'), '16. Create Product with SKU');
    const createdProdId = res.data.product.id;

    res = await makeRequest('PUT', `/api/admin/products/${createdProdId}`, { price: 649.00, stock: 15 }, { 'Authorization': `Bearer ${prodMgrToken}` });
    assert(res.status === 200 && res.data.product.price === 649.00, '17. Edit Product Price & Stock');

    res = await makeRequest('POST', `/api/admin/products/${createdProdId}/duplicate`, null, { 'Authorization': `Bearer ${prodMgrToken}` });
    assert(res.status === 200 && res.data.product.name.includes('(Copy)'), '18. Duplicate Product');

    res = await makeRequest('POST', `/api/admin/products/${createdProdId}/archive`, null, { 'Authorization': `Bearer ${prodMgrToken}` });
    assert(res.status === 200 && res.data.product.status === 'archived', '19. Archive Product');

    // 6. INVENTORY ADJUSTMENT & REASON LOGGING
    res = await makeRequest('POST', '/api/admin/inventory/adjust', {
      productId: createdProdId,
      changeQty: 5,
      reason: 'Stock Received'
    }, { 'Authorization': `Bearer ${prodMgrToken}` });
    assert(res.status === 200 && res.data.product.stock === 20, '20. Adjust Inventory Stock (+5)');

    res = await makeRequest('GET', '/api/admin/inventory/logs', null, { 'Authorization': `Bearer ${prodMgrToken}` });
    assert(res.status === 200 && res.data.length > 0, '21. Inventory Adjustment History Logs');

    // 7. CUSTOMER MANAGEMENT
    res = await makeRequest('GET', '/api/admin/customers', null, { 'Authorization': `Bearer ${supportToken}` });
    assert(res.status === 200 && Array.isArray(res.data), '22. Customer Directory Listing');

    // 8. AUDIT LOGS
    res = await makeRequest('GET', '/api/admin/audit-logs', null, { 'Authorization': `Bearer ${superAdminToken}` });
    assert(res.status === 200 && Array.isArray(res.data), '23. System Audit Logs Endpoint');

  } catch (err) {
    console.error('Test execution error:', err);
  }

  console.log('\n========================================');
  console.log(`📊 TEST RESULTS: ${passed} PASSED, ${failed} FAILED out of ${passed + failed} TESTS`);
  console.log('========================================\n');
}

runAdminTests();
