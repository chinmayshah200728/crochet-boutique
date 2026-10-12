// Crochet by Prisha - Application Bundle Logic
let currentUser = JSON.parse(localStorage.getItem('sp_user') || 'null');
let authToken = localStorage.getItem('sp_token') || null;
let cart = JSON.parse(localStorage.getItem('sp_cart') || '[]');
let wishlist = JSON.parse(localStorage.getItem('sp_wishlist') || '[]');

let categories = [
  { id: "cat-flowers", name: "Flowers", slug: "flowers", icon: "💐", image: "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?auto=format&fit=crop&w=600&q=80", description: "Everlasting handcrafted crochet floral arrangements. Gift wrapping optional." },
  { id: "cat-hair", name: "Hair Accessories", slug: "hair-accessories", icon: "✨", image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80", description: "Hand-stitched floral scrunchies, aesthetic clips, and tulip headbands." },
  { id: "cat-keychains", name: "Keychains", slug: "keychains", icon: "🎀", image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=600&q=80", description: "Pocket-sized crochet cuteness for your bags, keys, and backpacks." },
  { id: "cat-hampers", name: "Gift Hampers", slug: "gift-hampers", icon: "🎁", image: "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=600&q=80", description: "Curated gift hampers with flowers, keychains, clips, and gift boxes." }
];

let heroSlides = [
  {
    id: "slide-1",
    title: "Tulip & Rose Handmade Bouquet",
    subtitle: "100% Cotton Yarn • Gift wrapping optional",
    icon: "💐",
    image: "https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "slide-2",
    title: "Floral Hair Clips & Scrunchies",
    subtitle: "Soft on Hair • Everlasting Handcrafted Charms",
    icon: "✨",
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "slide-3",
    title: "Forever Sunflower Single Stem",
    subtitle: "Golden Cotton Petals • Never Wilts",
    icon: "🌻",
    image: "https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "slide-4",
    title: "Deluxe Handcrafted Gift Hamper",
    subtitle: "Bouquet, Clips & Keychain",
    icon: "🎁",
    image: "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=800&q=80"
  }
];

let products = [
  {
    id: "prod-plush-1",
    name: "Bow keychain",
    slug: "mochi-strawberry-bunny-plushie",
    category: "cat-keychains",
    price: 85,
    salePrice: null,
    costPrice: 34,
    isSale: true,
    isBestseller: true,
    isNew: true,
    rating: 5,
    reviewsCount: 36,
    stock: 17,
    yarnType: "100% Natural Cotton Yarn",
    colors: ["Red", "Light Blue", "Pink", "Purple", "Black", "White", "Butter Yellow"],
    description: "A charming handcrafted bow keychain made with soft cotton yarn in a variety of vibrant shades.",
    images: ["https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80"],
    customization: { allowGiftWrap: false, allowColorPicker: true, allowCustomText: false }
  },
  {
    id: "prod-1",
    name: "Tulip & Rose Handmade Crochet Bouquet",
    slug: "tulip-rose-handmade-crochet-bouquet",
    category: "cat-flowers",
    price: 899,
    salePrice: 799,
    isSale: true,
    isBestseller: true,
    isNew: true,
    rating: 5,
    reviewsCount: 48,
    stock: 15,
    yarnType: "100% Natural Cotton Yarn",
    colors: ["Soft Pink & Lavender", "Pastel Yellow & White", "Peach & Sage Green", "Crimson Red & Cream", "Lilac & Sky Blue", "Pure Snow White"],
    description: "The cotton yarn is a soft, breathable, natural-fibre yarn with a smooth texture, ideal for creating detailed crochet flowers, accessories, keychains, and other handmade pieces. Gift wrapping optional.",
    images: ["https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=800&q=80"],
    customization: { allowGiftWrap: true, giftWrapPrice: 99, allowColorPicker: true, allowCustomText: true }
  },
  {
    id: "prod-2",
    name: "Love & Blooms Deluxe Gift Hamper",
    slug: "love-blooms-deluxe-hamper",
    category: "cat-hampers",
    price: 1499,
    salePrice: 1299,
    isSale: true,
    isBestseller: true,
    isNew: true,
    rating: 5,
    reviewsCount: 32,
    stock: 10,
    yarnType: "100% Natural Cotton Yarn",
    colors: ["Blush Pink Edition", "Lavender Dream Edition", "Sage & Cream Edition", "Sunset Coral Edition", "Midnight Rose Edition"],
    description: "The ultimate gift hamper! Includes 1 Tulip Bouquet, 1 Mini Bunny Keychain, 1 Daisy Hair Scrunchie, and personalized handwritten card inside an aesthetic box.",
    images: ["https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=800&q=80"],
    customization: { allowGiftWrap: false, allowColorPicker: true, allowCustomText: true }
  },
  {
    id: "prod-3",
    name: "Vintage Daisy Crochet Hair Scrunchie Set",
    slug: "vintage-daisy-hair-scrunchie-set",
    category: "cat-hair",
    price: 299,
    salePrice: null,
    isSale: false,
    isBestseller: true,
    isNew: false,
    rating: 4.9,
    reviewsCount: 28,
    stock: 17,
    yarnType: "100% Natural Cotton Yarn",
    colors: ["Pastel Trio (Pink, Lavender, Sky Blue)", "Earthy Trio (Cream, Peach, Sage)", "Sunny Trio (Butter Yellow, White, Honey)", "Monochrome Trio (Black, Grey, White)", "Berry Trio (Wine, Rose, Mauve)"],
    description: "Super cute set of 3 hand-stitched floral scrunchies. Soft on hair, no pulling or creasing. Features cute 3D daisy flower accents.",
    images: ["https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80"],
    customization: { allowGiftWrap: false, allowColorPicker: true, allowCustomText: false }
  },
  {
    id: "prod-4",
    name: "Mini Fluffy Bunny & Heart Keychain Trio",
    slug: "mini-fluffy-bunny-keychain-trio",
    category: "cat-keychains",
    price: 349,
    salePrice: null,
    isSale: false,
    isBestseller: true,
    isNew: true,
    rating: 5,
    reviewsCount: 41,
    stock: 30,
    yarnType: "100% Natural Cotton Yarn",
    colors: ["Baby Pink", "Lavender Purple", "Sky Blue", "Matcha Green", "Buttercream Yellow", "Caramel Brown", "Classic White"],
    description: "Pocket-sized crochet joy! Set of 3 adorable mini bunny keychains with shiny pearl beads and silver keyrings attached.",
    images: ["https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80"],
    customization: { allowGiftWrap: false, allowColorPicker: true, allowCustomText: true }
  },
  {
    id: "prod-5",
    name: "Forever Sunflower Single Stem",
    slug: "forever-sunflower-single-stem",
    category: "cat-flowers",
    price: 299,
    salePrice: 249,
    isSale: true,
    isBestseller: false,
    isNew: false,
    rating: 4.8,
    reviewsCount: 35,
    stock: 20,
    yarnType: "100% Natural Cotton Yarn",
    colors: ["Golden Sunshine", "Pastel Lemon Yellow", "Warm Autumn Amber", "Sunset Orange", "Honey Glow"],
    description: "A single radiant sunflower crafted with golden petals and textured center seeds, complete with wired stem and green leaves. Gift wrapping optional.",
    images: ["https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&w=800&q=80"],
    customization: { allowGiftWrap: true, giftWrapPrice: 49, allowColorPicker: true, allowCustomText: true }
  },
  {
    id: "prod-6",
    name: "Crochet Floral Hair Clip Set",
    slug: "crochet-floral-hair-clip-set",
    category: "cat-hair",
    price: 249,
    salePrice: null,
    isSale: false,
    isBestseller: false,
    isNew: true,
    rating: 4.9,
    reviewsCount: 19,
    stock: 22,
    yarnType: "100% Natural Cotton Yarn",
    colors: ["Pink & Sky Blue", "Lavender & Peach", "Daisy White & Butter Yellow", "Strawberry Red & Cream", "Matcha & Mint"],
    description: "Hand-stitched mini flower clips with sturdy alligator clip backings. Ideal for adding a touch of floral magic to any hairstyle!",
    images: ["https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80"],
    customization: { allowGiftWrap: false, allowColorPicker: true, allowCustomText: false }
  }
];
let activeDiscount = { code: '', percent: 0, freeShipping: false };
let currentDetailProduct = null;
let selectedModalColor = '';
let selectedGiftWrap = 'Without Gift Wrap';
let activeAccountTab = 'orders';
let activeAdminTab = 'overview';
let pendingOrderData = null;

const BACKEND_URL = 'https://crochet-boutique-akah.onrender.com';

function getApiUrl(endpoint) {
  if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) return endpoint;
  const isLocalServer = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') && (window.location.port === '3000' || window.location.port === '5000');
  const base = isLocalServer ? '' : BACKEND_URL;
  return base + (endpoint.startsWith('/') ? '' : '/') + endpoint;
}

// API Helper
async function apiFetch(endpoint, method = 'GET', body = null) {
  const url = getApiUrl(endpoint);
  const headers = { 'Content-Type': 'application/json' };
  if (authToken) headers['Authorization'] = `Bearer ${authToken}`;

  const opts = { method, headers };
  if (body) opts.body = JSON.stringify(body);

  try {
    const res = await fetch(url, opts);
    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      throw new Error(`Server returned non-JSON response (${res.status} ${res.statusText})`);
    }
    if (!res.ok) throw new Error(data.error || 'Server error');
    return data;
  } catch (err) {
    console.error('API Error:', err.message);
    if (endpoint !== '/api/products' && endpoint !== '/api/categories') {
      showToast(err.message || 'Network or server error');
    }
    throw err;
  }
}

// App Initialization
document.addEventListener('DOMContentLoaded', async () => {
  updateHeaderUI();
  updateCartBadge();
  updateWishlistBadge();
  
  const hash = window.location.hash.replace('#', '') || 'home';
  navigate(hash);

  // Asynchronously sync latest products, categories & hero carousel from backend
  await loadCategories();
  await loadProducts();
  await loadHeroSlides();

  // Initialize 3D Motion, WebGL Scene, Carousel & 3D Cursor Trail
  setTimeout(() => {
    init3DHeroScene();
    init3DTiltCards();
    init3DCursorTrail();
    initHeroCarousel();
  }, 200);
});

async function loadCategories() {
  try {
    const data = await apiFetch('/api/categories');
    if (Array.isArray(data) && data.length > 0) {
      categories = data;
      const activePanel = document.querySelector('.view-panel:not(.hidden)');
      if (activePanel && activePanel.id === 'view-home') renderHomeView();
      if (activePanel && activePanel.id === 'view-shop') renderShopView();
    }
  } catch (e) {
    console.warn('Categories loaded from default catalog.');
  }
}

async function loadProducts() {
  try {
    const data = await apiFetch('/api/products');
    if (Array.isArray(data) && data.length > 0) {
      products = data;
      const activePanel = document.querySelector('.view-panel:not(.hidden)');
      if (activePanel && activePanel.id === 'view-home') renderHomeView();
      if (activePanel && activePanel.id === 'view-shop') renderShopView();
    }
  } catch (e) {
    console.warn('Products loaded from default catalog.');
  }
}

// Router
function navigate(viewNameWithQuery) {
  const cleanViewName = (viewNameWithQuery || 'home').split('?')[0];

  document.querySelectorAll('.view-panel').forEach(panel => panel.classList.add('hidden'));
  document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));

  const targetView = document.getElementById(`view-${cleanViewName}`);
  if (targetView) {
    targetView.classList.remove('hidden');
    window.location.hash = viewNameWithQuery;
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const activeNav = document.getElementById(`nav-${cleanViewName}`);
    if (activeNav) activeNav.classList.add('active');

    if (cleanViewName === 'home') { renderHomeView(); setTimeout(() => { init3DHeroScene(); init3DTiltCards(); initHeroCarousel(); }, 100); }
    if (cleanViewName === 'shop') { renderShopView(); setTimeout(() => init3DTiltCards(), 100); }
    if (cleanViewName === 'custom-order') { setTimeout(() => initCustom3DVisualizer(), 100); }
    if (cleanViewName === 'account') renderAccountView();
    if (cleanViewName === 'checkout') renderCheckoutView();
    if (cleanViewName === 'admin') { window.location.href = '/admin'; return; }
    if (cleanViewName === 'payment-success') renderPaymentSuccessView();
    if (cleanViewName === 'payment-failed') renderPaymentFailedView();
    if (cleanViewName === 'payment-pending') renderPaymentPendingView();
  }
}

function scrollToSection(id) {
  if (window.location.hash !== '#home') navigate('home');
  setTimeout(() => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }, 100);
}

function toggleMobileNav() {
  const panel = document.getElementById('mobile-nav-panel');
  if (panel) panel.classList.toggle('hidden');
}

function updateHeaderUI() {
  const existing = document.getElementById('nav-admin-link');
  if (existing) existing.remove();
}

function updateCartBadge() {
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  const badge = document.getElementById('cart-badge');
  if (badge) badge.textContent = count;
  const floatingBadge = document.getElementById('floating-cart-badge');
  if (floatingBadge) floatingBadge.textContent = count;
  const drawerBadge = document.getElementById('mobile-drawer-cart-badge');
  if (drawerBadge) drawerBadge.textContent = count;
}

function updateWishlistBadge() {
  const badge = document.getElementById('wishlist-badge');
  if (badge) badge.textContent = wishlist.length;
  const drawerBadge = document.getElementById('mobile-drawer-wish-badge');
  if (drawerBadge) drawerBadge.textContent = wishlist.length;
}

/* ==========================================
   HOMEPAGE RENDERERS
   ========================================== */

function renderHomeView() {
  renderHeroCarousel();
  const catGrid = document.getElementById('home-categories-grid');
  if (catGrid && categories.length) {
    catGrid.innerHTML = categories.map(c => `
      <div onclick="filterShopByCategory('${c.id}')" class="bg-white p-5 rounded-3xl border border-[#EEDBF5] text-center hover:border-[#C8B6FF] transition-all cursor-pointer shadow-sm group">
        <div class="w-16 h-16 rounded-full bg-[#FFF0F6] flex items-center justify-center text-3xl mx-auto mb-3 group-hover:scale-110 transition-transform">
          ${c.icon}
        </div>
        <h4 class="font-display font-bold text-base text-[#3D2C3D] group-hover:text-[#FF85A1] transition-colors">${c.name}</h4>
        <p class="text-xs text-[#8B7A99] mt-1 line-clamp-1">${c.description}</p>
      </div>
    `).join('');
  }

  const bestGrid = document.getElementById('home-bestsellers-grid');
  if (bestGrid && products.length) {
    const activeProducts = products.filter(p => p.status !== 'archived');
    let displayProds = activeProducts.filter(p => p.isBestseller || p.isSale).slice(0, 8);
    if (displayProds.length === 0) {
      displayProds = activeProducts.slice(0, 8);
    }
    bestGrid.innerHTML = displayProds.map(p => renderProductCardHTML(p)).join('');
  }

  const revGrid = document.getElementById('home-reviews-grid');
  if (revGrid) {
    revGrid.innerHTML = `
      <div class="bg-white p-6 rounded-3xl border border-[#EEDBF5] shadow-sm space-y-4">
        <div class="flex items-center gap-3">
          <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80" class="w-12 h-12 rounded-full object-cover">
          <div>
            <h4 class="font-bold text-sm text-[#3D2C3D]">Ananya Roy</h4>
            <div class="text-[#FF85A1] text-xs">★★★★★ <span class="text-[#8B7A99] ml-1">Verified Purchase</span></div>
          </div>
        </div>
        <p class="text-[#8B7A99] text-sm italic">"Prisha's bouquet is so incredibly gorgeous! The handmade flowers and gift wrapping were so aesthetically pleasing. Made with love indeed ♡"</p>
        <div class="text-xs font-bold text-[#FF85A1]">Purchased: Rose &amp; Tulip Bouquet (Gift wrapping optional)</div>
      </div>
      <div class="bg-white p-6 rounded-3xl border border-[#EEDBF5] shadow-sm space-y-4">
        <div class="flex items-center gap-3">
          <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80" class="w-12 h-12 rounded-full object-cover">
          <div>
            <h4 class="font-bold text-sm text-[#3D2C3D]">Rhea Kapoor</h4>
            <div class="text-[#FF85A1] text-xs">★★★★★ <span class="text-[#8B7A99] ml-1">Verified Purchase</span></div>
          </div>
        </div>
        <p class="text-[#8B7A99] text-sm italic">"Ordered the Love &amp; Blooms Gift Hamper for my best friend's birthday and she loved every single item! The hair scrunchie and bouquet are perfection."</p>
        <div class="text-xs font-bold text-[#FF85A1]">Purchased: Love &amp; Blooms Deluxe Gift Hamper</div>
      </div>
    `;
  }
}

function renderProductCardHTML(p) {
  const isWish = wishlist.includes(p.id);
  const displayPrice = p.salePrice || p.price;
  
  return `
    <div class="product-card group">
      ${p.isSale ? `<span class="card-badge badge-sale">Sale</span>` : (p.isBestseller ? `<span class="card-badge badge-bestseller">Bestseller</span>` : (p.isNew ? `<span class="card-badge badge-new">New</span>` : ''))}
      
      <button onclick="toggleWishlist('${p.id}')" class="wishlist-btn-corner ${isWish ? 'active' : ''}" title="Save to Wishlist">
        <i class="${isWish ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
      </button>

      <div class="product-img-box" onclick="openProductModal('${p.id}')">
        <img src="${p.images[0]}" alt="${p.name}">
      </div>

      <div class="p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div class="flex justify-between items-center text-xs text-[#8B7A99] mb-1">
            <span class="font-bold uppercase text-[10px] text-[#FF85A1]">${p.yarnType}</span>
            <span class="text-[#FF85A1] font-bold">★ ${p.rating} (${p.reviewsCount})</span>
          </div>
          <h3 onclick="openProductModal('${p.id}')" class="font-display font-bold text-base text-[#3D2C3D] group-hover:text-[#FF85A1] transition-colors cursor-pointer line-clamp-1">${p.name}</h3>
          <p class="text-xs text-[#8B7A99] line-clamp-2 mt-1">${p.description}</p>
        </div>

        <div class="pt-3 border-t border-[#EEDBF5] flex items-center justify-between">
          <div>
            <span class="font-display font-bold text-lg text-[#3D2C3D]">₹${displayPrice.toFixed(2)}</span>
            ${p.salePrice ? `<span class="text-xs text-[#8B7A99] line-through ml-1">₹${p.price.toFixed(2)}</span>` : ''}
          </div>

          <button onclick="quickAddToCart('${p.id}')" class="btn-terracotta !py-2 !px-4 text-xs">
            <i class="fa-solid fa-plus"></i> Add
          </button>
        </div>
      </div>
    </div>
  `;
}

/* ==========================================
   SHOP PAGE & FILTERS
   ========================================== */

function renderShopView() {
  renderShopCategoriesFilter();
  applyShopFilters();
}

function renderShopCategoriesFilter() {
  const container = document.getElementById('shop-category-filters');
  if (!container) return;

  container.innerHTML = `
    <label class="flex items-center gap-2 cursor-pointer font-semibold">
      <input type="radio" name="shop-cat" value="all" checked onchange="applyShopFilters()" class="accent-[#FF85A1]">
      <span>All Categories</span>
    </label>
    ${categories.map(c => `
      <label class="flex items-center gap-2 cursor-pointer font-semibold">
        <input type="radio" name="shop-cat" value="${c.id}" onchange="applyShopFilters()" class="accent-[#FF85A1]">
        <span>${c.name}</span>
      </label>
    `).join('')}
  `;
}

function filterShopByCategory(catId) {
  navigate('shop');
  setTimeout(() => {
    const radio = document.querySelector(`input[name="shop-cat"][value="${catId}"]`);
    if (radio) {
      radio.checked = true;
      applyShopFilters();
    }
  }, 150);
}

function updatePriceLabel(val) {
  const el = document.getElementById('price-range-val');
  if (el) el.textContent = `₹${val}`;
}

function applyShopFilters() {
  const grid = document.getElementById('shop-products-grid');
  if (!grid) return;

  const searchQuery = document.getElementById('shop-search-input')?.value.toLowerCase().trim() || '';
  const selectedCatRadio = document.querySelector('input[name="shop-cat"]:checked');
  const catVal = selectedCatRadio ? selectedCatRadio.value : 'all';
  const priceRangeInput = document.getElementById('shop-price-range');
  const maxPrice = priceRangeInput ? parseFloat(priceRangeInput.value) : 10000;
  const sortVal = document.getElementById('shop-sort-select')?.value || 'newest';

  const activeProducts = products.filter(p => p.status !== 'archived');

  let filtered = activeProducts.filter(p => {
    const price = p.salePrice || p.price;
    const matchesCat = catVal === 'all' || p.category === catVal;
    const matchesSearch = !searchQuery || 
      (p.name && p.name.toLowerCase().includes(searchQuery)) || 
      (p.description && p.description.toLowerCase().includes(searchQuery)) ||
      (p.yarnType && p.yarnType.toLowerCase().includes(searchQuery));
    const matchesPrice = !maxPrice || price <= maxPrice;
    return matchesCat && matchesSearch && matchesPrice;
  });

  if (sortVal === 'price_asc') filtered.sort((a,b) => (a.salePrice||a.price) - (b.salePrice||b.price));
  if (sortVal === 'price_desc') filtered.sort((a,b) => (b.salePrice||b.price) - (a.salePrice||a.price));
  if (sortVal === 'rating') filtered.sort((a,b) => b.rating - a.rating);

  const countElem = document.getElementById('shop-result-count');
  if (countElem) countElem.textContent = filtered.length;

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="col-span-full text-center py-16 space-y-4">
        <div class="text-4xl">🌸</div>
        <h3 class="font-display font-bold text-xl text-[#3D2C3D]">No items found</h3>
        <p class="text-sm text-[#8B7A99]">Try adjusting search query or price parameters.</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = filtered.map(p => renderProductCardHTML(p)).join('');
}

function resetShopFilters() {
  const searchInput = document.getElementById('shop-search-input');
  if (searchInput) searchInput.value = '';
  const priceRange = document.getElementById('shop-price-range');
  if (priceRange) { priceRange.value = 2000; updatePriceLabel(2000); }
  renderShopCategoriesFilter();
  applyShopFilters();
}

/* ==========================================
   PRODUCT DETAIL MODAL & GIFT WRAP OPTIONS
   ========================================== */

function isFlowerProduct(p) {
  if (!p) return false;
  if (p.category && p.category !== 'cat-flowers') return false;
  if (p.customization && p.customization.allowGiftWrap === false) return false;
  return p.category === 'cat-flowers' || /(flower|bouquet|tulip|rose|sunflower)/i.test(p.name);
}

function openProductModal(productId) {
  const p = products.find(prod => prod.id === productId);
  if (!p) return;

  currentDetailProduct = p;
  selectedModalColor = p.colors ? p.colors[0] : 'Standard';
  const isFlowerItem = isFlowerProduct(p);
  selectedGiftWrap = isFlowerItem ? 'Without Gift Wrap' : 'No Gift Wrap';

  const modal = document.getElementById('modal-product-detail');
  const content = document.getElementById('modal-product-content');
  if (!modal || !content) return;

  const displayPrice = p.salePrice || p.price;
  const wrapCost = p.customization?.giftWrapPrice || 99.00;

  content.innerHTML = `
    <!-- Image & 3D WebGL Model Preview -->
    <div class="space-y-4">
      <div class="relative rounded-3xl overflow-hidden border border-[#EEDBF5] bg-[#FFF7FA]">
        <img id="modal-main-img" src="${p.images[0]}" alt="${p.name}" class="w-full h-80 sm:h-96 object-cover">
        <canvas id="modal-3d-canvas" class="w-full h-80 sm:h-96 hidden bg-[#FFF0F6] rounded-3xl"></canvas>
        <button onclick="toggleModal3DView('${p.id}')" id="modal-3d-toggle-btn" class="absolute bottom-3 right-3 bg-white/90 backdrop-blur text-xs font-bold text-[#3D2C3D] px-3.5 py-2 rounded-full border border-[#FFC6FF] shadow-lg hover:bg-[#FF85A1] hover:text-white transition-all flex items-center gap-1.5 cursor-pointer">
          <i class="fa-solid fa-cube text-[#FF85A1]"></i> <span>3D Interactive Model</span>
        </button>
      </div>
    </div>

    <!-- Details -->
    <div class="space-y-5">
      <div>
        <span class="text-xs font-bold uppercase text-[#FF85A1]">${p.yarnType}</span>
        <h2 class="font-display font-bold text-2xl sm:text-3xl text-[#3D2C3D] mt-1">${p.name}</h2>
        <div class="text-[#FF85A1] text-xs font-bold mt-1">★ ${p.rating} (${p.reviewsCount} reviews) • Handcrafted by Prisha</div>
      </div>

      <div class="flex items-center gap-3">
        <span class="font-display font-bold text-2xl text-[#3D2C3D]" id="modal-price-display">₹${displayPrice.toFixed(2)}</span>
        ${p.salePrice ? `<span class="text-sm text-[#8B7A99] line-through">₹${p.price.toFixed(2)}</span>` : ''}
      </div>

      <p class="text-sm text-[#8B7A99] leading-relaxed">${p.description}</p>

      <!-- GIFT WRAP OPTION (Specially & Exclusively for Flowers) -->
      ${isFlowerItem ? `
        <div class="bg-[#FFF0F6] p-4 rounded-2xl border-2 border-[#FFC6FF] space-y-3">
          <label class="block font-display font-bold text-sm text-[#3D2C3D]">
            🎁 Gift Wrap Options:
          </label>
          <div class="space-y-2">
            <label class="flex items-center gap-2 cursor-pointer text-xs font-bold text-[#3D2C3D]">
              <input type="radio" name="gift-wrap-choice" value="Without Gift Wrap" checked onchange="toggleGiftWrapSelection(this, 0)" class="accent-[#FF85A1]">
              <span>Without Gift Wrap (Stem Only)</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer text-xs font-bold text-[#3D2C3D]">
              <input type="radio" name="gift-wrap-choice" value="With Gift Wrap (Optional)" onchange="toggleGiftWrapSelection(this, ${wrapCost})" class="accent-[#FF85A1]">
              <span>Gift wrapping optional (+ ₹${wrapCost.toFixed(2)}) 🎁</span>
            </label>
          </div>
        </div>
      ` : ''}

      <!-- Color Options -->
      ${p.colors ? `
        <div>
          <label class="block text-xs font-bold text-[#3D2C3D] uppercase tracking-wider mb-2">🎨 Select Yarn Color Combo:</label>
          <div class="flex flex-wrap gap-2">
            ${p.colors.map((c, idx) => `
              <button onclick="selectModalColor(this, '${c}')" class="modal-color-btn text-xs font-bold px-4 py-2 rounded-full border border-[#EEDBF5] ${idx===0 ? 'bg-[#FF85A1] text-white border-[#FF85A1]' : 'bg-white text-[#3D2C3D]'} transition-all">
                ${c}
              </button>
            `).join('')}
          </div>
        </div>
      ` : ''}

      <!-- Custom Note -->
      ${p.customization && p.customization.allowCustomText ? `
        <div>
          <label class="block text-xs font-bold text-[#3D2C3D] uppercase tracking-wider mb-1">
            ${p.customization.textLabel || 'Gift Card Note Message'}:
          </label>
          <input type="text" id="modal-custom-text" placeholder="e.g. Happy Birthday with love ♡" class="form-input text-xs">
        </div>
      ` : ''}

      <!-- Add to Basket -->
      <div class="pt-2">
        <button onclick="addCurrentModalToCart()" class="w-full btn-terracotta justify-center py-4 text-sm font-bold">
          <i class="fa-solid fa-basket-shopping"></i> Add To Basket ♡
        </button>
      </div>
    </div>
  `;

  modal.classList.add('active');
}

function toggleGiftWrapSelection(radio, extraCost) {
  selectedGiftWrap = radio.value;
  if (!currentDetailProduct) return;
  const basePrice = currentDetailProduct.salePrice || currentDetailProduct.price;
  const totalPrice = basePrice + extraCost;
  const priceElem = document.getElementById('modal-price-display');
  if (priceElem) priceElem.textContent = `₹${totalPrice.toFixed(2)}`;
}

function selectModalColor(btn, color) {
  document.querySelectorAll('.modal-color-btn').forEach(b => {
    b.classList.remove('bg-[#FF85A1]', 'text-white', 'border-[#FF85A1]');
    b.classList.add('bg-white', 'text-[#3D2C3D]');
  });
  btn.classList.remove('bg-white', 'text-[#3D2C3D]');
  btn.classList.add('bg-[#FF85A1]', 'text-white', 'border-[#FF85A1]');
  selectedModalColor = color;
}

function closeProductModal() {
  document.getElementById('modal-product-detail')?.classList.remove('active');
}

let selectedQuickFlowerColor = null;

function selectQuickFlowerColor(btn, color) {
  document.querySelectorAll('.quick-flower-color-btn').forEach(b => {
    b.classList.remove('bg-[#FF85A1]', 'text-white', 'border-[#FF85A1]');
    b.classList.add('bg-white', 'text-[#3D2C3D]');
  });
  btn.classList.remove('bg-white', 'text-[#3D2C3D]');
  btn.classList.add('bg-[#FF85A1]', 'text-white', 'border-[#FF85A1]');
  selectedQuickFlowerColor = color;
}

function openFlowerQuickWrapModal(p) {
  const modal = document.getElementById('modal-flower-quick-wrap');
  const content = document.getElementById('flower-quick-wrap-content');
  if (!modal || !content) return;

  selectedQuickFlowerColor = (p.colors && p.colors.length) ? p.colors[0] : 'Standard';

  const basePrice = p.salePrice || p.price;
  const wrapCost = p.customization?.giftWrapPrice || 99.00;
  const totalWithWrap = basePrice + wrapCost;

  content.innerHTML = `
    <div class="space-y-4">
      <div class="flex items-center gap-3 pb-3 border-b border-[#EEDBF5]">
        <img src="${p.images[0]}" alt="${p.name}" class="w-16 h-16 rounded-2xl object-cover border border-[#EEDBF5] shadow-sm">
        <div>
          <span class="text-[10px] font-bold uppercase text-[#FF85A1] tracking-wider">💐 Flower Gift Wrapping</span>
          <h3 class="font-display font-bold text-base text-[#3D2C3D] line-clamp-1">${p.name}</h3>
          <p class="text-xs text-[#8B7A99]">Choose your shade & wrapping style:</p>
        </div>
      </div>

      ${p.colors && p.colors.length > 1 ? `
        <div class="space-y-1.5 pt-0.5">
          <label class="block text-xs font-bold text-[#3D2C3D]">🎨 Select Flower Color Combo:</label>
          <div class="flex flex-wrap gap-1.5" id="quick-flower-colors">
            ${p.colors.map((c, idx) => `
              <button type="button" onclick="selectQuickFlowerColor(this, '${c}')" class="quick-flower-color-btn text-[11px] font-bold px-3 py-1.5 rounded-full border border-[#EEDBF5] ${idx === 0 ? 'bg-[#FF85A1] text-white border-[#FF85A1]' : 'bg-white text-[#3D2C3D]'} transition-all cursor-pointer">
                ${c}
              </button>
            `).join('')}
          </div>
        </div>
      ` : ''}

      <div class="space-y-3 pt-1">
        <!-- Option 1: Stem Only (No Wrap) -->
        <button onclick="confirmFlowerQuickWrap('${p.id}', false)" class="w-full text-left p-4 rounded-2xl border-2 border-[#EEDBF5] hover:border-[#FF85A1] bg-[#FFF7FA] hover:bg-white transition-all flex items-center justify-between group cursor-pointer">
          <div class="flex items-start gap-3">
            <span class="text-2xl mt-0.5">🌿</span>
            <div>
              <div class="font-bold text-sm text-[#3D2C3D] group-hover:text-[#FF85A1]">Without Gift Wrap (Stem Only)</div>
              <div class="text-xs text-[#8B7A99]">Natural cotton flowers & stem, ready for your vase</div>
            </div>
          </div>
          <div class="text-right">
            <span class="font-display font-bold text-base text-[#3D2C3D]">₹${basePrice.toFixed(2)}</span>
            <div class="text-[10px] text-[#8B7A99] font-medium">Standard</div>
          </div>
        </button>

        <!-- Option 2: With Gift Wrapping -->
        <button onclick="confirmFlowerQuickWrap('${p.id}', true)" class="w-full text-left p-4 rounded-2xl border-2 border-[#FF85A1] bg-[#FFF0F6] hover:bg-[#FFE5F0] transition-all flex items-center justify-between group cursor-pointer shadow-sm">
          <div class="flex items-start gap-3">
            <span class="text-2xl mt-0.5">🎁</span>
            <div>
              <div class="font-bold text-sm text-[#FF85A1]">With Gift Wrapping (Optional)</div>
              <div class="text-xs text-[#8B7A99]">Aesthetic craft paper, ribbon bow & gift tag</div>
            </div>
          </div>
          <div class="text-right">
            <span class="font-display font-bold text-base text-[#FF85A1]">₹${totalWithWrap.toFixed(2)}</span>
            <div class="text-[10px] text-[#FF85A1] font-bold">+₹${wrapCost.toFixed(2)} wrap</div>
          </div>
        </button>
      </div>

      <p class="text-[11px] text-[#8B7A99] text-center pt-1 italic">
        Handcrafted with 100% natural cotton yarn by Prisha ♡
      </p>
    </div>
  `;

  modal.classList.add('active');
}

function closeFlowerQuickWrapModal() {
  document.getElementById('modal-flower-quick-wrap')?.classList.remove('active');
}

function confirmFlowerQuickWrap(productId, withWrap) {
  const p = products.find(prod => prod.id === productId);
  if (!p) return;
  const color = selectedQuickFlowerColor || (p.colors ? p.colors[0] : 'Standard');
  const wrapOption = withWrap ? 'With Gift Wrap (Optional)' : 'Without Gift Wrap';
  addToCart(p, color, wrapOption, '', 1);
  closeFlowerQuickWrapModal();
  toggleCartDrawer();
}

function quickAddToCart(productId) {
  const p = products.find(prod => prod.id === productId);
  if (!p) return;
  if (isFlowerProduct(p)) {
    openFlowerQuickWrapModal(p);
  } else {
    const color = p.colors ? p.colors[0] : 'Standard';
    addToCart(p, color, 'No Gift Wrap', '', 1);
    toggleCartDrawer();
  }
}

function addCurrentModalToCart() {
  if (!currentDetailProduct) return;
  const customText = document.getElementById('modal-custom-text')?.value || '';
  addToCart(currentDetailProduct, selectedModalColor, selectedGiftWrap, customText, 1);
  closeProductModal();
  toggleCartDrawer();
}

/* ==========================================
   CART DRAWER & STORAGE
   ========================================== */

function addToCart(product, color, giftWrap, customText, qty) {
  let unitPrice = product.salePrice || product.price;
  if (isFlowerProduct(product) && giftWrap && giftWrap.includes('With Gift Wrap')) {
    unitPrice += (product.customization?.giftWrapPrice || 99.00);
  }

  const existingIdx = cart.findIndex(item => item.productId === product.id && item.color === color && item.giftWrap === giftWrap && item.customText === customText);

  if (existingIdx > -1) {
    cart[existingIdx].qty += qty;
  } else {
    cart.push({
      productId: product.id,
      name: product.name,
      price: unitPrice,
      image: product.images[0],
      color: color,
      giftWrap: giftWrap,
      customText: customText,
      qty: qty
    });
  }

  localStorage.setItem('sp_cart', JSON.stringify(cart));
  updateCartBadge();
  renderCartDrawerItems();
  trigger3DConfetti();
  showToast(`Added "${product.name}" to basket ♡`);
}

function toggleCartDrawer() {
  const backdrop = document.getElementById('cart-drawer-backdrop');
  const panel = document.getElementById('cart-drawer-panel');
  if (backdrop && panel) {
    backdrop.classList.toggle('active');
    panel.classList.toggle('active');
    if (panel.classList.contains('active')) renderCartDrawerItems();
  }
}

function renderCartDrawerItems() {
  const container = document.getElementById('cart-drawer-items');
  const subtotalElem = document.getElementById('cart-drawer-subtotal');
  if (!container) return;

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  if (subtotalElem) subtotalElem.textContent = `₹${subtotal.toFixed(2)}`;

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="text-center py-16 space-y-3 text-[#8B7A99]">
        <div class="text-4xl">🌸</div>
        <p class="font-bold text-sm">Your basket is currently empty.</p>
        <button onclick="navigate('shop'); toggleCartDrawer();" class="btn-outline-terracotta text-xs">Explore Shop</button>
      </div>
    `;
    return;
  }

  container.innerHTML = cart.map((item, idx) => `
    <div class="flex gap-4 pb-4 border-b border-[#EEDBF5]">
      <img src="${item.image}" class="w-16 h-16 rounded-2xl object-cover border border-[#EEDBF5]">
      <div class="flex-1 space-y-1">
        <h4 class="font-display font-bold text-sm text-[#3D2C3D] line-clamp-1">${item.name}</h4>
        <div class="text-xs text-[#8B7A99]">Color: ${item.color}</div>
        ${item.giftWrap && item.giftWrap.includes('With Gift Wrap') ? `<div class="text-[11px] font-bold text-[#FF85A1]"><i class="fa-solid fa-gift mr-1"></i>Gift Wrapped</div>` : (item.giftWrap === 'Without Gift Wrap' ? `<div class="text-[11px] font-medium text-[#8B7A99]">🌿 Stem Only (No Wrap)</div>` : '')}
        ${item.customText ? `<div class="text-[11px] text-[#8B7A99]">Note: "${item.customText}"</div>` : ''}
        <div class="flex items-center justify-between pt-1">
          <div class="flex items-center gap-2 border border-[#EEDBF5] rounded-full px-2 py-0.5">
            <button onclick="updateCartQty(${idx}, -1)" class="text-xs font-bold px-1">-</button>
            <span class="text-xs font-bold">${item.qty}</span>
            <button onclick="updateCartQty(${idx}, 1)" class="text-xs font-bold px-1">+</button>
          </div>
          <span class="font-bold text-sm text-[#3D2C3D]">₹${(item.price * item.qty).toFixed(2)}</span>
        </div>
      </div>
      <button onclick="removeCartItem(${idx})" class="text-[#8B7A99] hover:text-[#FF85A1] text-sm"><i class="fa-solid fa-trash-can"></i></button>
    </div>
  `).join('');
}

function updateCartQty(index, delta) {
  if (cart[index]) {
    cart[index].qty += delta;
    if (cart[index].qty <= 0) cart.splice(index, 1);
    localStorage.setItem('sp_cart', JSON.stringify(cart));
    updateCartBadge();
    renderCartDrawerItems();
  }
}

function removeCartItem(index) {
  cart.splice(index, 1);
  localStorage.setItem('sp_cart', JSON.stringify(cart));
  updateCartBadge();
  renderCartDrawerItems();
  showToast('Item removed from basket.');
}

/* ==========================================
   CHECKOUT, AUTH GUARD & ONLINE PAYMENT VERIFY
   ========================================== */

function renderCheckoutView() {
  const authTitle = document.getElementById('checkout-auth-status-title');
  const authDesc = document.getElementById('checkout-auth-status-desc');
  const authBtn = document.getElementById('checkout-auth-btn');

  // Customer Account & Saved Details Management
  if (currentUser) {
    if (authTitle) authTitle.textContent = `✓ Logged in as ${currentUser.name}`;
    if (authDesc) authDesc.textContent = ` (${currentUser.email})`;
    if (authBtn) {
      authBtn.textContent = 'Sign Out';
      authBtn.onclick = handleLogout;
      authBtn.className = 'btn-outline-terracotta !py-1 !px-3 text-xs shrink-0';
    }
  } else {
    if (authTitle) authTitle.textContent = 'Already have an account?';
    if (authDesc) authDesc.textContent = ' Sign in for 1-tap checkout';
    if (authBtn) {
      authBtn.textContent = 'Sign In';
      authBtn.onclick = openAuthModal;
      authBtn.className = 'btn-terracotta !py-1.5 !px-3.5 text-xs font-bold shrink-0 shadow-sm';
    }
  }

  const itemsContainer = document.getElementById('checkout-items-list');
  if (!itemsContainer) return;

  if (cart.length === 0) {
    itemsContainer.innerHTML = `<p class="text-xs text-[#8B7A99] py-4">Your basket is empty.</p>`;
  } else {
    itemsContainer.innerHTML = cart.map(i => `
      <div class="py-2.5 flex justify-between items-center text-xs">
        <div>
          <div class="font-bold text-[#3D2C3D]">${i.qty}x ${i.name}</div>
          <div class="text-xs text-[#8B7A99]">Color: ${i.color}</div>
          ${i.giftWrap && i.giftWrap.includes('With Gift Wrap') ? `<div class="text-[#FF85A1] font-semibold text-[11px]"><i class="fa-solid fa-gift mr-1"></i>Gift Wrapped</div>` : (i.giftWrap === 'Without Gift Wrap' ? `<div class="text-[#8B7A99] font-medium text-[11px]">🌿 Stem Only</div>` : '')}
        </div>
        <div class="font-bold text-[#3D2C3D]">₹${(i.price * i.qty).toFixed(2)}</div>
      </div>
    `).join('');
  }

  // Pre-fill user data: First check currentUser, then fallback to saved customer in localStorage
  let savedData = null;
  if (currentUser) {
    savedData = {
      name: currentUser.name || '',
      email: currentUser.email || '',
      phone: currentUser.phone || '',
      ...(currentUser.addresses && currentUser.addresses[0] ? currentUser.addresses[0] : {})
    };
  } else {
    try {
      savedData = JSON.parse(localStorage.getItem('sp_saved_customer') || 'null');
    } catch (e) {}
  }

  if (savedData) {
    const nameInput = document.getElementById('checkout-name');
    const phoneInput = document.getElementById('checkout-phone');
    const emailInput = document.getElementById('checkout-email');
    const streetInput = document.getElementById('checkout-address');
    const cityInput = document.getElementById('checkout-city');
    const stateInput = document.getElementById('checkout-state');
    const zipInput = document.getElementById('checkout-zip');

    if (nameInput && savedData.name && !nameInput.value) nameInput.value = savedData.name;
    if (phoneInput && savedData.phone && !phoneInput.value) phoneInput.value = savedData.phone;
    if (emailInput && savedData.email && !emailInput.value) emailInput.value = savedData.email;
    if (streetInput && savedData.address && !streetInput.value) streetInput.value = savedData.address;
    if (cityInput && savedData.city && !cityInput.value) cityInput.value = savedData.city;
    if (stateInput && savedData.state && !stateInput.value) stateInput.value = savedData.state;
    if (zipInput && savedData.zip && !zipInput.value) zipInput.value = savedData.zip;
  }

  calculateCheckoutTotals();
}

function handleLogout() {
  currentUser = null;
  authToken = null;
  localStorage.removeItem('sp_token');
  localStorage.removeItem('sp_user');
  updateHeaderUI();
  showToast('Signed out safely.');
  if (window.location.hash === '#checkout') {
    renderCheckoutView();
  } else {
    navigate('home');
  }
}

function calculateCheckoutTotals() {
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const discountAmount = subtotal * (activeDiscount.percent / 100);
  const shipping = (subtotal >= 499 || activeDiscount.freeShipping || subtotal === 0) ? 0 : 79;
  const tax = (subtotal - discountAmount) * 0.05;
  const total = Math.max(0, (subtotal - discountAmount) + shipping + tax);

  const subtotalEl = document.getElementById('summary-subtotal');
  const shippingEl = document.getElementById('summary-shipping');
  const totalEl = document.getElementById('summary-total');

  if (subtotalEl) subtotalEl.textContent = `₹${subtotal.toFixed(2)}`;
  if (shippingEl) shippingEl.textContent = shipping === 0 ? 'FREE' : `₹${shipping.toFixed(2)}`;
  if (totalEl) totalEl.textContent = `₹${total.toFixed(2)}`;

  return total;
}

async function handleApplyPromoCode() {
  const codeInput = document.getElementById('checkout-promo-input');
  const msgElem = document.getElementById('checkout-promo-msg');
  if (!codeInput) return;

  const code = codeInput.value.trim();
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  try {
    const res = await apiFetch('/api/coupons/validate', 'POST', { code, cartSubtotal: subtotal });
    if (res.valid) {
      activeDiscount = { code: res.code, percent: res.discountPercent, freeShipping: res.freeShipping };
      if (msgElem) {
        msgElem.textContent = `🎉 Coupon ${res.code} applied! (${res.discountPercent}% OFF)`;
        msgElem.className = 'block mt-1 font-bold text-xs text-[#FF85A1]';
      }
      calculateCheckoutTotals();
    }
  } catch (err) {
    if (msgElem) {
      msgElem.textContent = err.message || 'Invalid coupon';
      msgElem.className = 'block mt-1 font-bold text-xs text-red-500';
    }
  }
}

let pendingPaymentOrderId = null;
let pendingPollInterval = null;

function copyUPIId() {
  const text = 'prishashah1206@okicici';
  const showSuccess = () => {
    showToast('🌸 UPI ID copied: ' + text + ' — Paste into Google Pay / PhonePe / Paytm to pay!');
  };

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(showSuccess).catch(() => {
      fallbackCopyText(text, showSuccess);
    });
  } else {
    fallbackCopyText(text, showSuccess);
  }
}

function fallbackCopyText(text, cb) {
  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.top = '0';
    ta.style.left = '0';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    if (cb) cb();
    else showToast('🌸 UPI ID copied: ' + text);
  } catch (err) {
    prompt('Copy this UPI ID to pay:', text);
  }
}

function triggerUpiPayment(targetApp) {
  const orderId = pendingPaymentOrderId || (pendingOrderData ? pendingOrderData.orderId : '');
  const amount = (pendingOrderData && pendingOrderData.amountINR) ? pendingOrderData.amountINR.toFixed(2) : '';
  const pa = 'prishashah1206@okicici';
  const pn = encodeURIComponent('Prisha Shah');
  const tn = encodeURIComponent(`Order ${orderId}`);
  let params = `pa=${pa}&pn=${pn}&cu=INR&tn=${tn}`;
  if (amount && parseFloat(amount) > 0) {
    params += `&am=${amount}`;
  }

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
                (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

  if (targetApp === 'copy') {
    copyUPIId();
    return;
  }

  if (targetApp === 'gpay') {
    if (isIOS) {
      // Direct Google Pay deep link on iOS (prevents WhatsApp hijack)
      window.location.href = `gpay://upi/pay?${params}`;
      setTimeout(() => {
        window.location.href = `tez://upi/pay?${params}`;
      }, 700);
    } else {
      window.location.href = `upi://pay?${params}&package=com.google.android.apps.nbu.paisa.user`;
    }
    return;
  }

  if (targetApp === 'phonepe') {
    if (isIOS) {
      // Direct PhonePe deep link on iOS (prevents WhatsApp hijack)
      window.location.href = `phonepe://pay?${params}`;
    } else {
      window.location.href = `upi://pay?${params}&package=com.phonepe.app`;
    }
    return;
  }

  if (targetApp === 'paytm') {
    if (isIOS) {
      // Direct Paytm deep link on iOS (prevents WhatsApp hijack)
      window.location.href = `paytmmp://pay?${params}`;
    } else {
      window.location.href = `upi://pay?${params}&package=net.one97.paytm`;
    }
    return;
  }

  if (targetApp === 'generic') {
    if (isIOS) {
      // On iOS, generic upi:// launches WhatsApp! Prevent that entirely:
      copyUPIId();
      showToast('⚠️ On iPhone, generic UPI links redirect to WhatsApp. UPI ID copied! Paste into Google Pay, PhonePe, or Paytm.');
    } else {
      window.location.href = `upi://pay?${params}`;
    }
  }
}

// END-TO-END DIRECT UPI PAYMENT LIFECYCLE
async function handlePlaceOrder(e) {
  e.preventDefault();

  if (cart.length === 0) {
    showToast('Your basket is empty!');
    return;
  }

  const name = document.getElementById('checkout-name').value.trim();
  const phone = document.getElementById('checkout-phone')?.value.trim() || '';
  const email = document.getElementById('checkout-email').value.trim();
  const address = document.getElementById('checkout-address').value.trim();
  const city = document.getElementById('checkout-city').value.trim();
  const state = document.getElementById('checkout-state').value.trim();
  const zip = document.getElementById('checkout-zip').value.trim();

  // Remember customer details locally so next time checkout is 1-tap
  localStorage.setItem('sp_saved_customer', JSON.stringify({ name, phone, email, address, city, state, zip }));

  if (currentUser) {
    currentUser.phone = phone;
    currentUser.addresses = [{ address, city, state, zip }];
    localStorage.setItem('sp_user', JSON.stringify(currentUser));
  }

  const checkoutBtn = document.querySelector('#checkout-main-form button[type="submit"]');
  if (checkoutBtn) {
    checkoutBtn.disabled = true;
    checkoutBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin mr-2"></i> Generating UPI Order... 🌸`;
  }

  try {
    // 1. Send request to backend to validate prices server-side and create internal order
    const orderPayload = {
      items: cart,
      customerName: name,
      customerEmail: email,
      phone: phone,
      shippingAddress: { address, city, state, zip, country: 'India' },
      couponCode: activeDiscount.code
    };

    const res = await apiFetch('/api/payments/create-order', 'POST', orderPayload);

    if (!res.success || !res.orderId) {
      throw new Error(res.error || 'Failed to initialize order.');
    }

    pendingPaymentOrderId = res.orderId;
    pendingOrderData = res;

    // 2. Populate UPI Modal details
    const amountElem = document.getElementById('pay-verify-amount');
    if (amountElem) amountElem.textContent = `₹${res.amountINR.toFixed(2)}`;

    const intentLink = document.getElementById('pay-upi-intent-link');
    if (intentLink) {
      intentLink.href = `upi://pay?pa=prishashah1206@okicici&pn=Prisha%20Shah&am=${res.amountINR.toFixed(2)}&cu=INR&tn=Order%20${res.orderId}`;
    }

    const utrInput = document.getElementById('pay-utr-input');
    if (utrInput) utrInput.value = '';

    // 3. Open Direct UPI QR Modal
    openPaymentVerifyModal();
  } catch (err) {
    showToast('Order creation failed: ' + err.message);
  } finally {
    if (checkoutBtn) {
      checkoutBtn.disabled = false;
      checkoutBtn.innerHTML = `Proceed To UPI QR Code Payment ♡`;
    }
  }
}

async function simulateInstantTestOrder() {
  if (!currentUser) {
    showToast('🔒 Please Log In or Sign Up first before placing your order');
    openAuthModal();
    return;
  }

  if (cart.length === 0) {
    showToast('Your cart is empty!');
    return;
  }

  const nameElem = document.getElementById('checkout-name');
  const emailElem = document.getElementById('checkout-email');
  const addressElem = document.getElementById('checkout-address');
  const cityElem = document.getElementById('checkout-city');
  const stateElem = document.getElementById('checkout-state');
  const zipElem = document.getElementById('checkout-zip');

  const name = (nameElem && nameElem.value) ? nameElem.value : currentUser.name;
  const email = (emailElem && emailElem.value) ? emailElem.value : currentUser.email;
  const address = (addressElem && addressElem.value) ? addressElem.value : '123 Studio HQ';
  const city = (cityElem && cityElem.value) ? cityElem.value : 'Mumbai';
  const state = (stateElem && stateElem.value) ? stateElem.value : 'Maharashtra';
  const zip = (zipElem && zipElem.value) ? zipElem.value : '400001';

  try {
    showToast('⚡ Processing instant test order...');
    const orderPayload = {
      items: cart,
      customerName: name,
      customerEmail: email,
      phone: currentUser.phone || '+91 9876543210',
      shippingAddress: { address, city, state, zip, country: 'India' },
      paymentMethod: 'Verified Test UPI Gateway',
      paymentTxnId: `PAY-SIM-${Math.floor(100000 + Math.random() * 900000)}`,
      paymentRef: 'Verified Test Payment Ref',
      couponCode: activeDiscount.code
    };

    const res = await apiFetch('/api/orders', 'POST', orderPayload);

    if (res.order) {
      cart = [];
      localStorage.setItem('sp_cart', '[]');
      updateCartBadge();
      trigger3DConfetti();
      showToast('🎉 Instant Test Order Placed Successfully!');
      navigate('payment-success?orderId=' + res.order.id);
    } else {
      throw new Error(res.error || 'Failed to place test order');
    }
  } catch (err) {
    showToast('Error placing test order: ' + err.message);
  }
}

function openPaymentVerifyModal() {
  document.getElementById('modal-payment-verify')?.classList.add('active');
}
function closePaymentVerifyModal() {
  document.getElementById('modal-payment-verify')?.classList.remove('active');
}

function autoSimulatePaymentUTR() {
  const utrInput = document.getElementById('pay-utr-input');
  if (utrInput) utrInput.value = `pay_sim_${Math.floor(100000000 + Math.random() * 900000000)}`;
}

async function handleVerifyPaymentSubmit(e) {
  e.preventDefault();

  const utrInput = document.getElementById('pay-utr-input');
  const btn = document.getElementById('pay-verify-btn');
  const utrValue = utrInput ? utrInput.value.trim() : '';

  const orderIdToVerify = pendingPaymentOrderId || (pendingOrderData ? pendingOrderData.orderId : null);

  if (!orderIdToVerify) {
    showToast('Order reference missing. Please try placing your order again.');
    return;
  }

  if (!utrValue || utrValue.length < 6) {
    showToast('Please enter your 12-digit UPI Reference / UTR Number.');
    return;
  }

  if (btn) {
    btn.disabled = true;
    btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin mr-2"></i> Submitting UTR Reference... ⏳`;
  }

  try {
    const res = await apiFetch('/api/payments/submit-utr', 'POST', {
      orderId: orderIdToVerify,
      utrNumber: utrValue
    });

    if (res.success) {
      cart = [];
      localStorage.setItem('sp_cart', '[]');
      updateCartBadge();
      closePaymentVerifyModal();
      trigger3DConfetti();
      navigate('payment-success?orderId=' + orderIdToVerify + '&utr=' + encodeURIComponent(utrValue));
    } else {
      throw new Error(res.error || 'Failed to submit UTR');
    }
  } catch (err) {
    showToast('Submission error: ' + err.message);
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = `Confirm Order with UTR ♡`;
    }
  }
}

/* ==========================================
   PAYMENT STATE VIEWS HANDLERS
   ========================================== */

async function renderPaymentSuccessView(explicitOrderId) {
  const container = document.getElementById('payment-success-details');
  if (!container) return;

  const urlParams = new URLSearchParams(window.location.hash.split('?')[1] || '');
  const orderId = explicitOrderId || urlParams.get('orderId') || pendingPaymentOrderId;
  const utrParam = urlParams.get('utr') || '';

  if (!orderId) {
    container.innerHTML = `<p class="text-red-500 font-bold">Order reference missing. Please check your order history in your account dashboard.</p>`;
    return;
  }

  try {
    container.innerHTML = `<div class="text-center py-4 text-[#8B7A99]"><i class="fa-solid fa-spinner fa-spin mr-2"></i> Loading order confirmation...</div>`;
    
    // SERVER STATUS FETCH
    const statusData = await apiFetch('/api/payments/status/' + orderId);

    const isPending = statusData.paymentStatus === 'PENDING_VERIFICATION' || statusData.paymentStatus === 'CREATED';
    const isPaid = statusData.paymentStatus === 'PAID';

    if (isPending || isPaid) {
      container.innerHTML = `
        <div class="flex justify-between border-b border-[#EEDBF5] pb-2">
          <span class="text-[#8B7A99]">Order Reference:</span>
          <strong class="text-[#FF85A1] font-mono">${statusData.orderId}</strong>
        </div>
        <div class="flex justify-between border-b border-[#EEDBF5] pb-2">
          <span class="text-[#8B7A99]">UPI UTR Number:</span>
          <strong class="text-[#7C3AED] font-mono">${statusData.utrNumber || utrParam || 'Submitted'}</strong>
        </div>
        <div class="flex justify-between border-b border-[#EEDBF5] pb-2">
          <span class="text-[#8B7A99]">Status:</span>
          <span class="badge-pill ${isPaid ? 'bg-[#DCFCE7] text-[#15803D]' : 'bg-[#FEF3C7] text-[#92400E]'} font-bold text-xs">
            ${isPaid ? '✓ Payment Verified &amp; Confirmed' : '⏳ UPI Payment Verification Pending'}
          </span>
        </div>
        <div class="flex justify-between border-b border-[#EEDBF5] pb-2">
          <span class="text-[#8B7A99]">Total Payable:</span>
          <strong class="text-[#3D2C3D] font-display text-sm">₹${statusData.amount.toFixed(2)} (${statusData.currency})</strong>
        </div>
        <div class="flex justify-between border-b border-[#EEDBF5] pb-2">
          <span class="text-[#8B7A99]">Order Placed At:</span>
          <span>${new Date(statusData.createdAt || Date.now()).toLocaleString('en-IN')}</span>
        </div>
        <div class="p-3 bg-[#F0FDF4] rounded-2xl border border-[#BBF7D0] text-xs text-[#166534] text-left space-y-1">
          <div class="font-bold flex items-center gap-1.5">
            <span>🌸</span> Order Recorded Successfully!
          </div>
          <p>We have safely received your 12-digit UPI UTR reference. Prisha will match it in her UPI app and begin handcrafting your crochet pieces right away!</p>
        </div>
        <div class="pt-1">
          <div class="font-bold text-[#3D2C3D] mb-1">Items Included (${statusData.items ? statusData.items.length : 0}):</div>
          <div class="space-y-1 pl-2 text-[11px] text-[#8B7A99]">
            ${(statusData.items || []).map(i => `<div>• ${i.qty}x ${i.name} (${i.giftWrap || 'No Wrap'})</div>`).join('')}
          </div>
        </div>
      `;
    } else {
      renderPaymentFailedView(statusData.failureReason || ('Payment status is ' + statusData.paymentStatus));
      navigate('payment-failed');
    }
  } catch (err) {
    container.innerHTML = `<p class="text-red-500 font-bold">Failed to load order payment status: ${err.message}</p>`;
  }
}

function renderPaymentFailedView(customReason) {
  const urlParams = new URLSearchParams(window.location.hash.split('?')[1] || '');
  const reason = customReason || urlParams.get('reason') || 'Transaction was cancelled or declined.';
  const reasonElem = document.getElementById('payment-failed-reason-text');
  if (reasonElem) {
    reasonElem.textContent = decodeURIComponent(reason);
  }
}

function retryCheckoutFromFailed() {
  navigate('checkout');
}

async function renderPaymentPendingView(explicitOrderId) {
  const urlParams = new URLSearchParams(window.location.hash.split('?')[1] || '');
  const orderId = explicitOrderId || urlParams.get('orderId') || pendingPaymentOrderId;

  const displayElem = document.getElementById('pending-order-id-display');
  if (displayElem && orderId) displayElem.textContent = orderId;

  if (pendingPollInterval) clearInterval(pendingPollInterval);

  // Poll server every 3 seconds for payment state transition
  pendingPollInterval = setInterval(async () => {
    if (!orderId || !window.location.hash.includes('payment-pending')) {
      clearInterval(pendingPollInterval);
      return;
    }

    try {
      const res = await apiFetch('/api/payments/status/' + orderId);
      if (res.paymentStatus === 'PAID') {
        clearInterval(pendingPollInterval);
        trigger3DConfetti();
        renderPaymentSuccessView(orderId);
        navigate('payment-success?orderId=' + orderId);
      } else if (res.paymentStatus === 'FAILED' || res.paymentStatus === 'CANCELLED') {
        clearInterval(pendingPollInterval);
        renderPaymentFailedView(res.failureReason || 'Payment authorization failed');
        navigate('payment-failed');
      }
    } catch (e) {}
  }, 3000);
}

function checkPendingOrderStatusNow() {
  const urlParams = new URLSearchParams(window.location.hash.split('?')[1] || '');
  const orderId = urlParams.get('orderId') || pendingPaymentOrderId;
  if (orderId) renderPaymentSuccessView(orderId);
}

function renderConfirmationView(order) {
  const container = document.getElementById('confirmation-content-body');
  if (!container) return;

  container.innerHTML = `
    <div class="text-5xl text-[#FF85A1] mb-4">🌸♡</div>
    <span class="badge-pill bg-[#E8F5E9] text-[#7A9A8B]">🔒 Payment Verified &amp; Confirmed</span>
    <h1 class="font-display text-3xl md:text-4xl font-bold text-[#3D2C3D] mt-3">Thank You For Ordering From Prisha!</h1>
    <p class="text-[#8B7A99] text-sm max-w-md mx-auto mt-2 italic font-display">
      made with love, kept forever ♡
    </p>

    <div class="bg-white p-6 rounded-3xl border border-[#EEDBF5] text-left my-8 space-y-4 text-sm">
      <div class="flex justify-between border-b border-[#EEDBF5] pb-3">
        <span class="text-[#8B7A99]">Order Reference:</span>
        <strong class="text-[#FF85A1]">#${order.id}</strong>
      </div>
      <div class="flex justify-between border-b border-[#EEDBF5] pb-3">
        <span class="text-[#8B7A99]">Payment Txn ID:</span>
        <strong class="text-[#7A9A8B]">${order.paymentTxnId || 'PAY-VERIFIED'}</strong>
      </div>
      <div class="flex justify-between border-b border-[#EEDBF5] pb-3">
        <span class="text-[#8B7A99]">Bank UTR Ref:</span>
        <span>${order.paymentRef || 'Verified'}</span>
      </div>
      <div class="flex justify-between border-b border-[#EEDBF5] pb-3">
        <span class="text-[#8B7A99]">Tracking Code:</span>
        <span>${order.trackingNumber}</span>
      </div>
      <div class="flex justify-between pt-1">
        <span class="font-bold text-[#3D2C3D]">Total Verified Paid:</span>
        <strong class="font-display text-lg text-[#FF85A1]">₹${order.total.toFixed(2)}</strong>
      </div>
    </div>

    <div class="bg-[#FFF0F6] p-4 rounded-2xl border border-[#FFC6FF] text-xs font-bold text-[#3D2C3D] mb-6">
      🎥 Reminder: Please record a continuous, unedited unboxing video while opening your parcel for any return or refund requests!
    </div>

    <div class="flex flex-wrap gap-4 justify-center">
      <button onclick="lookupOrderTimeline('${order.id}')" class="btn-terracotta text-sm">
        Track Shipping Status 📦
      </button>
      <button onclick="navigate('shop')" class="btn-outline-terracotta text-sm">
        Back To Store
      </button>
    </div>
  `;
}

/* ==========================================
   ORDER TRACKING PAGE
   ========================================== */

async function handleTrackOrderSearch() {
  const query = document.getElementById('track-search-input')?.value.trim();
  if (!query) return;
  await lookupOrderTimeline(query);
}

async function lookupOrderTimeline(orderIdOrTracking) {
  navigate('track-order');
  const container = document.getElementById('track-results-container');
  if (!container) return;

  try {
    const order = await apiFetch(`/api/orders/${orderIdOrTracking}`);
    if (order) {
      container.innerHTML = `
        <div class="bg-white p-8 rounded-3xl border border-[#EEDBF5] space-y-6">
          <div class="flex flex-col sm:flex-row justify-between sm:items-center pb-6 border-b border-[#EEDBF5]">
            <div>
              <span class="text-xs font-bold text-[#FF85A1] uppercase tracking-wider">Tracking Order #${order.id}</span>
              <h2 class="font-display font-bold text-2xl text-[#3D2C3D]">Status: ${order.status}</h2>
            </div>
            <div class="text-xs text-[#8B7A99] mt-2 sm:mt-0">
              Tracking Code: <strong class="text-[#3D2C3D]">${order.trackingNumber}</strong>
            </div>
          </div>

          <div class="timeline-stepper">
            ${order.timeline.map(step => `
              <div class="timeline-step ${step.done ? 'done' : ''}">
                <div class="step-icon">
                  <i class="fa-solid ${step.done ? 'fa-check' : 'fa-circle'}"></i>
                </div>
                <div class="step-label">${step.status}</div>
              </div>
            `).join('')}
          </div>

          <div class="bg-[#FFF7FA] p-4 rounded-2xl space-y-2 text-xs border border-[#EEDBF5]">
            <div class="font-bold text-[#3D2C3D]">Items Ordered &amp; Payment Details:</div>
            ${order.items.map(i => `<div>• ${i.qty}x ${i.name} (${i.color}) [${i.giftWrap || 'Std'}] - ₹${(i.price * i.qty).toFixed(2)}</div>`).join('')}
            <div class="font-bold text-[#7A9A8B] pt-1">Verified Payment Txn: ${order.paymentTxnId || 'Verified'}</div>
          </div>
        </div>
      `;
    }
  } catch (err) {
    container.innerHTML = `
      <div class="bg-white p-8 rounded-3xl border border-[#EEDBF5] text-center space-y-3">
        <div class="text-3xl">🔍</div>
        <h3 class="font-display font-bold text-lg text-[#3D2C3D]">Order Not Found</h3>
        <p class="text-xs text-[#8B7A99]">Check your order reference ID (e.g. ORD-7710).</p>
      </div>
    `;
  }
}

/* ==========================================
   CUSTOM ORDERS & AUTH
   ========================================== */

async function handleCustomOrderSubmit(e) {
  e.preventDefault();
  const payload = {
    customerName: document.getElementById('custom-name').value,
    customerEmail: document.getElementById('custom-email').value,
    productType: document.getElementById('custom-type').value,
    budget: document.getElementById('custom-budget').value,
    description: document.getElementById('custom-desc').value
  };

  try {
    const res = await apiFetch('/api/custom-orders', 'POST', payload);
    if (res.customOrder) {
      trigger3DConfetti();
      showToast(`Custom Order #${res.customOrder.id} submitted to Prisha! ♡`);
      e.target.reset();
    }
  } catch (err) {
    showToast('Failed to submit custom request');
  }
}

function handleAccountClick() {
  if (currentUser) navigate('account');
  else openAuthModal();
}

function openAuthModal() { document.getElementById('modal-auth')?.classList.add('active'); }
function closeAuthModal() { document.getElementById('modal-auth')?.classList.remove('active'); }

function switchAuthTab(tab) {
  const loginForm = document.getElementById('auth-login-form');
  const regForm = document.getElementById('auth-register-form');
  const loginTab = document.getElementById('auth-tab-login-btn');
  const regTab = document.getElementById('auth-tab-register-btn');

  if (tab === 'login') {
    loginForm.classList.remove('hidden');
    regForm.classList.add('hidden');
    loginTab.className = 'flex-1 py-3 font-bold border-b-2 border-[#FF85A1]';
    regTab.className = 'flex-1 py-3 font-bold text-[#8B7A99]';
  } else {
    loginForm.classList.add('hidden');
    regForm.classList.remove('hidden');
    regTab.className = 'flex-1 py-3 font-bold border-b-2 border-[#FF85A1]';
    loginTab.className = 'flex-1 py-3 font-bold text-[#8B7A99]';
  }
}

async function quickAdminLogin() {
  document.getElementById('login-email').value = 'admin@crochetbyprisha.com';
  document.getElementById('login-pass').value = 'admin123';
  const mockEvent = { preventDefault: () => {} };
  await handleLoginSubmit(mockEvent);
}

async function handleLoginSubmit(e) {
  if (e && e.preventDefault) e.preventDefault();
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-pass').value;

  try {
    const res = await apiFetch('/api/auth/login', 'POST', { email, password });
    if (res.token && res.user) {
      authToken = res.token;
      currentUser = res.user;
      localStorage.setItem('sp_token', authToken);
      localStorage.setItem('sp_user', JSON.stringify(currentUser));
      localStorage.setItem('prisha_admin_token', authToken);
      
      closeAuthModal();
      updateHeaderUI();
      showToast(`Welcome back, ${currentUser.name}! ♡`);

      const staffRoles = ['super_admin', 'admin', 'order_manager', 'product_manager', 'support_staff'];
      if (staffRoles.includes(currentUser.role)) {
        window.location.href = '/admin.html';
      } else if (window.location.hash === '#checkout') {
        renderCheckoutView();
      } else {
        navigate('account');
      }
    }
  } catch (err) {
    showToast('Login failed: ' + (err.message || 'Invalid credentials'));
  }
}

async function handleRegisterSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('reg-name').value.trim();
  const email = document.getElementById('reg-email').value.trim();
  const phone = document.getElementById('reg-phone')?.value.trim() || '';
  const password = document.getElementById('reg-pass').value;

  try {
    const res = await apiFetch('/api/auth/register', 'POST', { name, email, password, phone });
    if (res.token && res.user) {
      authToken = res.token;
      currentUser = res.user;
      localStorage.setItem('sp_token', authToken);
      localStorage.setItem('sp_user', JSON.stringify(currentUser));

      closeAuthModal();
      updateHeaderUI();
      showToast(`Welcome, ${currentUser.name}! ♡`);

      if (window.location.hash === '#checkout') {
        renderCheckoutView();
      } else {
        navigate('account');
      }
    }
  } catch (err) {
    showToast('Registration failed: ' + (err.message || 'Invalid details'));
  }
}

function handleLogout() {
  currentUser = null;
  authToken = null;
  localStorage.removeItem('sp_user');
  localStorage.removeItem('sp_token');
  showToast('Logged out');
  navigate('home');
}

async function renderAccountView() {
  if (!currentUser) return navigate('home');
  const welcomeMsg = document.getElementById('account-welcome-msg');
  if (welcomeMsg) welcomeMsg.textContent = `Logged in as ${currentUser.name} (${currentUser.email})`;
  switchAccountTab('orders');
}

async function switchAccountTab(tab) {
  activeAccountTab = tab;
  const container = document.getElementById('account-tab-content');
  if (!container) return;

  if (tab === 'orders') {
    const userOrders = await apiFetch('/api/orders');
    container.innerHTML = `
      <h3 class="font-display font-bold text-xl text-[#3D2C3D] mb-4">My Orders</h3>
      ${userOrders.length === 0 ? '<p class="text-xs text-[#8B7A99]">No past orders found.</p>' : `
        <div class="space-y-4">
          ${userOrders.map(o => `
            <div class="p-4 border border-[#EEDBF5] rounded-2xl flex justify-between items-center text-sm">
              <div>
                <strong class="text-[#3D2C3D]">Order #${o.id}</strong>
                <div class="text-xs text-[#8B7A99]">${o.date} • ${o.items.length} items</div>
                <div class="text-[11px] text-[#7A9A8B] font-bold">Txn: ${o.paymentTxnId || 'Verified'}</div>
              </div>
              <div class="text-right">
                <div class="font-display font-bold text-[#FF85A1]">₹${o.total.toFixed(2)}</div>
                <button onclick="lookupOrderTimeline('${o.id}')" class="text-xs text-[#FF85A1] hover:underline font-bold">Track Status 📦</button>
              </div>
            </div>
          `).join('')}
        </div>
      `}
    `;
  } else if (tab === 'custom') {
    const customReqs = await apiFetch('/api/custom-orders');
    container.innerHTML = `
      <h3 class="font-display font-bold text-xl text-[#3D2C3D] mb-4">My Custom Requests</h3>
      ${customReqs.length === 0 ? '<p class="text-xs text-[#8B7A99]">No custom requests.</p>' : `
        <div class="space-y-4">
          ${customReqs.map(c => `
            <div class="p-4 border border-[#EEDBF5] rounded-2xl text-sm space-y-1">
              <div class="font-bold text-[#3D2C3D]">${c.productType} (#${c.id})</div>
              <div class="text-xs text-[#8B7A99]">${c.description}</div>
            </div>
          `).join('')}
        </div>
      `}
    `;
  }
}

/* ==========================================
   ADMIN PORTAL
   ========================================== */

async function renderAdminView() {
  const topTabs = document.getElementById('admin-top-tabs');
  const logoutBtn = document.getElementById('btn-admin-view-logout');
  const container = document.getElementById('admin-panel-content');

  const isAdminUser = currentUser && (currentUser.role === 'admin' || currentUser.role === 'super_admin');

  if (!isAdminUser) {
    if (topTabs) topTabs.style.display = 'none';
    if (logoutBtn) logoutBtn.style.display = 'none';
    if (container) {
      container.innerHTML = `
        <div class="max-w-md mx-auto my-6 bg-white p-6 sm:p-8 rounded-3xl border-2 border-[#FFC6FF] shadow-2xl space-y-6 text-center">
          <div class="w-16 h-16 rounded-full bg-[#FFF0F6] text-3xl flex items-center justify-center mx-auto shadow-sm">
            🔐
          </div>
          <div>
            <span class="badge-pill bg-[#FFE5EC] text-[#FF85A1] text-xs font-bold">Store Administration</span>
            <h2 class="font-display font-bold text-2xl text-[#3D2C3D] mt-2">Admin Dashboard Login</h2>
            <p class="text-xs text-[#8B7A99] mt-1">Single ID &amp; password for store management</p>
          </div>
          <form onsubmit="handleDirectAdminLogin(event)" class="space-y-4 text-left">
            <div>
              <label class="block text-xs font-bold text-[#8B7A99] mb-1">Admin ID / Email</label>
              <input type="text" id="admin-gate-login-id" value="admin" required class="form-input text-sm" placeholder="Enter admin">
            </div>
            <div>
              <label class="block text-xs font-bold text-[#8B7A99] mb-1">Admin Password</label>
              <input type="password" id="admin-gate-login-pass" value="admin123" required class="form-input text-sm" placeholder="Enter admin123">
            </div>
            <button type="submit" id="btn-admin-gate-submit" class="w-full btn-terracotta py-3.5 text-sm font-bold justify-center shadow-md">
              <i class="fa-solid fa-lock-open mr-1"></i> Unlock Admin Dashboard
            </button>
          </form>
          <div class="p-3 bg-[#FFF7FA] rounded-2xl border border-[#EEDBF5] text-xs text-[#8B7A99]">
            <span class="font-bold text-[#3D2C3D]">Single Admin Credentials:</span><br>
            ID: <code class="text-[#FF85A1] font-bold">admin</code> &bull; Password: <code class="text-[#FF85A1] font-bold">admin123</code>
          </div>
        </div>
      `;
    }
    return;
  }

  // User is authenticated as admin
  if (topTabs) topTabs.style.display = 'flex';
  if (logoutBtn) logoutBtn.style.display = 'inline-flex';
  switchAdminTab(activeAdminTab || 'overview');
}

async function handleDirectAdminLogin(e) {
  e.preventDefault();
  const idInput = document.getElementById('admin-gate-login-id');
  const passInput = document.getElementById('admin-gate-login-pass');
  const btn = document.getElementById('btn-admin-gate-submit');

  const loginId = (idInput ? idInput.value : 'admin').trim();
  const password = (passInput ? passInput.value : 'admin123').trim();

  if (btn) {
    btn.disabled = true;
    btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin mr-1"></i> Verifying...`;
  }

  try {
    const res = await apiFetch('/api/auth/login', 'POST', { loginId, password });
    if (!res || !res.token) throw new Error('Invalid login response from server');

    authToken = res.token;
    currentUser = res.user;

    localStorage.setItem('sp_token', res.token);
    localStorage.setItem('prisha_admin_token', res.token);
    localStorage.setItem('sp_user', JSON.stringify(res.user));

    updateHeaderUI();
    showToast(`🌸 Welcome to Admin Dashboard, ${res.user.name || 'Prisha'}!`);
    renderAdminView();
  } catch (err) {
    showToast(err.message || 'Login failed. Check Admin ID and password.');
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = `<i class="fa-solid fa-lock-open mr-1"></i> Unlock Admin Dashboard`;
    }
  }
}

function handleAdminLogout() {
  authToken = null;
  currentUser = null;
  localStorage.removeItem('sp_token');
  localStorage.removeItem('prisha_admin_token');
  localStorage.removeItem('sp_user');
  updateHeaderUI();
  showToast('Logged out of Admin Dashboard.');
  renderAdminView();
}

async function switchAdminTab(tab) {
  activeAdminTab = tab;
  const container = document.getElementById('admin-panel-content');
  if (!container) return;

  const allTabs = ['overview', 'products', 'orders', 'payments', 'carousel', 'messages', 'coupons', 'custom-orders', 'customers'];
  allTabs.forEach(t => {
    const btn = document.getElementById(`adm-tab-${t}`);
    if (btn) {
      if (t === tab) {
        btn.className = 'btn-terracotta text-xs whitespace-nowrap';
      } else {
        btn.className = 'btn-outline-terracotta text-xs whitespace-nowrap';
      }
    }
  });

  if (tab === 'overview') {
    const analytics = await apiFetch('/api/admin/analytics');
    container.innerHTML = `
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-white p-6 rounded-3xl border border-[#EEDBF5]">
          <div class="text-xs font-bold text-[#8B7A99] uppercase">Total Sales Revenue</div>
          <div class="font-display text-3xl font-bold text-[#FF85A1] mt-1">₹${analytics.totalSales.toFixed(2)}</div>
        </div>
        <div class="bg-white p-6 rounded-3xl border border-[#EEDBF5]">
          <div class="text-xs font-bold text-[#8B7A99] uppercase">Total Orders</div>
          <div class="font-display text-3xl font-bold text-[#3D2C3D] mt-1">${analytics.totalOrders}</div>
        </div>
        <div class="bg-white p-6 rounded-3xl border border-[#EEDBF5]">
          <div class="text-xs font-bold text-[#8B7A99] uppercase">Catalog Items</div>
          <div class="font-display text-3xl font-bold text-[#C8B6FF] mt-1">${analytics.totalProducts} Items</div>
        </div>
        <div class="bg-white p-6 rounded-3xl border border-[#EEDBF5]">
          <div class="text-xs font-bold text-[#8B7A99] uppercase">Low Stock Alerts</div>
          <div class="font-display text-3xl font-bold text-[#FF85A1] mt-1">${analytics.lowStockCount}</div>
        </div>
      </div>
      <div class="bg-white p-6 rounded-3xl border border-[#EEDBF5] space-y-3">
        <h4 class="font-display font-bold text-lg text-[#3D2C3D]">⚡ Quick Management Shortcuts</h4>
        <div class="flex flex-wrap gap-3">
          <button onclick="switchAdminTab('products')" class="btn-outline-terracotta text-xs"><i class="fa-solid fa-plus mr-1"></i> Add / Edit Products</button>
          <button onclick="switchAdminTab('orders')" class="btn-outline-terracotta text-xs"><i class="fa-solid fa-box mr-1"></i> Track &amp; Ship Orders</button>
          <button onclick="switchAdminTab('payments')" class="btn-outline-terracotta text-xs"><i class="fa-solid fa-qrcode mr-1"></i> Verify Direct UPI Payments</button>
          <button onclick="switchAdminTab('carousel')" class="btn-outline-terracotta text-xs"><i class="fa-solid fa-images mr-1"></i> Change Front Cover Photos</button>
          <button onclick="switchAdminTab('coupons')" class="btn-outline-terracotta text-xs"><i class="fa-solid fa-ticket mr-1"></i> Create Discount Coupon</button>
          <a href="/admin.html" target="_blank" class="btn-terracotta text-xs"><i class="fa-solid fa-arrow-up-right-from-square mr-1"></i> Open Studio Suite ↗</a>
        </div>
      </div>
    `;
  } else if (tab === 'products') {
    container.innerHTML = `
      <div class="flex justify-between items-center mb-4">
        <h3 class="font-display font-bold text-xl text-[#3D2C3D]">Product Inventory &amp; Catalog</h3>
        <button onclick="openAdminProductModal()" class="btn-terracotta text-xs"><i class="fa-solid fa-plus mr-1"></i> Add Product</button>
      </div>
      <div class="bg-white rounded-3xl border border-[#EEDBF5] overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead class="bg-[#FFF7FA] border-b border-[#EEDBF5] text-[#8B7A99]">
            <tr><th class="p-3">Product</th><th class="p-3">Category</th><th class="p-3">Price</th><th class="p-3">Stock</th><th class="p-3">Actions</th></tr>
          </thead>
          <tbody class="divide-y divide-[#EEDBF5]">
            ${products.map(p => `
              <tr>
                <td class="p-3 font-bold flex items-center gap-2">
                  <img src="${p.images[0]}" class="w-8 h-8 rounded object-cover">
                  ${p.name}
                </td>
                <td class="p-3">${p.category}</td>
                <td class="p-3 font-bold text-[#FF85A1]">₹${(p.salePrice||p.price).toFixed(2)}</td>
                <td class="p-3 font-mono">${p.stock}</td>
                <td class="p-3 space-x-2">
                  <button onclick="editAdminProduct('${p.id}')" class="text-[#FF85A1] font-bold"><i class="fa-solid fa-pen-to-square"></i> Edit</button>
                  <button onclick="deleteAdminProduct('${p.id}')" class="text-red-400 font-bold"><i class="fa-solid fa-trash-can"></i> Delete</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  } else if (tab === 'orders') {
    const allOrders = await apiFetch('/api/orders');
    container.innerHTML = `
      <div class="flex justify-between items-center mb-4">
        <h3 class="font-display font-bold text-xl text-[#3D2C3D]">Customer Orders &amp; Sales Tracker</h3>
        <span class="text-xs font-bold text-[#8B7A99]">Total Active Orders: ${allOrders.length}</span>
      </div>
      <div class="space-y-4">
        ${allOrders.length === 0 ? '<p class="text-xs text-[#8B7A99] p-6 text-center bg-white rounded-3xl border border-[#EEDBF5]">No orders placed yet. Orders will appear here as customers buy!</p>' : allOrders.map(o => `
          <div class="bg-white p-5 rounded-3xl border border-[#EEDBF5] flex flex-col md:flex-row justify-between md:items-center gap-4 text-xs">
            <div class="space-y-1">
              <div class="font-bold text-sm text-[#3D2C3D]">Order #${o.id} - ${o.customerName} (${o.customerEmail})</div>
              <div class="text-[#8B7A99]">${o.date || o.createdAt} • ${o.shippingAddress ? `${o.shippingAddress.address}, ${o.shippingAddress.city}` : ''}</div>
              <div class="text-[#8B7A99]">Items: ${o.items.map(i => `${i.qty}x ${i.name} [${i.giftWrap||'Std'}]`).join(', ')}</div>
              <div class="font-bold text-[#FF85A1]">Total: ₹${o.total.toFixed(2)} (${o.paymentStatus || 'PAID'})</div>
              <div class="text-[11px] text-[#7A9A8B] font-bold">Payment Method: ${o.paymentMethod || 'Online UPI'} • Ref: ${o.razorpayPaymentId || o.paymentTxnId || 'Direct UPI'}</div>
            </div>
            <div class="flex items-center gap-2">
              <select onchange="updateOrderStatus('${o.id}', this.value)" class="form-input text-xs py-1 px-2">
                <option value="Payment Confirmed &amp; Verified" ${(o.status||'').includes('Confirmed')?'selected':''}>Payment Confirmed &amp; Verified</option>
                <option value="Preparing Your Order" ${o.status==='Preparing Your Order'?'selected':''}>Preparing Your Order</option>
                <option value="Handed to Courier" ${o.status==='Handed to Courier'?'selected':''}>Handed to Courier</option>
                <option value="Out for Delivery" ${o.status==='Out for Delivery'?'selected':''}>Out for Delivery</option>
                <option value="Delivered" ${o.status==='Delivered'?'selected':''}>Delivered</option>
              </select>
              <button onclick="deleteAdminOrder('${o.id}')" class="bg-red-50 text-red-500 hover:bg-red-100 p-2 rounded-xl text-xs font-bold" title="Delete Order">
                <i class="fa-solid fa-trash-can"></i> Remove
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  } else if (tab === 'payments') {
    renderAdminPaymentsTab();
  } else if (tab === 'carousel') {
    renderAdminCarouselTab();
  } else if (tab === 'messages') {
    renderAdminMessagesTab();
  } else if (tab === 'coupons') {
    renderAdminCouponsTab();
  } else if (tab === 'custom-orders') {
    renderAdminCustomOrdersTab();
  } else if (tab === 'customers') {
    renderAdminCustomersTab();
  }
}

async function renderAdminPaymentsTab() {
  const container = document.getElementById('admin-panel-content');
  if (!container) return;

  try {
    container.innerHTML = `<div class="text-center py-12 text-[#8B7A99]"><i class="fa-solid fa-spinner fa-spin text-2xl mb-2"></i><p class="text-xs">Loading transaction records &amp; UPI verification logs...</p></div>`;

    const orders = await apiFetch('/api/orders');

    container.innerHTML = `
      <div class="bg-white p-6 rounded-3xl border border-[#EEDBF5] space-y-6">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-[#EEDBF5]">
          <div>
            <h3 class="font-display font-bold text-xl text-[#3D2C3D]">💳 UPI QR &amp; Online Payment Verification</h3>
            <p class="text-xs text-[#8B7A99]">Verify customer 12-digit UTR IDs, confirm received UPI payments, and manage refunds</p>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-xs font-bold text-[#FF85A1] bg-[#FFF0F6] px-3 py-1.5 rounded-full border border-[#FFC6FF]">
              Direct UPI QR + Razorpay
            </span>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs border-collapse">
            <thead>
              <tr class="bg-[#FFF7FA] border-b border-[#EEDBF5] text-[#3D2C3D]">
                <th class="p-3">Order ID</th>
                <th class="p-3">Customer</th>
                <th class="p-3">Amount</th>
                <th class="p-3">Payment Method &amp; Ref / UTR</th>
                <th class="p-3">Payment Status</th>
                <th class="p-3">Refund Status</th>
                <th class="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#EEDBF5]">
              ${orders.length === 0 ? `
                <tr><td colspan="7" class="p-6 text-center text-[#8B7A99]">No transactions recorded yet. Payments will show here automatically.</td></tr>
              ` : orders.map(o => `
                <tr class="hover:bg-[#FFF9FB] transition-colors">
                  <td class="p-3 font-mono font-bold text-[#3D2C3D]">${o.id}</td>
                  <td class="p-3">
                    <div class="font-bold text-[#3D2C3D]">${o.customerName}</div>
                    <div class="text-[10px] text-[#8B7A99]">${o.customerEmail} ${o.customerPhone ? '• ' + o.customerPhone : ''}</div>
                  </td>
                  <td class="p-3 font-display font-bold text-[#FF85A1] text-sm">₹${o.total.toFixed(2)}</td>
                  <td class="p-3">
                    <div class="font-bold text-[#3D2C3D]">${o.paymentMethod || 'Direct UPI QR'}</div>
                    <div class="font-mono text-[11px] text-[#FF85A1]">UTR: ${o.paymentTxnId || o.razorpayPaymentId || 'Direct UPI'}</div>
                  </td>
                  <td class="p-3">
                    <span class="px-2.5 py-1 rounded-full font-bold text-[10px] ${o.paymentStatus === 'PAID' ? 'bg-emerald-100 text-emerald-700' : (o.paymentStatus === 'REFUNDED' ? 'bg-purple-100 text-purple-700' : (o.paymentStatus === 'FAILED' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'))}">
                      ${o.paymentStatus || 'PAID'}
                    </span>
                  </td>
                  <td class="p-3">
                    <span class="px-2 py-0.5 rounded-full font-bold text-[10px] ${o.refundStatus === 'FULL' ? 'bg-purple-100 text-purple-700' : (o.refundStatus === 'PARTIAL' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600')}">
                      ${o.refundStatus || 'NONE'} ${o.refundAmount > 0 ? `(₹${o.refundAmount})` : ''}
                    </span>
                  </td>
                  <td class="p-3 text-right space-x-1.5 whitespace-nowrap">
                    ${o.paymentStatus !== 'PAID' ? `
                      <button onclick="confirmAdminPayment('${o.id}')" class="bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-[11px] font-bold py-1 px-2.5 rounded-full transition-all">
                        ✓ Confirm Payment
                      </button>
                    ` : ''}
                    ${(o.paymentStatus === 'PAID' || o.paymentStatus === 'PARTIALLY_REFUNDED' || !o.paymentStatus) ? `
                      <button onclick="promptAdminRefund('${o.id}', ${o.total}, ${o.refundAmount || 0})" class="bg-purple-100 hover:bg-purple-200 text-purple-800 text-[11px] font-bold py-1 px-2.5 rounded-full transition-all">
                        Refund 💸
                      </button>
                    ` : `<span class="text-[10px] text-[#8B7A99] italic">N/A</span>`}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  } catch (err) {
    container.innerHTML = `<div class="p-6 text-center text-red-500 font-bold">Failed to load payment transactions: ${err.message}</div>`;
  }
}

async function confirmAdminPayment(orderId) {
  if (!confirm(`Confirm received UPI payment for order #${orderId}?`)) return;
  try {
    await apiFetch(`/api/orders/${orderId}/confirm-payment`, 'PUT');
    showToast(`✓ Order #${orderId} verified and marked as PAID!`);
    trigger3DConfetti();
    renderAdminPaymentsTab();
  } catch (err) {
    showToast('Failed to confirm payment: ' + err.message);
  }
}

async function renderAdminMessagesTab() {
  const container = document.getElementById('admin-panel-content');
  if (!container) return;
  container.innerHTML = `<div class="text-center py-12 text-[#8B7A99]"><i class="fa-solid fa-spinner fa-spin text-2xl mb-2"></i><p class="text-xs">Loading customer inquiries...</p></div>`;

  try {
    const messages = await apiFetch('/api/admin/support');
    container.innerHTML = `
      <div class="bg-white p-6 rounded-3xl border border-[#EEDBF5] space-y-6">
        <div class="flex justify-between items-center pb-4 border-b border-[#EEDBF5]">
          <div>
            <h3 class="font-display font-bold text-xl text-[#3D2C3D]">💌 Customer Inquiries &amp; Support Messages</h3>
            <p class="text-xs text-[#8B7A99]">Messages submitted by shoppers through the website contact form</p>
          </div>
          <span class="badge-pill bg-[#FFE5EC] text-[#FF85A1] font-bold text-xs">Total: ${messages.length}</span>
        </div>

        <div class="space-y-4">
          ${messages.length === 0 ? '<p class="text-xs text-[#8B7A99] py-8 text-center bg-[#FFF7FA] rounded-2xl">No inquiries right now. All caught up! 🌸</p>' : messages.map(m => `
            <div class="bg-[#FFF7FA] p-5 rounded-2xl border border-[#EEDBF5] space-y-2 text-xs">
              <div class="flex justify-between items-start">
                <div>
                  <div class="font-bold text-sm text-[#3D2C3D]">${m.customerName}</div>
                  <a href="mailto:${m.customerEmail}" class="text-[#FF85A1] hover:underline font-mono">${m.customerEmail}</a>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-[#8B7A99] text-[11px]">${m.createdAt || 'Recent'}</span>
                  <button onclick="deleteAdminMessage('${m.id}')" class="text-red-400 hover:text-red-600 font-bold ml-2" title="Delete Inquiry">
                    <i class="fa-solid fa-trash-can"></i>
                  </button>
                </div>
              </div>
              <div class="bg-white p-3 rounded-xl border border-[#EEDBF5] text-[#3D2C3D] leading-relaxed">
                "${m.message}"
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  } catch (err) {
    container.innerHTML = `<div class="p-6 text-center text-red-500 font-bold">Failed to load inquiries: ${err.message}</div>`;
  }
}

async function deleteAdminMessage(id) {
  if (!confirm('Remove this customer inquiry?')) return;
  try {
    await apiFetch(`/api/admin/support/${id}`, 'DELETE');
    showToast('Inquiry removed');
    renderAdminMessagesTab();
  } catch (err) {
    showToast('Failed to remove: ' + err.message);
  }
}

async function renderAdminCouponsTab() {
  const container = document.getElementById('admin-panel-content');
  if (!container) return;
  container.innerHTML = `<div class="text-center py-12 text-[#8B7A99]"><i class="fa-solid fa-spinner fa-spin text-2xl mb-2"></i><p class="text-xs">Loading coupons...</p></div>`;

  try {
    const coupons = await apiFetch('/api/admin/coupons');
    container.innerHTML = `
      <div class="bg-white p-6 rounded-3xl border border-[#EEDBF5] space-y-6">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-[#EEDBF5]">
          <div>
            <h3 class="font-display font-bold text-xl text-[#3D2C3D]">🏷️ Promo Discount Coupons</h3>
            <p class="text-xs text-[#8B7A99]">Create discount codes for customer checkouts</p>
          </div>
        </div>

        <div class="bg-[#FFF7FA] p-5 rounded-2xl border border-[#EEDBF5] space-y-3">
          <h4 class="font-bold text-xs text-[#3D2C3D] uppercase">Create New Coupon Code</h4>
          <form onsubmit="handleCreateAdminCoupon(event)" class="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <label class="block font-bold text-[#8B7A99] mb-1">Coupon Code *</label>
              <input type="text" id="adm-new-coupon-code" required placeholder="e.g. PRISHA15" class="form-input text-xs !py-1.5 uppercase font-mono">
            </div>
            <div>
              <label class="block font-bold text-[#8B7A99] mb-1">Discount % *</label>
              <input type="number" id="adm-new-coupon-discount" min="1" max="90" required placeholder="15" class="form-input text-xs !py-1.5 font-mono">
            </div>
            <div>
              <label class="block font-bold text-[#8B7A99] mb-1">Min Spend (₹)</label>
              <input type="number" id="adm-new-coupon-min" min="0" placeholder="499" class="form-input text-xs !py-1.5 font-mono">
            </div>
            <div class="flex items-end">
              <button type="submit" class="w-full btn-terracotta text-xs !py-2 justify-center">
                <i class="fa-solid fa-plus mr-1"></i> Add Coupon
              </button>
            </div>
          </form>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs border-collapse">
            <thead>
              <tr class="bg-[#FFF7FA] border-b border-[#EEDBF5] text-[#3D2C3D]">
                <th class="p-3">Coupon Code</th>
                <th class="p-3">Discount</th>
                <th class="p-3">Min Spend</th>
                <th class="p-3">Status</th>
                <th class="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#EEDBF5]">
              ${coupons.map(c => `
                <tr>
                  <td class="p-3 font-mono font-bold text-[#FF85A1] text-sm">${c.code}</td>
                  <td class="p-3 font-bold">${c.discount}% OFF</td>
                  <td class="p-3">₹${c.minSpend || 0}</td>
                  <td class="p-3">
                    <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${c.active !== false ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}">
                      ${c.active !== false ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td class="p-3 text-right">
                    <button onclick="deleteAdminCoupon('${c.code}')" class="text-red-400 hover:text-red-600 font-bold" title="Delete Coupon">
                      <i class="fa-solid fa-trash-can"></i> Delete
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  } catch (err) {
    container.innerHTML = `<div class="p-6 text-center text-red-500 font-bold">Failed to load coupons: ${err.message}</div>`;
  }
}

async function handleCreateAdminCoupon(e) {
  e.preventDefault();
  const code = document.getElementById('adm-new-coupon-code').value.trim();
  const discount = document.getElementById('adm-new-coupon-discount').value;
  const minSpend = document.getElementById('adm-new-coupon-min').value || 0;

  try {
    await apiFetch('/api/admin/coupons', 'POST', { code, discount, minSpend });
    showToast(`✓ Coupon ${code.toUpperCase()} created successfully!`);
    renderAdminCouponsTab();
  } catch (err) {
    showToast('Failed to create coupon: ' + err.message);
  }
}

async function deleteAdminCoupon(code) {
  if (!confirm(`Delete coupon ${code}?`)) return;
  try {
    await apiFetch(`/api/admin/coupons/${code}`, 'DELETE');
    showToast('Coupon removed');
    renderAdminCouponsTab();
  } catch (err) {
    showToast('Failed to delete: ' + err.message);
  }
}

async function renderAdminCustomOrdersTab() {
  const container = document.getElementById('admin-panel-content');
  if (!container) return;
  container.innerHTML = `<div class="text-center py-12 text-[#8B7A99]"><i class="fa-solid fa-spinner fa-spin text-2xl mb-2"></i><p class="text-xs">Loading custom requests...</p></div>`;

  try {
    const list = await apiFetch('/api/custom-orders');
    container.innerHTML = `
      <div class="bg-white p-6 rounded-3xl border border-[#EEDBF5] space-y-6">
        <div class="flex justify-between items-center pb-4 border-b border-[#EEDBF5]">
          <div>
            <h3 class="font-display font-bold text-xl text-[#3D2C3D]">🎨 Custom Crochet Requests</h3>
            <p class="text-xs text-[#8B7A99]">Requests submitted by shoppers for bespoke flowers, hair accessories, and hampers</p>
          </div>
          <span class="badge-pill bg-[#E8D7FF] text-[#3D2C3D] font-bold text-xs">Total: ${list.length}</span>
        </div>

        <div class="space-y-4">
          ${list.length === 0 ? '<p class="text-xs text-[#8B7A99] py-8 text-center bg-[#FFF7FA] rounded-2xl">No custom orders submitted yet.</p>' : list.map(c => `
            <div class="bg-[#FFF7FA] p-5 rounded-2xl border border-[#EEDBF5] space-y-3 text-xs">
              <div class="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                <div>
                  <span class="font-mono font-bold text-[#FF85A1] text-xs">${c.id}</span>
                  <div class="font-bold text-sm text-[#3D2C3D]">${c.customerName} (${c.customerEmail} ${c.phone ? '• ' + c.phone : ''})</div>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-[#8B7A99]">Budget: <strong>${c.budget || 'Standard'}</strong></span>
                  <select onchange="updateCustomOrderStatus('${c.id}', this.value)" class="form-input text-xs py-1 px-2">
                    <option value="Request Received" ${c.status === 'Request Received' ? 'selected' : ''}>Request Received</option>
                    <option value="Quote Sent" ${c.status === 'Quote Sent' ? 'selected' : ''}>Quote Sent</option>
                    <option value="Work in Progress" ${c.status === 'Work in Progress' ? 'selected' : ''}>Work in Progress</option>
                    <option value="Completed" ${c.status === 'Completed' ? 'selected' : ''}>Completed</option>
                  </select>
                </div>
              </div>
              <div class="bg-white p-3 rounded-xl border border-[#EEDBF5]">
                <div class="font-bold text-[#3D2C3D] mb-1">Item: ${c.productType}</div>
                <p class="text-[#8B7A99] leading-relaxed">"${c.description}"</p>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  } catch (err) {
    container.innerHTML = `<div class="p-6 text-center text-red-500 font-bold">Failed to load custom orders: ${err.message}</div>`;
  }
}

async function updateCustomOrderStatus(id, status) {
  try {
    await apiFetch(`/api/custom-orders/${id}/status`, 'PUT', { status });
    showToast(`Custom order status updated to ${status}`);
  } catch (err) {
    showToast('Failed to update: ' + err.message);
  }
}

async function renderAdminCustomersTab() {
  const container = document.getElementById('admin-panel-content');
  if (!container) return;
  container.innerHTML = `<div class="text-center py-12 text-[#8B7A99]"><i class="fa-solid fa-spinner fa-spin text-2xl mb-2"></i><p class="text-xs">Loading customer accounts...</p></div>`;

  try {
    const users = await apiFetch('/api/admin/users');
    container.innerHTML = `
      <div class="bg-white p-6 rounded-3xl border border-[#EEDBF5] space-y-6">
        <div class="flex justify-between items-center pb-4 border-b border-[#EEDBF5]">
          <div>
            <h3 class="font-display font-bold text-xl text-[#3D2C3D]">👥 Registered Customers &amp; Accounts</h3>
            <p class="text-xs text-[#8B7A99]">All customer accounts created in your store</p>
          </div>
          <span class="badge-pill bg-[#FFF0F6] text-[#FF85A1] font-bold text-xs">Total: ${users.length}</span>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs border-collapse">
            <thead>
              <tr class="bg-[#FFF7FA] border-b border-[#EEDBF5] text-[#3D2C3D]">
                <th class="p-3">Customer Name</th>
                <th class="p-3">Email</th>
                <th class="p-3">Role</th>
                <th class="p-3">Phone</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#EEDBF5]">
              ${users.map(u => `
                <tr>
                  <td class="p-3 font-bold text-[#3D2C3D] flex items-center gap-2">
                    <span class="w-7 h-7 rounded-full bg-[#FFE5EC] text-xs font-bold text-[#FF85A1] flex items-center justify-center">
                      ${(u.name || 'U').charAt(0).toUpperCase()}
                    </span>
                    ${u.name}
                  </td>
                  <td class="p-3 font-mono text-[#FF85A1]">${u.email}</td>
                  <td class="p-3">
                    <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${u.role === 'admin' || u.role === 'super_admin' ? 'bg-purple-100 text-purple-700' : 'bg-emerald-100 text-emerald-700'}">
                      ${u.role ? u.role.toUpperCase() : 'CUSTOMER'}
                    </span>
                  </td>
                  <td class="p-3">${u.phone || '—'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  } catch (err) {
    container.innerHTML = `<div class="p-6 text-center text-red-500 font-bold">Failed to load customer accounts: ${err.message}</div>`;
  }
}

async function promptAdminRefund(orderId, totalAmount, existingRefunds) {
  const remaining = totalAmount - (existingRefunds || 0);
  const input = prompt(`Enter refund amount in ₹ for order ${orderId} (Max refundable: ₹${remaining.toFixed(2)}):`, remaining.toFixed(2));
  if (!input) return;

  const refundAmt = parseFloat(input);
  if (isNaN(refundAmt) || refundAmt <= 0 || refundAmt > remaining) {
    showToast(`Invalid amount! Max refundable is ₹${remaining.toFixed(2)}`);
    return;
  }

  const reason = prompt(`Enter reason for refund:`, 'Customer requested refund');

  try {
    const res = await apiFetch('/api/payments/refund', 'POST', {
      orderId: orderId,
      amount: refundAmt,
      reason: reason || 'Admin refund'
    });

    if (res.success) {
      showToast(res.message);
      renderAdminPaymentsTab();
    }
  } catch (err) {
    showToast('Refund failed: ' + err.message);
  }
}

async function updateOrderStatus(orderId, status) {
  try {
    await apiFetch(`/api/orders/${orderId}/status`, 'PUT', { status });
    showToast(`Order #${orderId} status updated!`);
  } catch (err) {
    showToast('Failed to update status');
  }
}

async function deleteAdminOrder(orderId) {
  if (confirm(`Are you sure you want to delete order #${orderId}? This will remove it from sales history.`)) {
    try {
      await apiFetch(`/api/orders/${orderId}`, 'DELETE');
      showToast(`Order #${orderId} removed!`);
      switchAdminTab('orders');
    } catch (err) {
      showToast('Failed to delete order');
    }
  }
}

function openAdminProductModal() {
  document.getElementById('admin-product-modal-title').textContent = "Add New Crochet Item";
  document.getElementById('adm-prod-id').value = "";
  document.getElementById('adm-prod-name').value = "";
  document.getElementById('adm-prod-price').value = "";
  document.getElementById('adm-prod-saleprice').value = "";
  document.getElementById('adm-prod-stock').value = "15";
  document.getElementById('adm-prod-yarn').value = "100% Natural Cotton Yarn";
  document.getElementById('adm-prod-desc').value = "";
  document.getElementById('modal-admin-product')?.classList.add('active');
}

function editAdminProduct(productId) {
  const p = products.find(prod => prod.id === productId);
  if (!p) return;

  document.getElementById('admin-product-modal-title').textContent = "Edit Product Details";
  document.getElementById('adm-prod-id').value = p.id;
  document.getElementById('adm-prod-name').value = p.name;
  document.getElementById('adm-prod-cat').value = p.category;
  document.getElementById('adm-prod-price').value = p.price;
  document.getElementById('adm-prod-saleprice').value = p.salePrice || "";
  document.getElementById('adm-prod-stock').value = p.stock;
  document.getElementById('adm-prod-yarn').value = p.yarnType;
  document.getElementById('adm-prod-desc').value = p.description;
  document.getElementById('modal-admin-product')?.classList.add('active');
}

function closeAdminProductModal() { document.getElementById('modal-admin-product')?.classList.remove('active'); }

async function handleAdminSaveProduct(e) {
  e.preventDefault();
  const id = document.getElementById('adm-prod-id').value;
  const payload = {
    name: document.getElementById('adm-prod-name').value,
    category: document.getElementById('adm-prod-cat').value,
    price: parseFloat(document.getElementById('adm-prod-price').value),
    salePrice: document.getElementById('adm-prod-saleprice').value ? parseFloat(document.getElementById('adm-prod-saleprice').value) : null,
    stock: parseInt(document.getElementById('adm-prod-stock').value, 10),
    yarnType: document.getElementById('adm-prod-yarn').value,
    description: document.getElementById('adm-prod-desc').value
  };

  try {
    if (id) {
      await apiFetch(`/api/products/${id}`, 'PUT', payload);
      showToast('Product updated successfully!');
    } else {
      payload.images = ['https://images.unsplash.com/photo-1563241527-3004b7be0ffd?auto=format&fit=crop&w=800&q=80'];
      await apiFetch('/api/products', 'POST', payload);
      showToast('New product added!');
    }
    closeAdminProductModal();
    await loadProducts();
    switchAdminTab('products');
  } catch (err) {
    showToast('Failed to save product');
  }
}

async function deleteAdminProduct(productId) {
  if (confirm('Delete this product from catalog?')) {
    try {
      await apiFetch(`/api/products/${productId}`, 'DELETE');
      await loadProducts();
      switchAdminTab('products');
      showToast('Product deleted');
    } catch (err) {
      showToast('Failed to delete product');
    }
  }
}

/* ==========================================
   ADMIN HERO CAROUSEL MANAGER
   ========================================== */

function renderAdminCarouselTab() {
  const container = document.getElementById('admin-panel-content');
  if (!container) return;

  container.innerHTML = `
    <div class="bg-white p-6 rounded-3xl border border-[#EEDBF5] space-y-6">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-[#EEDBF5]">
        <div>
          <h3 class="font-display font-bold text-xl text-[#3D2C3D]">🎨 Hero Showcase Carousel Images</h3>
          <p class="text-xs text-[#8B7A99]">Edit the rotating photos, titles, and details displayed prominently on the homepage front cover</p>
        </div>
        <div class="flex items-center gap-2">
          <button onclick="addAdminCarouselSlide()" class="btn-outline-terracotta text-xs !py-2 !px-3">
            <i class="fa-solid fa-plus"></i> Add Slide
          </button>
          <button onclick="saveAdminCarouselSlides()" class="btn-terracotta text-xs !py-2 !px-4">
            <i class="fa-solid fa-floppy-disk"></i> Save Hero Slides
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6" id="admin-carousel-slides-list">
        ${heroSlides.map((slide, idx) => `
          <div class="bg-[#FFF9FB] p-4 rounded-2xl border border-[#EEDBF5] space-y-3 relative group" data-slide-index="${idx}">
            <div class="flex justify-between items-center">
              <span class="badge-pill bg-white text-[#FF85A1] text-xs font-bold border border-[#FFC6FF]">
                Slide #${idx + 1}
              </span>
              <div class="flex items-center gap-2">
                ${heroSlides.length > 1 ? `
                  <button type="button" onclick="deleteAdminCarouselSlide(${idx})" class="text-red-400 hover:text-red-600 text-xs font-bold" title="Delete Slide">
                    <i class="fa-solid fa-trash-can"></i> Remove
                  </button>
                ` : ''}
              </div>
            </div>

            <!-- Image Preview Box -->
            <div class="relative w-full h-44 rounded-xl overflow-hidden bg-white border border-[#EEDBF5]">
              <img id="admin-slide-preview-${idx}" src="${slide.image}" alt="Preview" class="w-full h-full object-cover" onerror="this.src='https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=800&q=80'">
              <div class="absolute bottom-2 left-2 right-2 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-lg text-[11px] font-bold text-[#3D2C3D] truncate flex items-center gap-1.5">
                <span>${slide.icon || '🌸'}</span>
                <span class="truncate">${slide.title || 'Slide Title'}</span>
              </div>
            </div>

            <div class="space-y-2 text-xs">
              <div>
                <label class="block font-bold text-[#8B7A99] mb-1">Image URL / Path *</label>
                <input type="text" value="${slide.image}" oninput="updateAdminSlidePreview(${idx}, this.value)" class="form-input text-xs !py-1.5 font-mono admin-slide-image-input" placeholder="https://images.unsplash.com/... or images/photo.png">
              </div>
              <div class="grid grid-cols-4 gap-2">
                <div class="col-span-3">
                  <label class="block font-bold text-[#8B7A99] mb-1">Title *</label>
                  <input type="text" value="${slide.title || ''}" class="form-input text-xs !py-1.5 admin-slide-title-input" placeholder="e.g. Tulip & Rose Handmade Bouquet">
                </div>
                <div>
                  <label class="block font-bold text-[#8B7A99] mb-1">Icon Emoji</label>
                  <input type="text" value="${slide.icon || '💐'}" class="form-input text-xs !py-1.5 text-center admin-slide-icon-input" placeholder="💐">
                </div>
              </div>
              <div>
                <label class="block font-bold text-[#8B7A99] mb-1">Subtitle / Features *</label>
                <input type="text" value="${slide.subtitle || ''}" class="form-input text-xs !py-1.5 admin-slide-subtitle-input" placeholder="e.g. 100% Cotton Yarn • Gift wrapping optional">
              </div>
            </div>
          </div>
        `).join('')}
      </div>

      <div class="flex flex-col sm:flex-row justify-between items-center gap-3 pt-4 border-t border-[#EEDBF5]">
        <button type="button" onclick="resetAdminCarouselSlides()" class="text-xs text-[#8B7A99] hover:text-[#3D2C3D] underline">
          ↺ Reset to Default Curated Slides
        </button>
        <button onclick="saveAdminCarouselSlides()" class="btn-terracotta text-xs w-full sm:w-auto">
          <i class="fa-solid fa-check"></i> Save &amp; Publish Hero Slides
        </button>
      </div>
    </div>
  `;
}

function updateAdminSlidePreview(idx, url) {
  const img = document.getElementById(`admin-slide-preview-${idx}`);
  if (img && url) {
    img.src = url.trim();
  }
}

function addAdminCarouselSlide() {
  heroSlides.push({
    id: `slide-${Date.now()}`,
    title: 'Floral Hair Accessories',
    subtitle: '100% Cotton Yarn • Gift wrapping optional',
    icon: '✨',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80'
  });
  renderAdminCarouselTab();
}

function deleteAdminCarouselSlide(idx) {
  if (heroSlides.length <= 1) {
    showToast('Carousel must have at least one slide.');
    return;
  }
  heroSlides.splice(idx, 1);
  renderAdminCarouselTab();
}

async function resetAdminCarouselSlides() {
  if (!confirm('Reset hero carousel back to default curated slides?')) return;
  heroSlides = [
    {
      id: "slide-1",
      title: "Tulip & Rose Handmade Bouquet",
      subtitle: "100% Cotton Yarn • Gift wrapping optional",
      icon: "💐",
      image: "https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "slide-2",
      title: "Floral Hair Clips & Scrunchies",
      subtitle: "Soft on Hair • Everlasting Handcrafted Charms",
      icon: "✨",
      image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "slide-3",
      title: "Forever Sunflower Single Stem",
      subtitle: "Golden Cotton Petals • Never Wilts",
      icon: "🌻",
      image: "https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "slide-4",
      title: "Deluxe Handcrafted Gift Hamper",
      subtitle: "Bouquet, Clips & Keychain • Curated Aesthetic Box",
      icon: "🎁",
      image: "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=800&q=80"
    }
  ];
  await saveAdminCarouselSlides();
}

async function saveAdminCarouselSlides() {
  const cards = document.querySelectorAll('#admin-carousel-slides-list > div');
  const updated = [];
  cards.forEach((card, idx) => {
    const imgInput = card.querySelector('.admin-slide-image-input');
    const titleInput = card.querySelector('.admin-slide-title-input');
    const iconInput = card.querySelector('.admin-slide-icon-input');
    const subInput = card.querySelector('.admin-slide-subtitle-input');
    if (imgInput && titleInput) {
      updated.push({
        id: (heroSlides[idx] && heroSlides[idx].id) || `slide-${idx + 1}`,
        title: titleInput.value.trim() || 'Handcrafted Crochet Piece',
        subtitle: (subInput ? subInput.value.trim() : '') || '100% Cotton Yarn • Gift wrapping optional',
        icon: (iconInput ? iconInput.value.trim() : '') || '🌸',
        image: imgInput.value.trim() || 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=800&q=80'
      });
    }
  });

  if (updated.length > 0) {
    heroSlides = updated;
  }

  try {
    const res = await apiFetch('/api/carousel', 'PUT', { slides: heroSlides });
    if (res && res.slides) {
      heroSlides = res.slides;
    }
    showToast('🌸 Hero carousel slides saved successfully!');
    renderAdminCarouselTab();
    renderHeroCarousel();
  } catch (err) {
    showToast('Failed to save carousel slides: ' + err.message);
  }
}

/* ==========================================
   SEARCH & TOAST
   ========================================== */

function openSearchModal() { document.getElementById('modal-search')?.classList.add('active'); }
function closeSearchModal() { document.getElementById('modal-search')?.classList.remove('active'); }

function handleLiveSearch(query) {
  const container = document.getElementById('live-search-results');
  if (!container) return;

  if (!query.trim()) {
    container.innerHTML = '<p class="text-xs text-[#8B7A99]">Type flowers, keychains, hair clips, hampers...</p>';
    return;
  }

  const matches = products.filter(p => p.name.toLowerCase().includes(query.toLowerCase()));
  if (matches.length === 0) {
    container.innerHTML = '<p class="text-xs text-[#8B7A99]">No matching items found.</p>';
    return;
  }

  container.innerHTML = matches.map(p => `
    <div onclick="closeSearchModal(); openProductModal('${p.id}');" class="p-3 border border-[#EEDBF5] rounded-2xl flex items-center gap-3 cursor-pointer hover:border-[#FF85A1] bg-white">
      <img src="${p.images[0]}" class="w-12 h-12 rounded-xl object-cover">
      <div>
        <div class="font-display font-bold text-sm text-[#3D2C3D]">${p.name}</div>
        <div class="text-xs text-[#FF85A1] font-bold">₹${(p.salePrice||p.price).toFixed(2)}</div>
      </div>
    </div>
  `).join('');
}

function toggleWishlist(productId) {
  const idx = wishlist.indexOf(productId);
  if (idx > -1) {
    wishlist.splice(idx, 1);
    showToast('Removed from Wishlist');
  } else {
    wishlist.push(productId);
    showToast('Saved to Wishlist ♡');
  }
  localStorage.setItem('sp_wishlist', JSON.stringify(wishlist));
  updateWishlistBadge();
}

function openWishlistModal() { navigate('shop'); }

async function handleSupportSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('supp-name').value;
  const email = document.getElementById('supp-email').value;
  const message = document.getElementById('supp-msg').value;

  try {
    await apiFetch('/api/support', 'POST', { customerName: name, customerEmail: email, message });
    showToast('Message sent to Prisha! ♡');
    e.target.reset();
  } catch (err) {
    showToast('Failed to send message');
  }
}

function handleNewsletterSubmit(e) {
  e.preventDefault();
  showToast('Thank you for subscribing to Crochet by Prisha! ♡');
  e.target.reset();
}

function showToast(message) {
  const box = document.getElementById('toast-box');
  const msgElem = document.getElementById('toast-msg');
  if (box && msgElem) {
    msgElem.textContent = message;
    box.classList.add('show');
    setTimeout(() => box.classList.remove('show'), 3500);
  }
}

/* ==========================================
   3D GRAPHICAL MOTION ENGINE (THREE.JS & PARALLAX)
   ========================================== */

let heroScene, heroCamera, heroRenderer, floatingObjects = [];
let mouseX = 0, mouseY = 0;
let targetMouseX = 0, targetMouseY = 0;

function init3DHeroScene() {
  const canvas = document.getElementById('hero-3d-canvas');
  const container = document.getElementById('hero-section-container');
  if (!canvas || !container || typeof THREE === 'undefined') return;

  if (heroRenderer) {
    // Already initialized
    return;
  }

  // Scene setup
  heroScene = new THREE.Scene();

  // Camera setup
  const aspect = container.clientWidth / container.clientHeight;
  heroCamera = new THREE.PerspectiveCamera(50, aspect, 0.1, 1000);
  heroCamera.position.set(0, 0, 12);

  // WebGL Renderer setup
  heroRenderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  heroRenderer.setSize(container.clientWidth, container.clientHeight);
  heroRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
  heroScene.add(ambientLight);

  const dirLight1 = new THREE.DirectionalLight(0xff85a1, 1.2);
  dirLight1.position.set(5, 8, 5);
  heroScene.add(dirLight1);

  const dirLight2 = new THREE.DirectionalLight(0xc8b6ff, 1.0);
  dirLight2.position.set(-5, -5, 5);
  heroScene.add(dirLight2);

  // Vibrant Materials & Geometries for 3D Crochet Yarn Objects
  const cottonYarnColors = [0xFF85A1, 0xC8B6FF, 0xA0C4FF, 0xFFC6FF, 0xFDFFB6];
  
  const geometries = [
    new THREE.SphereGeometry(0.85, 32, 32),
    new THREE.TorusKnotGeometry(0.65, 0.22, 64, 16),
    new THREE.TorusGeometry(0.75, 0.28, 16, 32),
    new THREE.IcosahedronGeometry(0.75, 1)
  ];

  for (let i = 0; i < 14; i++) {
    const geom = geometries[i % geometries.length];
    const color = cottonYarnColors[i % cottonYarnColors.length];
    const mat = new THREE.MeshStandardMaterial({
      color: color,
      roughness: 0.55,
      metalness: 0.1
    });

    const mesh = new THREE.Mesh(geom, mat);
    
    mesh.position.x = (Math.random() - 0.5) * 18;
    mesh.position.y = (Math.random() - 0.5) * 10;
    mesh.position.z = (Math.random() - 0.5) * 6 - 2;

    mesh.rotation.x = Math.random() * Math.PI;
    mesh.rotation.y = Math.random() * Math.PI;

    mesh.userData = {
      rotSpeedX: (Math.random() - 0.5) * 0.015,
      rotSpeedY: (Math.random() - 0.5) * 0.015,
      floatSpeed: 0.001 + Math.random() * 0.002,
      floatOffset: Math.random() * Math.PI * 2,
      initialY: mesh.position.y
    };

    heroScene.add(mesh);
    floatingObjects.push(mesh);
  }

  // Particle sparkle field
  const particleCount = 70;
  const particleGeom = new THREE.BufferGeometry();
  const particlePositions = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount * 3; i += 3) {
    particlePositions[i] = (Math.random() - 0.5) * 22;
    particlePositions[i + 1] = (Math.random() - 0.5) * 12;
    particlePositions[i + 2] = (Math.random() - 0.5) * 10;
  }

  particleGeom.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
  const particleMat = new THREE.PointsMaterial({
    color: 0xFFC6FF,
    size: 0.16,
    transparent: true,
    opacity: 0.75
  });

  const particles = new THREE.Points(particleGeom, particleMat);
  heroScene.add(particles);

  // Interactive 3D Cursor Parallax Physics
  window.addEventListener('mousemove', (e) => {
    targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  // Handle window resize
  window.addEventListener('resize', () => {
    if (!container || !heroRenderer || !heroCamera) return;
    const w = container.clientWidth;
    const h = container.clientHeight;
    heroCamera.aspect = w / h;
    heroCamera.updateProjectionMatrix();
    heroRenderer.setSize(w, h);
  });

  // Animation render loop
  function animate(time) {
    requestAnimationFrame(animate);

    // Smooth lerp mouse parallax
    mouseX += (targetMouseX - mouseX) * 0.05;
    mouseY += (targetMouseY - mouseY) * 0.05;

    heroCamera.position.x = mouseX * 1.8;
    heroCamera.position.y = -mouseY * 1.8;
    heroCamera.lookAt(heroScene.position);

    // Rotate and float 3D items
    const sec = time * 0.001;
    floatingObjects.forEach((obj) => {
      obj.rotation.x += obj.userData.rotSpeedX;
      obj.rotation.y += obj.userData.rotSpeedY;
      obj.position.y = obj.userData.initialY + Math.sin(sec * 2 + obj.userData.floatOffset) * 0.45;
    });

    particles.rotation.y = sec * 0.04;

    heroRenderer.render(heroScene, heroCamera);
  }

  animate(0);
}

/* 3D Product Card Mouse Parallax Tilt Physics */
function init3DTiltCards() {
  const cards = document.querySelectorAll('.product-card, .category-card');
  cards.forEach((card) => {
    if (card.dataset.tiltInitialized) return;
    card.dataset.tiltInitialized = "true";

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -12;
      const rotateY = ((x - centerX) / centerX) * 12;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });
}

/* 3D Interactive Product Visualizer Modal */
let isModal3DActive = false;
let modal3DScene, modal3DCamera, modal3DRenderer, modalMesh;

function toggleModal3DView(productId) {
  const img = document.getElementById('modal-main-img');
  const canvas = document.getElementById('modal-3d-canvas');
  const btn = document.getElementById('modal-3d-toggle-btn');
  if (!img || !canvas || !btn) return;

  isModal3DActive = !isModal3DActive;
  if (isModal3DActive) {
    img.classList.add('hidden');
    canvas.classList.remove('hidden');
    btn.innerHTML = '<i class="fa-solid fa-camera"></i> <span>Photo View</span>';
    initModal3DCanvas(productId);
  } else {
    canvas.classList.add('hidden');
    img.classList.remove('hidden');
    btn.innerHTML = '<i class="fa-solid fa-cube text-[#FF85A1]"></i> <span>3D Interactive Model</span>';
  }
}

function initModal3DCanvas(productId) {
  const canvas = document.getElementById('modal-3d-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const width = canvas.parentElement.clientWidth || 360;
  const height = canvas.parentElement.clientHeight || 360;

  modal3DScene = new THREE.Scene();

  modal3DCamera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
  modal3DCamera.position.set(0, 0, 5);

  modal3DRenderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  modal3DRenderer.setSize(width, height);

  const amb = new THREE.AmbientLight(0xffffff, 0.9);
  modal3DScene.add(amb);

  const light1 = new THREE.DirectionalLight(0xff85a1, 1.2);
  light1.position.set(3, 4, 3);
  modal3DScene.add(light1);

  const p = products.find(item => item.id === productId);
  const colorHex = p?.category === 'cat-flowers' ? 0xFF85A1 : (p?.category === 'cat-keychains' ? 0xC8B6FF : 0xA0C4FF);

  // 3D Flower / Knot Geometry
  const geom = new THREE.TorusKnotGeometry(0.9, 0.32, 100, 16);
  const mat = new THREE.MeshStandardMaterial({ color: colorHex, roughness: 0.5, metalness: 0.1 });
  modalMesh = new THREE.Mesh(geom, mat);
  modal3DScene.add(modalMesh);

  let isDragging = false;
  let previousMousePosition = { x: 0, y: 0 };

  canvas.addEventListener('mousedown', (e) => {
    isDragging = true;
    previousMousePosition = { x: e.clientX, y: e.clientY };
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging || !modalMesh) return;
    const deltaX = e.clientX - previousMousePosition.x;
    const deltaY = e.clientY - previousMousePosition.y;

    modalMesh.rotation.y += deltaX * 0.01;
    modalMesh.rotation.x += deltaY * 0.01;

    previousMousePosition = { x: e.clientX, y: e.clientY };
  });

  window.addEventListener('mouseup', () => { isDragging = false; });

  function renderModal3D() {
    if (!isModal3DActive) return;
    requestAnimationFrame(renderModal3D);
    if (!isDragging && modalMesh) {
      modalMesh.rotation.y += 0.005;
    }
    modal3DRenderer.render(modal3DScene, modal3DCamera);
  }

  renderModal3D();
}

/* ==========================================
   INTERACTIVE 3D CURSOR TRAIL ENGINE
   ========================================== */

let trailCanvas, trailCtx;
let trailParticles = [];

function init3DCursorTrail() {
  trailCanvas = document.getElementById('cursor-trail-canvas');
  if (!trailCanvas) return;
  trailCtx = trailCanvas.getContext('2d');

  function resizeTrail() {
    trailCanvas.width = window.innerWidth;
    trailCanvas.height = window.innerHeight;
  }
  resizeTrail();
  window.addEventListener('resize', resizeTrail);

  const colors = ['#FF85A1', '#FFC6FF', '#C8B6FF', '#A0C4FF', '#FDFFB6'];

  window.addEventListener('mousemove', (e) => {
    for (let i = 0; i < 2; i++) {
      trailParticles.push({
        x: e.clientX,
        y: e.clientY,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5 - 0.5,
        size: Math.random() * 6 + 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
        decay: Math.random() * 0.02 + 0.015,
        shape: Math.random() > 0.5 ? 'heart' : 'circle'
      });
    }
  });

  function renderTrail() {
    requestAnimationFrame(renderTrail);
    trailCtx.clearRect(0, 0, trailCanvas.width, trailCanvas.height);

    for (let i = trailParticles.length - 1; i >= 0; i--) {
      const p = trailParticles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= p.decay;
      p.size *= 0.96;

      if (p.alpha <= 0 || p.size <= 0.5) {
        trailParticles.splice(i, 1);
        continue;
      }

      trailCtx.save();
      trailCtx.globalAlpha = p.alpha;
      trailCtx.fillStyle = p.color;

      if (p.shape === 'heart') {
        trailCtx.beginPath();
        const d = p.size;
        trailCtx.moveTo(p.x, p.y);
        trailCtx.bezierCurveTo(p.x - d / 2, p.y - d / 2, p.x - d, p.y + d / 3, p.x, p.y + d);
        trailCtx.bezierCurveTo(p.x + d, p.y + d / 3, p.x + d / 2, p.y - d / 2, p.x, p.y);
        trailCtx.fill();
      } else {
        trailCtx.beginPath();
        trailCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        trailCtx.fill();
      }
      trailCtx.restore();
    }
  }

  renderTrail();
}

/* ==========================================
   3D CONFETTI / FLOWER PETAL EXPLOSION ENGINE
   ========================================== */

let confettiCanvas, confettiCtx;
let confettiParticles = [];

function trigger3DConfetti() {
  confettiCanvas = document.getElementById('confetti-canvas');
  if (!confettiCanvas) return;
  confettiCtx = confettiCanvas.getContext('2d');

  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;

  const colors = ['#FF85A1', '#FFC6FF', '#C8B6FF', '#A0C4FF', '#FDFFB6', '#B9FBC0'];
  const count = 120;
  const originX = window.innerWidth / 2;
  const originY = window.innerHeight / 3;

  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 12 + 4;
    confettiParticles.push({
      x: originX,
      y: originY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 6,
      rotX: Math.random() * Math.PI * 2,
      rotY: Math.random() * Math.PI * 2,
      rotSpeedX: (Math.random() - 0.5) * 0.2,
      rotSpeedY: (Math.random() - 0.5) * 0.2,
      size: Math.random() * 12 + 8,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: 1,
      gravity: 0.25,
      friction: 0.98
    });
  }

  function animateConfetti() {
    if (confettiParticles.length === 0) return;
    requestAnimationFrame(animateConfetti);
    confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

    for (let i = confettiParticles.length - 1; i >= 0; i--) {
      const p = confettiParticles[i];
      p.vx *= p.friction;
      p.vy += p.gravity;
      p.x += p.vx;
      p.y += p.vy;
      p.rotX += p.rotSpeedX;
      p.rotY += p.rotSpeedY;
      p.alpha -= 0.012;

      if (p.alpha <= 0 || p.y > confettiCanvas.height + 50) {
        confettiParticles.splice(i, 1);
        continue;
      }

      confettiCtx.save();
      confettiCtx.globalAlpha = p.alpha;
      confettiCtx.translate(p.x, p.y);
      confettiCtx.scale(Math.cos(p.rotX), Math.sin(p.rotY));
      confettiCtx.fillStyle = p.color;

      confettiCtx.beginPath();
      confettiCtx.ellipse(0, 0, p.size, p.size / 2, Math.PI / 4, 0, Math.PI * 2);
      confettiCtx.fill();
      confettiCtx.restore();
    }
  }

  animateConfetti();
}

/* ==========================================
   3D LIVE YARN COLOR VISUALIZER (CUSTOM ORDER)
   ========================================== */

let custom3DScene, custom3DCamera, custom3DRenderer, customMesh;

function initCustom3DVisualizer() {
  const canvas = document.getElementById('custom-3d-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  if (custom3DRenderer) return;

  const width = canvas.parentElement.clientWidth || 320;
  const height = canvas.parentElement.clientHeight || 220;

  custom3DScene = new THREE.Scene();

  custom3DCamera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
  custom3DCamera.position.set(0, 0, 4.5);

  custom3DRenderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  custom3DRenderer.setSize(width, height);

  const amb = new THREE.AmbientLight(0xffffff, 0.9);
  custom3DScene.add(amb);

  const dirLight = new THREE.DirectionalLight(0xff85a1, 1.2);
  dirLight.position.set(3, 4, 3);
  custom3DScene.add(dirLight);

  const geom = new THREE.TorusKnotGeometry(0.85, 0.3, 100, 16);
  const mat = new THREE.MeshStandardMaterial({ color: 0xFF85A1, roughness: 0.5, metalness: 0.1 });
  customMesh = new THREE.Mesh(geom, mat);
  custom3DScene.add(customMesh);

  function animate() {
    requestAnimationFrame(animate);
    if (customMesh) {
      customMesh.rotation.y += 0.008;
      customMesh.rotation.x += 0.004;
    }
    custom3DRenderer.render(custom3DScene, custom3DCamera);
  }
  animate();
}

function updateCustom3DColor(hexColor, name) {
  if (customMesh && customMesh.material) {
    customMesh.material.color.set(hexColor);
    trigger3DConfetti();
    showToast(`3D Yarn Preview updated to ${name}! ♡`);
  }
}

/* ==========================================
   HERO ROTATING CAROUSEL CONTROLLER
   ========================================== */
let currentHeroSlide = 0;
let heroCarouselInterval = null;

async function loadHeroSlides() {
  try {
    const data = await apiFetch('/api/carousel');
    if (Array.isArray(data) && data.length > 0) {
      heroSlides = data;
    }
  } catch (err) {
    console.warn('Could not load dynamic carousel slides, using defaults:', err.message);
  }
  renderHeroCarousel();
}

function renderHeroCarousel() {
  const track = document.getElementById('hero-carousel-slides');
  const dotsContainer = document.getElementById('hero-carousel-dots');
  if (!track || !heroSlides || heroSlides.length === 0) return;

  track.innerHTML = heroSlides.map((slide, index) => `
    <div class="hero-slide ${index === 0 ? 'active opacity-100 z-10' : 'opacity-0 pointer-events-none z-0'} absolute inset-0 transition-opacity duration-700 ease-in-out" data-index="${index}">
      <img src="${slide.image}" alt="${slide.title}" class="w-full h-full object-cover">
      <div class="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
      <div class="absolute bottom-6 left-4 right-4 sm:left-5 sm:right-5 bg-white/95 backdrop-blur-md p-3.5 sm:p-4 rounded-2xl shadow-xl border border-white/60 flex items-center gap-3">
        <div class="w-11 h-11 rounded-full bg-[#FFE5EC] flex items-center justify-center text-xl shrink-0">${slide.icon || '🌸'}</div>
        <div class="min-w-0">
          <div class="font-display font-bold text-sm text-[#3D2C3D] truncate">${slide.title}</div>
          <div class="text-xs text-[#FF85A1] font-bold truncate">${slide.subtitle}</div>
        </div>
      </div>
    </div>
  `).join('');

  if (dotsContainer) {
    dotsContainer.innerHTML = heroSlides.map((_, index) => `
      <button onclick="goToHeroSlide(${index})" aria-label="Go to slide ${index + 1}" class="${index === 0 ? 'w-3 bg-white' : 'w-2 bg-white/50'} h-2 rounded-full transition-all hero-dot"></button>
    `).join('');
  }

  currentHeroSlide = 0;
  initHeroCarousel();
}

function initHeroCarousel() {
  const slides = document.querySelectorAll('.hero-slide');
  if (!slides || slides.length === 0) return;

  const container = document.getElementById('hero-carousel-container');
  if (container && !container.dataset.carouselInit) {
    container.dataset.carouselInit = 'true';
    container.addEventListener('mouseenter', () => clearInterval(heroCarouselInterval));
    container.addEventListener('mouseleave', () => startHeroCarouselTimer());
    container.addEventListener('touchstart', () => clearInterval(heroCarouselInterval), { passive: true });
    container.addEventListener('touchend', () => startHeroCarouselTimer(), { passive: true });
  }

  goToHeroSlide(0);
  startHeroCarouselTimer();
}

function startHeroCarouselTimer() {
  clearInterval(heroCarouselInterval);
  heroCarouselInterval = setInterval(() => {
    nextHeroSlide();
  }, 4200);
}

function nextHeroSlide() {
  const slides = document.querySelectorAll('.hero-slide');
  if (!slides || slides.length === 0) return;
  goToHeroSlide((currentHeroSlide + 1) % slides.length);
}

function prevHeroSlide() {
  const slides = document.querySelectorAll('.hero-slide');
  if (!slides || slides.length === 0) return;
  goToHeroSlide((currentHeroSlide - 1 + slides.length) % slides.length);
}

function goToHeroSlide(index) {
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.hero-dot');
  if (!slides || slides.length === 0) return;

  currentHeroSlide = index;
  slides.forEach((slide, i) => {
    if (i === currentHeroSlide) {
      slide.classList.add('opacity-100', 'z-10');
      slide.classList.remove('opacity-0', 'pointer-events-none', 'z-0');
    } else {
      slide.classList.remove('opacity-100', 'z-10');
      slide.classList.add('opacity-0', 'pointer-events-none', 'z-0');
    }
  });

  if (dots && dots.length > 0) {
    dots.forEach((dot, i) => {
      if (i === currentHeroSlide) {
        dot.classList.add('bg-white', 'w-3');
        dot.classList.remove('bg-white/50', 'w-2');
      } else {
        dot.classList.remove('bg-white', 'w-3');
        dot.classList.add('bg-white/50', 'w-2');
      }
    });
  }
}
