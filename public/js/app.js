/**
 * Crochet by Prisha - Living 3D Miniature Storybook World & E-Commerce Engine
 * A Little World, Woven by Hand ♡
 */

// State Management
let currentUser = JSON.parse(localStorage.getItem('sp_user') || 'null');
let authToken = localStorage.getItem('sp_token') || null;
let cart = JSON.parse(localStorage.getItem('sp_cart') || '[]');
let wishlist = JSON.parse(localStorage.getItem('sp_wishlist') || '[]');

let currentDetailProduct = null;
let selectedModalColor = 'Standard';
let selectedGiftWrap = 'Without Gift Wrap';
let activeCustomParts = {};

let currentCategoryFilter = 'all';
let currentSearchQuery = '';
let currentSortMode = 'featured';

// Available Master Artisan Yarn Palette
const ARTISAN_YARN_PALETTE = [
  { name: 'Soft Rose Pink', hex: '#E89CAE', bg: '#FFDCE5' },
  { name: 'Lavender Dream', hex: '#B8A1D9', bg: '#F0E6FF' },
  { name: 'Butter Yellow', hex: '#F9E79F', bg: '#FFFAD1' },
  { name: 'Sage Meadow', hex: '#8A9A86', bg: '#E2ECE0' },
  { name: 'Snow Cotton White', hex: '#FAF9F6', bg: '#FFFFFF' },
  { name: 'Crimson Red', hex: '#C94A5B', bg: '#FDDDE2' },
  { name: 'Sky Breeze Blue', hex: '#97C1E8', bg: '#E4F1FD' },
  { name: 'Matcha Green', hex: '#9CAF88', bg: '#E8EFE3' },
  { name: 'Caramel Mocha', hex: '#A87D65', bg: '#F2E8E2' },
  { name: 'Midnight Charcoal', hex: '#3A323A', bg: '#ECE8EC' }
];

// Product Catalog Data with 3D Config & Specific Flower Gift Wrap rule
let products = [
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
    leadTime: "Handmade in 2–4 business days",
    dimensions: "Height: 32 cm • Bloom Width: 22 cm",
    care: "Spot clean gently with damp cloth, keep away from open flames, dry in shade.",
    yarnType: "100% Premium Milk Cotton Yarn",
    colors: ["Soft Pink & Lavender", "Pastel Yellow & White", "Peach & Sage Green", "Crimson Red & Cream", "Lilac & Sky Blue", "Pure Snow White"],
    description: "Our signature everlasting arrangement featuring hand-crocheted delicate tulips, rose buds, and eucalyptus leaves. Available as bare stems or wrapped in aesthetic frosted craft paper with satin ribbon.",
    images: ["https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=800&q=80"],
    has3DModel: true,
    modelType: "bouquet",
    customParts: {
      petals: { label: "Flower Petals", defaultColor: "#E89CAE" },
      center: { label: "Stamen / Buds", defaultColor: "#F9E79F" },
      leaves: { label: "Stem & Foliage", defaultColor: "#8A9A86" },
      wrap:   { label: "Paper Wrap / Ribbon", defaultColor: "#FAF9F6" }
    },
    customization: { allowGiftWrap: true, giftWrapPrice: 99, allowColorPicker: true, allowCustomText: true }
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
    leadTime: "Handmade in 2–3 business days",
    dimensions: "Height: 28 cm • Flower Diameter: 11 cm",
    care: "Dust with soft brush, reshape petals by hand, do not wring.",
    yarnType: "100% Combed Cotton Yarn",
    colors: ["Golden Sunshine", "Pastel Lemon Yellow", "Warm Autumn Amber", "Sunset Orange", "Honey Glow"],
    description: "A radiant handmade sunflower with textured chocolate-brown seed center and golden petals. Wired internal stem allows easy bending for any vase.",
    images: ["https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&w=800&q=80"],
    has3DModel: true,
    modelType: "sunflower",
    customParts: {
      petals: { label: "Ray Petals", defaultColor: "#F9E79F" },
      center: { label: "Seed Center Disc", defaultColor: "#5C3A21" },
      leaves: { label: "Wired Stem & Leaf", defaultColor: "#8A9A86" }
    },
    customization: { allowGiftWrap: true, giftWrapPrice: 49, allowColorPicker: true, allowCustomText: true }
  },
  {
    id: "prod-plush-1",
    name: "Aesthetic Bow Keychain",
    slug: "aesthetic-bow-keychain",
    category: "cat-keychains",
    price: 85,
    salePrice: null,
    costPrice: 34,
    isSale: false,
    isBestseller: true,
    isNew: true,
    rating: 5,
    reviewsCount: 36,
    stock: 24,
    leadTime: "Handmade in 1–2 business days",
    dimensions: "Length: 9 cm • Width: 7.5 cm",
    care: "Hand wash cold, reshape, air dry.",
    yarnType: "100% Natural Cotton Yarn",
    colors: ["Red", "Light Blue", "Pink", "Purple", "Black", "White", "Butter Yellow"],
    description: "Charming handcrafted bow keychain with delicate stitched ripples, silver-plated keyring, and pearl bead charm. Perfect for bags, keys, or AirPods.",
    images: ["https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80"],
    has3DModel: true,
    modelType: "bow",
    customParts: {
      petals: { label: "Bow Loops", defaultColor: "#E89CAE" },
      center: { label: "Center Knot & Tails", defaultColor: "#C94A5B" }
    },
    customization: { allowGiftWrap: false, allowColorPicker: true, allowCustomText: false }
  },
  {
    id: "prod-3",
    name: "Vintage Daisy Hair Scrunchie Set",
    slug: "vintage-daisy-hair-scrunchie-set",
    category: "cat-hair",
    price: 299,
    salePrice: null,
    isSale: false,
    isBestseller: true,
    isNew: false,
    rating: 4.9,
    reviewsCount: 28,
    stock: 18,
    leadTime: "Handmade in 2–3 business days",
    dimensions: "Outer Diameter: 11 cm • Elastic Stretch: Up to 18 cm",
    care: "Gentle hand rinse, dry flat.",
    yarnType: "100% Soft Milk Cotton",
    colors: ["Pastel Trio (Pink, Lavender, Sky Blue)", "Earthy Trio (Cream, Peach, Sage)", "Sunny Trio (Butter Yellow, White, Honey)", "Monochrome Trio (Black, Grey, White)"],
    description: "Set of 3 hand-stitched floral scrunchies with 3D daisy flower accents. Extremely soft on delicate hair, prevents tension headaches and hair breakage.",
    images: ["https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80"],
    has3DModel: true,
    modelType: "scrunchie",
    customParts: {
      petals: { label: "Daisy Petals", defaultColor: "#FAF9F6" },
      center: { label: "Flower Centers", defaultColor: "#F9E79F" },
      wrap:   { label: "Scrunchie Band", defaultColor: "#B8A1D9" }
    },
    customization: { allowGiftWrap: false, allowColorPicker: true, allowCustomText: false }
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
    stock: 8,
    leadTime: "Handmade in 3–5 business days",
    dimensions: "Box: 24 x 18 x 10 cm • Curated Aesthetic Hamper",
    care: "Keep in dry ambient environment. Everlasting keepsake.",
    yarnType: "100% Natural Combed Cotton",
    colors: ["Blush Pink Edition", "Lavender Dream Edition", "Sage & Cream Edition", "Sunset Coral Edition", "Midnight Rose Edition"],
    description: "The ultimate handcrafted gift box! Includes 1 Tulip & Rose Bouquet, 1 Mini Bunny Keychain, 1 Daisy Scrunchie, and personalized handwritten wax-sealed card inside an aesthetic keepsake box.",
    images: ["https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=800&q=80"],
    has3DModel: true,
    modelType: "hamper",
    customParts: {
      wrap:   { label: "Hamper Box & Ribbon", defaultColor: "#E89CAE" },
      petals: { label: "Bouquet Blooms", defaultColor: "#FAF9F6" },
      center: { label: "Bunny Charm", defaultColor: "#B8A1D9" }
    },
    customization: { allowGiftWrap: false, allowColorPicker: true, allowCustomText: true }
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
    stock: 22,
    leadTime: "Handmade in 2–3 business days",
    dimensions: "Bunny Height: 7 cm • Width: 4 cm",
    care: "Surface wash with damp cloth.",
    yarnType: "100% Natural Milk Cotton",
    colors: ["Baby Pink", "Lavender Purple", "Sky Blue", "Matcha Green", "Buttercream Yellow", "Caramel Brown", "Classic White"],
    description: "Pocket-sized crochet cuteness! Set of 3 adorable mini bunny keychains with pearl beads, silver keyrings, and stitched heart charms.",
    images: ["https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80"],
    has3DModel: true,
    modelType: "bunny",
    customParts: {
      petals: { label: "Bunny Body", defaultColor: "#FAF9F6" },
      center: { label: "Inner Ears & Blush", defaultColor: "#E89CAE" },
      wrap:   { label: "Heart Charm", defaultColor: "#C94A5B" }
    },
    customization: { allowGiftWrap: false, allowColorPicker: true, allowCustomText: true }
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
    stock: 19,
    leadTime: "Handmade in 1–2 business days",
    dimensions: "Clip Length: 6 cm • Flower: 3.5 cm",
    care: "Wipe with soft dry cloth.",
    yarnType: "100% Natural Combed Cotton",
    colors: ["Pink & Sky Blue", "Lavender & Peach", "Daisy White & Butter Yellow", "Strawberry Red & Cream", "Matcha & Mint"],
    description: "Hand-stitched mini flower clips with sturdy alligator clip backings that stay securely in hair without slipping or pulling.",
    images: ["https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80"],
    has3DModel: false,
    customization: { allowGiftWrap: false, allowColorPicker: true, allowCustomText: false }
  }
];

// Helper: Flower Gift Wrap Restriction
function isFlowerProduct(p) {
  if (!p) return false;
  if (p.category && p.category !== 'cat-flowers') return false;
  if (p.customization && p.customization.allowGiftWrap === false) return false;
  return p.category === 'cat-flowers' || /(flower|bouquet|tulip|rose|sunflower)/i.test(p.name);
}

/* ===================================================
   1. PROCEDURAL REALISTIC YARN & CROCHET TEXTURE GENERATOR
   =================================================== */
let cachedYarnBumpTexture = null;
let cachedRoofRibTexture = null;
let cachedSilkRibbonTexture = null;

// High-Definition Interlocking Purl & Knit Stitch Texture (512x512)
function getCrochetYarnBumpTexture() {
  if (cachedYarnBumpTexture) return cachedYarnBumpTexture;
  if (typeof THREE === 'undefined') return null;

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  // Base neutral grey
  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, 512, 512);

  const rowHeight = 24;
  const colWidth = 24;

  for (let y = 0; y < 512; y += rowHeight) {
    const isOdd = (y / rowHeight) % 2 === 1;
    const xOffset = isOdd ? colWidth / 2 : 0;

    for (let x = -colWidth; x < 512 + colWidth; x += colWidth) {
      const cx = x + xOffset;
      const cy = y;

      // Outer highlight loop
      ctx.beginPath();
      ctx.arc(cx, cy, 10, 0, Math.PI, false);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.55)';
      ctx.lineWidth = 5;
      ctx.stroke();

      // Inner shadow recess loop
      ctx.beginPath();
      ctx.arc(cx, cy + 6, 10, Math.PI, 0, false);
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.45)';
      ctx.lineWidth = 5;
      ctx.stroke();

      // Plied yarn twisted cord lines
      ctx.beginPath();
      ctx.moveTo(cx - 7, cy - 2);
      ctx.lineTo(cx + 7, cy + 4);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Micro fibrous wool grain
      ctx.fillStyle = 'rgba(0, 0, 0, 0.06)';
      ctx.fillRect(cx - 3, cy - 3, 6, 6);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(10, 10);
  cachedYarnBumpTexture = texture;
  return texture;
}

// Scalloped Ribbed Cable Shingle Texture for Cottage Roof
function getRoofRibBumpTexture() {
  if (cachedRoofRibTexture) return cachedRoofRibTexture;
  if (typeof THREE === 'undefined') return null;

  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, 256, 256);

  // Vertical knit ribs with horizontal scallop overlap
  for (let x = 0; x < 256; x += 16) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.fillRect(x + 2, 0, 6, 256);

    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.fillRect(x + 8, 0, 8, 256);
  }

  for (let y = 0; y < 256; y += 32) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.fillRect(0, y, 256, 4);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.fillRect(0, y + 4, 256, 3);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  cachedRoofRibTexture = texture;
  return texture;
}

function createCrochetMaterial(colorHex, roughness = 0.88, metalness = 0.03, bumpScale = 0.04, customBump = null) {
  const bump = customBump || getCrochetYarnBumpTexture();
  return new THREE.MeshStandardMaterial({
    color: colorHex,
    roughness: roughness,
    metalness: metalness,
    bumpMap: bump,
    bumpScale: bumpScale
  });
}

/* ===================================================
   2. THREE.JS LIVING CROCHET WORLD ENGINE (REALISTIC MINIATURE DIORAMA)
   =================================================== */
let worldScene, worldCamera, worldRenderer;
let worldFlowers = [];
let worldButterflies = [];
let worldBirds = [];
let worldRiverRipples = [];
let worldRiverCurve = null;
let worldRowBoat = null;
let worldBoatU = 0.12;
let worldRiverFoam = [];
let worldChimneySmoke = [];
let worldBreezePollen = null;
let worldClouds = [];
let worldPineTrees = [];
let worldGreatTreeCanopy = [];
let worldTeddyBear = null;
let riverTexture = null;
let isWorldActive = false;
let isMotionPaused = false;
let isDioramaDragging = false;
let dragStartX = 0, dragStartY = 0;
let orbitAngleX = 0, targetOrbitAngleX = 0;
let orbitAngleY = 0.32, targetOrbitAngleY = 0.32;
let orbitDistance = 14.2;
let lookAtTarget = new THREE.Vector3(0.6, 1.25, 0);
let riverRibbonMesh = null;
let scrollProgress = 0, targetScrollProgress = 0;

// High-definition flowing river silky wave texture
function getRiverFlowTexture() {
  if (typeof THREE === 'undefined') return null;
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#68968B';
  ctx.fillRect(0, 0, 512, 512);

  for (let y = 0; y < 512; y += 14) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    for (let x = 0; x <= 512; x += 16) {
      const wave = Math.sin((x / 512) * Math.PI * 4 + (y * 0.12)) * 6;
      ctx.lineTo(x, y + wave);
    }
    ctx.strokeStyle = y % 28 === 0 ? 'rgba(255, 255, 255, 0.32)' : 'rgba(75, 115, 105, 0.4)';
    ctx.lineWidth = 3.5;
    ctx.stroke();
  }

  for (let i = 0; i < 45; i++) {
    const rx = Math.random() * 512;
    const ry = Math.random() * 512;
    ctx.beginPath();
    ctx.ellipse(rx, ry, 7, 2.5, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1, 8);
  return texture;
}

// Handcrafted wooden rowboat with warm glowing brass lantern
function buildRowBoat() {
  const boatGroup = new THREE.Group();
  const woodMat = createCrochetMaterial(0x9E7D62, 0.82, 0.05);
  const darkWoodMat = createCrochetMaterial(0x6A4E3B, 0.88);
  const brassMat = new THREE.MeshStandardMaterial({ color: 0xE2BA68, metalness: 0.8, roughness: 0.3 });

  // 1. Keel & Hull
  const keelGeo = new THREE.CylinderGeometry(0.38, 0.22, 1.9, 12);
  keelGeo.scale(1.0, 0.45, 0.75);
  keelGeo.rotateZ(Math.PI / 2);
  const keelMesh = new THREE.Mesh(keelGeo, woodMat);
  keelMesh.castShadow = true;
  boatGroup.add(keelMesh);

  // 2. Gunwales (Rim)
  const rimGeo = new THREE.TorusGeometry(0.9, 0.07, 8, 24);
  rimGeo.scale(0.38, 1.0, 0.2);
  rimGeo.rotateX(Math.PI / 2);
  rimGeo.rotateZ(Math.PI / 2);
  const rimMesh = new THREE.Mesh(rimGeo, darkWoodMat);
  rimMesh.position.y = 0.16;
  boatGroup.add(rimMesh);

  // 3. Wooden Thwart Bench
  const seatGeo = new THREE.BoxGeometry(0.58, 0.04, 0.22);
  const seatMesh = new THREE.Mesh(seatGeo, darkWoodMat);
  seatMesh.position.set(0, 0.08, 0);
  boatGroup.add(seatMesh);

  // 4. Two Miniature Wooden Oars
  [-1, 1].forEach(side => {
    const oarGroup = new THREE.Group();
    oarGroup.position.set(side * 0.32, 0.15, -0.05);
    oarGroup.rotation.z = side * 0.42;
    oarGroup.rotation.y = side * 0.25;

    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 1.05, 8), darkWoodMat);
    shaft.position.y = -0.25;
    oarGroup.add(shaft);

    const blade = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.3, 0.02), woodMat);
    blade.position.y = -0.68;
    oarGroup.add(blade);

    boatGroup.add(oarGroup);
  });

  // 5. Cozy Yarn Ball & Knitting Needles Inside
  const yarnBall = new THREE.Mesh(new THREE.SphereGeometry(0.12, 12, 12), createCrochetMaterial(0xE89CAE, 0.85));
  yarnBall.position.set(0.08, 0.14, -0.38);
  boatGroup.add(yarnBall);

  [-0.04, 0.04].forEach((no, idx) => {
    const needle = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.35, 6), brassMat);
    needle.position.set(0.08 + no, 0.22, -0.38);
    needle.rotation.z = (idx === 0 ? 0.35 : -0.35);
    boatGroup.add(needle);
  });

  // Folded Throw Blanket
  const blanket = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.08, 0.24), createCrochetMaterial(0xF5F0E6, 0.9));
  blanket.position.set(0, 0.11, 0.48);
  boatGroup.add(blanket);

  // 6. Glowing Brass Lantern at Bow
  const lanternGroup = new THREE.Group();
  lanternGroup.position.set(0, 0.26, 0.82);

  const lanternPost = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.18, 6), brassMat);
  lanternGroup.add(lanternPost);

  const lanternCage = new THREE.Mesh(
    new THREE.CylinderGeometry(0.055, 0.065, 0.14, 8),
    new THREE.MeshStandardMaterial({
      color: 0xFFE082,
      emissive: 0xFFA000,
      emissiveIntensity: 1.6,
      transparent: true,
      opacity: 0.92
    })
  );
  lanternCage.position.y = 0.12;
  lanternGroup.add(lanternCage);

  const lanternLight = new THREE.PointLight(0xFFB74D, 1.2, 3.8, 1.5);
  lanternLight.position.y = 0.12;
  lanternGroup.add(lanternLight);

  boatGroup.add(lanternGroup);
  boatGroup.scale.set(0.85, 0.85, 0.85);
  return boatGroup;
}

// Toggle Pause/Resume 3D Motion
window.togglePauseWorldMotion = function () {
  isMotionPaused = !isMotionPaused;
  const icon = document.getElementById('pause-motion-icon');
  const text = document.getElementById('pause-motion-text');
  if (isMotionPaused) {
    if (icon) icon.className = 'fa-solid fa-play text-[11px]';
    if (text) text.textContent = 'Play motion';
  } else {
    if (icon) icon.className = 'fa-solid fa-pause text-[11px]';
    if (text) text.textContent = 'Pause motion';
  }
};

function init3DCrochetWorld() {
  const canvas = document.getElementById('crochet-world-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const container = document.getElementById('hero-stage') || canvas.parentElement || document.body;
  const width = container.clientWidth || window.innerWidth;
  const height = container.clientHeight || window.innerHeight;

  worldScene = new THREE.Scene();
  worldScene.background = new THREE.Color(0xE4ECE0);
  worldScene.fog = new THREE.FogExp2(0xE4ECE0, 0.015);

  worldCamera = new THREE.PerspectiveCamera(40, width / height, 0.1, 140);
  worldCamera.position.set(0, 4.3, 13.8);
  worldCamera.lookAt(lookAtTarget);

  worldRenderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: false,
    powerPreference: 'high-performance'
  });
  worldRenderer.setSize(width, height);
  worldRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  worldRenderer.shadowMap.enabled = true;
  worldRenderer.shadowMap.type = THREE.PCFSoftShadowMap;

  // 1. Warm Golden Sunlight & Ambient Radiance
  const ambientLight = new THREE.AmbientLight(0xFFF9F0, 0.95);
  worldScene.add(ambientLight);

  const hemiLight = new THREE.HemisphereLight(0xFFF8ED, 0x8DA088, 0.75);
  worldScene.add(hemiLight);

  const sunLight = new THREE.DirectionalLight(0xFFF3D8, 1.6);
  sunLight.position.set(16, 24, 14);
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.width = 2048;
  sunLight.shadow.mapSize.height = 2048;
  sunLight.shadow.camera.near = 0.5;
  sunLight.shadow.camera.far = 60;
  sunLight.shadow.camera.left = -18;
  sunLight.shadow.camera.right = 18;
  sunLight.shadow.camera.top = 18;
  sunLight.shadow.camera.bottom = -18;
  sunLight.shadow.bias = -0.0003;
  sunLight.shadow.radius = 2.8;
  worldScene.add(sunLight);

  const fillLight = new THREE.DirectionalLight(0xC6D8C2, 0.6);
  fillLight.position.set(-15, 10, -6);
  worldScene.add(fillLight);

  // Warm Amber Point Light Inside Cottage Porch
  const cottageGlowLight = new THREE.PointLight(0xFFB74D, 1.7, 8, 1.4);
  cottageGlowLight.position.set(5.1, 1.6, 2.1);
  worldScene.add(cottageGlowLight);

  // Build the complete realistic handcrafted diorama
  buildMiniatureDioramaWorld();

  // Setup Event Listeners
  setupWorldEventListeners();

  isWorldActive = true;
  animateCrochetWorld();
}

function buildMiniatureDioramaWorld() {
  const bump = getCrochetYarnBumpTexture();
  const roofBump = getRoofRibBumpTexture();

  // 1. Distant Glowing Sun Disc in Pale Sky (Top Right)
  const sunGroup = new THREE.Group();
  sunGroup.position.set(10.5, 15.5, -16);

  const sunGeo = new THREE.SphereGeometry(1.65, 24, 24);
  const sunMat = new THREE.MeshBasicMaterial({ color: 0xFFF1CE });
  const sunMesh = new THREE.Mesh(sunGeo, sunMat);
  sunGroup.add(sunMesh);

  // Subtle sun aura halo
  const haloGeo = new THREE.RingGeometry(1.8, 3.2, 32);
  const haloMat = new THREE.MeshBasicMaterial({
    color: 0xFFF6DB,
    transparent: true,
    opacity: 0.28,
    side: THREE.DoubleSide
  });
  const haloMesh = new THREE.Mesh(haloGeo, haloMat);
  haloMesh.lookAt(worldCamera.position);
  sunGroup.add(haloMesh);
  worldScene.add(sunGroup);

  // 2. Distant Soft Mountain Ridges (Layered Atmospheric Depth)
  const mtnColors = [0xCAD5C5, 0xB8C5B3, 0xD6DFD2, 0xC0CDBB];
  const mtnCoords = [
    { x: -16, y: 3.8, z: -27, r: 9.0, h: 10.5 },
    { x: -6,  y: 3.2, z: -29, r: 10.0, h: 9.5 },
    { x: 5,   y: 4.2, z: -28, r: 9.2, h: 11.0 },
    { x: 15,  y: 3.5, z: -26, r: 8.5, h: 9.0 }
  ];
  mtnCoords.forEach((m, idx) => {
    const mtnGeo = new THREE.ConeGeometry(m.r, m.h, 24);
    const mtnMat = new THREE.MeshStandardMaterial({
      color: mtnColors[idx % mtnColors.length],
      roughness: 0.95,
      bumpMap: bump,
      bumpScale: 0.02
    });
    const mtnMesh = new THREE.Mesh(mtnGeo, mtnMat);
    mtnMesh.position.set(m.x, m.y, m.z);
    worldScene.add(mtnMesh);
  });

  // 3. Rolling Sage-Green Yarn Landscape with Natural River Valley
  const groundGeom = new THREE.PlaneGeometry(68, 56, 52, 52);
  groundGeom.rotateX(-Math.PI / 2);

  const pos = groundGeom.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const z = pos.getZ(i);

    // Natural diagonal curve of riverbed
    const riverCenter = -0.34 * z + 0.4;
    const riverDist = Math.abs(x - riverCenter);

    let y = Math.sin(x * 0.12) * 0.38 + Math.cos(z * 0.1) * 0.32;

    // Valley dip along river path
    if (riverDist < 3.4) {
      y -= (1 - riverDist / 3.4) * 0.88;
    }
    // Cottage knoll on the right
    const cottageDist = Math.hypot(x - 5.0, z - 0.2);
    if (cottageDist < 5.8) {
      y += (1 - cottageDist / 5.8) * 0.48;
    }
    // Tree & bench hill on the left
    const treeDist = Math.hypot(x + 6.2, z - 2.5);
    if (treeDist < 5.5) {
      y += (1 - treeDist / 5.5) * 0.42;
    }

    pos.setY(i, y - 0.22);
  }
  groundGeom.computeVertexNormals();

  const groundMat = createCrochetMaterial(0x8B9E87, 0.92, 0.03, 0.038);
  const groundMesh = new THREE.Mesh(groundGeom, groundMat);
  groundMesh.position.set(0, 0, 0);
  groundMesh.receiveShadow = true;
  worldScene.add(groundMesh);

  // 4. Winding Turquoise Ribbon River of Silk Yarn
  const riverCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(7.2, -0.32, -19),
    new THREE.Vector3(4.6, -0.36, -12),
    new THREE.Vector3(1.9, -0.42, -5),
    new THREE.Vector3(-0.3, -0.46, 1),
    new THREE.Vector3(-2.8, -0.42, 7),
    new THREE.Vector3(-6.2, -0.35, 15)
  ]);
  worldRiverCurve = riverCurve;

  riverTexture = getRiverFlowTexture();
  const riverGeom = new THREE.TubeGeometry(riverCurve, 72, 1.35, 8, false);
  const riverMat = new THREE.MeshStandardMaterial({
    color: 0x6E9C92,
    roughness: 0.45,
    metalness: 0.16,
    map: riverTexture,
    bumpMap: bump,
    bumpScale: 0.045
  });
  riverRibbonMesh = new THREE.Mesh(riverGeom, riverMat);
  riverRibbonMesh.scale.set(1, 0.16, 1);
  riverRibbonMesh.receiveShadow = true;
  worldScene.add(riverRibbonMesh);

  // Floating foam flecks & blossom petals drifting down river
  worldRiverFoam = [];
  const foamColors = [0xF8F9FA, 0xE89CAE, 0xFFFAF0, 0xF9E79F, 0xD4E6F1];
  for (let i = 0; i < 22; i++) {
    const isPetal = i % 2 === 0;
    const fGeo = isPetal ? new THREE.SphereGeometry(0.09, 8, 8) : new THREE.TorusGeometry(0.12, 0.035, 6, 12);
    if (isPetal) fGeo.scale(1.4, 0.25, 0.8);
    else fGeo.rotateX(Math.PI / 2);

    const fMat = new THREE.MeshStandardMaterial({
      color: foamColors[i % foamColors.length],
      roughness: 0.7,
      transparent: true,
      opacity: 0.85
    });
    const fMesh = new THREE.Mesh(fGeo, fMat);
    fMesh.userData = {
      u: (i / 22) + Math.random() * 0.03,
      lateralOffset: (Math.random() - 0.5) * 0.9,
      speed: 0.035 + Math.random() * 0.02,
      spinSpeed: (Math.random() - 0.5) * 1.5,
      wobbleOffset: Math.random() * Math.PI * 2
    };
    worldScene.add(fMesh);
    worldRiverFoam.push(fMesh);
  }

  // Moving Rowboat along river
  worldRowBoat = buildRowBoat();
  worldScene.add(worldRowBoat);

  // Raised Yarn Piping Cord on River Edges
  [-1.4, 1.4].forEach(offsetSide => {
    const edgeCurve = new THREE.CatmullRomCurve3(
      riverCurve.getSpacedPoints(40).map(p => new THREE.Vector3(p.x + offsetSide * 0.9, p.y + 0.05, p.z))
    );
    const edgeGeo = new THREE.TubeGeometry(edgeCurve, 48, 0.08, 6, false);
    const edgeMat = createCrochetMaterial(0x89B7AE, 0.75, 0.05, 0.03);
    const edgeMesh = new THREE.Mesh(edgeGeo, edgeMat);
    worldScene.add(edgeMesh);
  });

  // Smooth Handcrafted Riverbank Felt Pebbles
  const pebbleColors = [0xC7BEB2, 0xB5ABA0, 0x9E9387, 0xD4CBC0, 0xAA9F93];
  const pebblePoints = riverCurve.getSpacedPoints(34);

  pebblePoints.forEach((pt, idx) => {
    [-1.6, 1.6].forEach(side => {
      const pRadius = 0.22 + (idx % 5) * 0.06;
      const pGeo = new THREE.SphereGeometry(pRadius, 12, 10);
      pGeo.scale(1.25, 0.55, 1.0);
      const pMat = createCrochetMaterial(pebbleColors[(idx + (side > 0 ? 1 : 0)) % pebbleColors.length], 0.85);
      const pMesh = new THREE.Mesh(pGeo, pMat);

      const offsetDist = side + (Math.sin(idx * 1.4) * 0.4);
      pMesh.position.set(pt.x + offsetDist, pt.y + 0.1, pt.z + (Math.cos(idx * 1.2) * 0.25));
      pMesh.rotation.set(Math.random() * 0.4, Math.random() * Math.PI, Math.random() * 0.4);
      pMesh.castShadow = true;
      pMesh.receiveShadow = true;
      worldScene.add(pMesh);
    });
  });

  // 5. Knitted Arched Bridge with Alternating Cream & Sage Balustrades
  const bridgeGroup = new THREE.Group();
  bridgeGroup.position.set(0.15, -0.16, 1.0);

  // Arched deck with stitched wooden plank feel
  const archCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-2.3, 0, 0),
    new THREE.Vector3(-1.1, 0.82, 0),
    new THREE.Vector3(0, 1.05, 0),
    new THREE.Vector3(1.1, 0.82, 0),
    new THREE.Vector3(2.3, 0, 0)
  ]);
  const deckGeom = new THREE.TubeGeometry(archCurve, 36, 0.72, 8, false);
  deckGeom.scale(1, 0.2, 1.65);
  const deckMat = createCrochetMaterial(0xEDE6DC, 0.88);
  const deckMesh = new THREE.Mesh(deckGeom, deckMat);
  deckMesh.castShadow = true;
  deckMesh.receiveShadow = true;
  bridgeGroup.add(deckMesh);

  // Plush Knitted Striped Balustrades
  [-1.02, 1.02].forEach(zOffset => {
    // Upper handrail cord
    const railCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-2.3, 0.5, zOffset),
      new THREE.Vector3(-1.1, 1.35, zOffset),
      new THREE.Vector3(0, 1.58, zOffset),
      new THREE.Vector3(1.1, 1.35, zOffset),
      new THREE.Vector3(2.3, 0.5, zOffset)
    ]);
    const railGeom = new THREE.TubeGeometry(railCurve, 36, 0.09, 8, false);
    const railMat = createCrochetMaterial(0x829A7F, 0.85);
    const railMesh = new THREE.Mesh(railGeom, railMat);
    railMesh.castShadow = true;
    bridgeGroup.add(railMesh);

    // 14 Vertical Spindles Alternating Cream and Sage
    const spindleCount = 14;
    for (let s = 0; s < spindleCount; s++) {
      const u = s / (spindleCount - 1);
      const pt = railCurve.getPoint(u);
      const isCream = s % 2 === 0;
      const spinGeo = new THREE.CylinderGeometry(0.065, 0.065, 0.72, 8);
      const spinMat = createCrochetMaterial(isCream ? 0xF7F4EE : 0x829A7F, 0.85);
      const spinMesh = new THREE.Mesh(spinGeo, spinMat);
      spinMesh.position.set(pt.x, pt.y - 0.36, zOffset);
      spinMesh.castShadow = true;
      bridgeGroup.add(spinMesh);
    }
  });
  worldScene.add(bridgeGroup);

  // 6. The Handcrafted White Cottage (Right Side with Plush Scalloped Shingle Roof)
  const cottageGroup = new THREE.Group();
  cottageGroup.position.set(5.1, 0.28, 0.4);
  cottageGroup.rotation.y = -0.34;

  // Stucco walls with soft fleece plaster
  const wallGeo = new THREE.BoxGeometry(3.4, 2.75, 3.4);
  const wallMat = createCrochetMaterial(0xF5F2EB, 0.94);
  const wallMesh = new THREE.Mesh(wallGeo, wallMat);
  wallMesh.position.y = 1.38;
  wallMesh.castShadow = true;
  wallMesh.receiveShadow = true;
  cottageGroup.add(wallMesh);

  // Gable Scalloped Green Shingle Roof
  const roofGroup = new THREE.Group();
  roofGroup.position.y = 2.75;

  const roofMat = createCrochetMaterial(0x5F7A5E, 0.86, 0.02, 0.05, roofBump);

  // Main Left & Right Roof Slabs
  [-1, 1].forEach(side => {
    const slabGeo = new THREE.BoxGeometry(2.7, 0.24, 3.9);
    const slab = new THREE.Mesh(slabGeo, roofMat);
    slab.position.set(side * 1.05, 0.78, 0);
    slab.rotation.z = side * -Math.PI / 4.1;
    slab.castShadow = true;
    roofGroup.add(slab);

    // Thick Scalloped Shingle Rows for Tactile Crochet Shingle Feel
    const rowCount = 5;
    for (let r = 0; r < rowCount; r++) {
      const u = r / (rowCount - 1);
      const rowY = 0.2 + u * 1.1;
      const rowX = side * (1.8 - u * 1.4);

      const shingleTorus = new THREE.TorusGeometry(0.22, 0.08, 8, 12, Math.PI);
      shingleTorus.rotateX(Math.PI / 2);
      const shingleMesh = new THREE.Mesh(shingleTorus, roofMat);
      shingleMesh.position.set(rowX, rowY, 1.95);
      roofGroup.add(shingleMesh);
    }
  });

  // Front Gable White Scalloped Trim
  const gableCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-1.9, 0.1, 1.96),
    new THREE.Vector3(0, 1.75, 1.96),
    new THREE.Vector3(1.9, 0.1, 1.96)
  ]);
  const gableGeo = new THREE.TubeGeometry(gableCurve, 24, 0.08, 6, false);
  const gableMat = createCrochetMaterial(0xF7F4EE, 0.9);
  const gableMesh = new THREE.Mesh(gableGeo, gableMat);
  roofGroup.add(gableMesh);

  // Stone Chimney with Terracotta Flue Pot
  const chimGeo = new THREE.BoxGeometry(0.58, 1.5, 0.58);
  const chimMat = createCrochetMaterial(0x8D7E73, 0.92);
  const chimMesh = new THREE.Mesh(chimGeo, chimMat);
  chimMesh.position.set(-0.95, 1.15, -0.6);
  chimMesh.castShadow = true;
  roofGroup.add(chimMesh);

  const flueGeo = new THREE.CylinderGeometry(0.18, 0.2, 0.35, 12);
  const flueMat = createCrochetMaterial(0xAF5F45, 0.88);
  const flueMesh = new THREE.Mesh(flueGeo, flueMat);
  flueMesh.position.set(-0.95, 1.95, -0.6);
  roofGroup.add(flueMesh);

  cottageGroup.add(roofGroup);

  // Upstairs Glowing Dormer Window on Roof
  const dormerGroup = new THREE.Group();
  dormerGroup.position.set(0, 3.15, 1.68);

  const dormerFrame = new THREE.Mesh(
    new THREE.BoxGeometry(0.9, 0.8, 0.3),
    createCrochetMaterial(0x5A4232, 0.9)
  );
  dormerGroup.add(dormerFrame);

  const dormerGlass = new THREE.Mesh(
    new THREE.PlaneGeometry(0.72, 0.62),
    new THREE.MeshStandardMaterial({
      color: 0xFFE599,
      emissive: 0xFFD269,
      emissiveIntensity: 1.4
    })
  );
  dormerGlass.position.z = 0.16;
  dormerGroup.add(dormerGlass);
  cottageGroup.add(dormerGroup);

  // Downstairs Glowing 6-Pane Window with Flower Box
  const winGroup = new THREE.Group();
  winGroup.position.set(-0.85, 1.45, 1.72);

  const winGlass = new THREE.Mesh(
    new THREE.PlaneGeometry(0.9, 1.05),
    new THREE.MeshStandardMaterial({
      color: 0xFFE599,
      emissive: 0xFFD269,
      emissiveIntensity: 1.3
    })
  );
  winGroup.add(winGlass);

  // Wood Window Frame & Mullions
  const winFrame = new THREE.Mesh(
    new THREE.BoxGeometry(1.05, 1.2, 0.08),
    createCrochetMaterial(0x5A4232, 0.9)
  );
  winFrame.position.z = -0.02;
  winGroup.add(winFrame);

  // Flower Window Box with Tiny Blooms
  const fBoxGeo = new THREE.BoxGeometry(1.0, 0.2, 0.24);
  const fBoxMat = createCrochetMaterial(0x644E3D, 0.9);
  const fBox = new THREE.Mesh(fBoxGeo, fBoxMat);
  fBox.position.set(0, -0.62, 0.12);
  winGroup.add(fBox);

  // Florets in window box
  for (let fl = 0; fl < 5; fl++) {
    const flColor = fl % 2 === 0 ? 0xE89CAE : 0xF9E79F;
    const flMesh = new THREE.Mesh(new THREE.SphereGeometry(0.065, 8, 8), createCrochetMaterial(flColor, 0.8));
    flMesh.position.set(-0.35 + fl * 0.18, -0.5, 0.14);
    winGroup.add(flMesh);
  }
  cottageGroup.add(winGroup);

  // Arched Dark Wooden Door with Brass Knob
  const doorGroup = new THREE.Group();
  doorGroup.position.set(0.68, 0.72, 1.72);

  const doorWood = new THREE.Mesh(
    new THREE.BoxGeometry(0.95, 1.45, 0.08),
    createCrochetMaterial(0x563E2E, 0.9)
  );
  doorGroup.add(doorWood);

  // Brass knob
  const knob = new THREE.Mesh(
    new THREE.SphereGeometry(0.045, 8, 8),
    new THREE.MeshStandardMaterial({ color: 0xF9E79F, roughness: 0.3, metalness: 0.8 })
  );
  knob.position.set(0.32, 0, 0.06);
  doorGroup.add(knob);
  cottageGroup.add(doorGroup);

  // Pink Crochet Rose Garland Arch Framing Doorway (Exact match to screenshot)
  const garlandCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.08, 0.1, 1.76),
    new THREE.Vector3(0.1, 1.4, 1.76),
    new THREE.Vector3(0.68, 1.74, 1.76),
    new THREE.Vector3(1.26, 1.4, 1.76),
    new THREE.Vector3(1.28, 0.1, 1.76)
  ]);
  const garlandPoints = garlandCurve.getSpacedPoints(18);
  const roseColors = [0xF7D2DC, 0xE89CAE, 0xD47A8F];

  garlandPoints.forEach((gp, idx) => {
    const isRose = idx % 2 === 0;
    const gGeo = new THREE.SphereGeometry(isRose ? 0.095 : 0.06, 8, 8);
    const gMat = createCrochetMaterial(isRose ? roseColors[idx % roseColors.length] : 0x72926E, 0.82);
    const gMesh = new THREE.Mesh(gGeo, gMat);
    gMesh.position.copy(gp);
    cottageGroup.add(gMesh);
  });

  worldScene.add(cottageGroup);

  // Cottage Flagstone Steps Path
  for (let s = 0; s < 6; s++) {
    const stepGeo = new THREE.CylinderGeometry(0.38 - s * 0.02, 0.42 - s * 0.02, 0.08, 14);
    const stepMat = createCrochetMaterial(0xCCC2B6, 0.88);
    const step = new THREE.Mesh(stepGeo, stepMat);
    step.position.set(4.5 - s * 0.62, 0.1, 2.0 + s * 0.42);
    step.receiveShadow = true;
    worldScene.add(step);
  }

  // 7. Tiered Amigurumi Sage Cone Pine Trees (Plush Concentric Rings)
  const pineCoords = [
    { x: 8.4, z: -0.8, scale: 1.15 },
    { x: 7.6, z: -4.5, scale: 1.0 },
    { x: 3.8, z: -8.8, scale: 1.2 },
    { x: 1.4, z: -12.5, scale: 1.1 },
    { x: -2.8, z: -10.5, scale: 1.15 },
    { x: 9.6, z: 3.4, scale: 0.95 },
    { x: 6.9, z: 4.8, scale: 0.85 }
  ];

  pineCoords.forEach(pc => {
    const treeGroup = new THREE.Group();
    treeGroup.position.set(pc.x, 0, pc.z);
    treeGroup.scale.set(pc.scale, pc.scale, pc.scale);

    // Brown trunk
    const trunkGeo = new THREE.CylinderGeometry(0.18, 0.24, 1.2, 10);
    const trunkMat = createCrochetMaterial(0x5B4638, 0.92);
    const trunkMesh = new THREE.Mesh(trunkGeo, trunkMat);
    trunkMesh.position.y = 0.6;
    trunkMesh.castShadow = true;
    treeGroup.add(trunkMesh);

    // 5 Stacked Concentric Ribbed Torus Tiers
    const tierCount = 5;
    for (let t = 0; t < tierCount; t++) {
      const radius = 1.35 - t * 0.24;
      const heightY = 1.1 + t * 0.68;
      const isAlt = t % 2 === 1;

      // Puffy torus ring with ribbed yarn material
      const torusGeo = new THREE.TorusGeometry(radius, 0.35, 10, 24);
      torusGeo.rotateX(Math.PI / 2);
      const torusMat = createCrochetMaterial(isAlt ? 0x7E967A : 0x6D8669, 0.9);
      const torusMesh = new THREE.Mesh(torusGeo, torusMat);
      torusMesh.position.y = heightY;
      torusMesh.castShadow = true;
      treeGroup.add(torusMesh);

      // Inner fill cone
      const coneFill = new THREE.Mesh(
        new THREE.ConeGeometry(radius, 0.6, 16),
        torusMat
      );
      coneFill.position.y = heightY + 0.15;
      treeGroup.add(coneFill);
    }

    worldScene.add(treeGroup);
    worldPineTrees.push(treeGroup);
  });

  // 8. The Great Tree, Wooden Garden Bench & Amigurumi Teddy Bear (Left Side)
  const greatTreeGroup = new THREE.Group();
  greatTreeGroup.position.set(-6.4, 0, 2.2);

  // Sculpted Curved Bark Trunk
  const trunkCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(-0.25, 1.5, 0),
    new THREE.Vector3(-0.6, 2.8, 0.1),
    new THREE.Vector3(-0.3, 4.0, 0)
  ]);
  const trunkGeo = new THREE.TubeGeometry(trunkCurve, 24, 0.45, 10, false);
  const trunkMat = createCrochetMaterial(0x645042, 0.92);
  const trunkMesh = new THREE.Mesh(trunkGeo, trunkMat);
  trunkMesh.castShadow = true;
  greatTreeGroup.add(trunkMesh);

  // Moss-Green Cloud Canopy Spheres
  const canopyMat = createCrochetMaterial(0x567050, 0.92);
  const leafClusters = [
    { x: -0.6, y: 4.0, z: 0, r: 1.7 },
    { x: 0.9,  y: 3.8, z: 0.4, r: 1.4 },
    { x: -1.4, y: 3.6, z: -0.6, r: 1.5 },
    { x: 0.3,  y: 4.6, z: -0.2, r: 1.55 }
  ];
  worldGreatTreeCanopy = [];
  leafClusters.forEach(lc => {
    const cGeo = new THREE.SphereGeometry(lc.r, 16, 16);
    const cMesh = new THREE.Mesh(cGeo, canopyMat);
    cMesh.position.set(lc.x, lc.y, lc.z);
    cMesh.userData = { baseX: lc.x, baseY: lc.y, baseZ: lc.z };
    cMesh.castShadow = true;
    greatTreeGroup.add(cMesh);
    worldGreatTreeCanopy.push(cMesh);
  });

  // Miniature Wooden Garden Bench
  const benchGroup = new THREE.Group();
  benchGroup.position.set(1.0, 0.12, 1.9);
  benchGroup.rotation.y = 0.28;

  const bWoodMat = createCrochetMaterial(0x9E8C7D, 0.88);

  // 3-Slat Bench Seat
  const bSeatGeo = new THREE.BoxGeometry(1.45, 0.1, 0.58);
  const bSeat = new THREE.Mesh(bSeatGeo, bWoodMat);
  bSeat.position.y = 0.44;
  bSeat.castShadow = true;
  benchGroup.add(bSeat);

  // Bench Backrest
  const bBackGeo = new THREE.BoxGeometry(1.45, 0.48, 0.08);
  const bBack = new THREE.Mesh(bBackGeo, bWoodMat);
  bBack.position.set(0, 0.76, -0.26);
  bBack.castShadow = true;
  benchGroup.add(bBack);

  // Handcrafted Amigurumi Teddy Bear Sitting on Bench (With Pink Scarf)
  const bearGroup = new THREE.Group();
  bearGroup.position.set(-0.2, 0.48, 0.02);

  const bearYarnMat = createCrochetMaterial(0xAF8866, 0.9);

  // Chubby Body
  const bBody = new THREE.Mesh(new THREE.SphereGeometry(0.33, 16, 16), bearYarnMat);
  bBody.position.y = 0.26;
  bBody.castShadow = true;
  bearGroup.add(bBody);

  // Cute Head
  const bHead = new THREE.Mesh(new THREE.SphereGeometry(0.29, 16, 16), bearYarnMat);
  bHead.position.set(0, 0.68, 0.06);
  bHead.castShadow = true;
  bearGroup.add(bHead);

  // Cream Snout & Embroidered Nose
  const snoutMesh = new THREE.Mesh(
    new THREE.SphereGeometry(0.12, 12, 12),
    createCrochetMaterial(0xF7EFE7, 0.88)
  );
  snoutMesh.position.set(0, 0.64, 0.32);
  bearGroup.add(snoutMesh);

  const noseDot = new THREE.Mesh(
    new THREE.SphereGeometry(0.038, 8, 8),
    new THREE.MeshBasicMaterial({ color: 0x2A221C })
  );
  noseDot.position.set(0, 0.68, 0.43);
  bearGroup.add(noseDot);

  // Embroidered Button Eyes
  [-0.09, 0.09].forEach(eyeX => {
    const eye = new THREE.Mesh(
      new THREE.SphereGeometry(0.032, 8, 8),
      new THREE.MeshBasicMaterial({ color: 0x1A1410 })
    );
    eye.position.set(eyeX, 0.74, 0.31);
    bearGroup.add(eye);
  });

  // Cupped Ears
  [-0.19, 0.19].forEach(earX => {
    const ear = new THREE.Mesh(new THREE.SphereGeometry(0.095, 10, 10), bearYarnMat);
    ear.position.set(earX, 0.88, 0.03);
    bearGroup.add(ear);
  });

  // Ribbed Pink Knitted Scarf with Tassels
  const scarfGeo = new THREE.TorusGeometry(0.22, 0.075, 10, 20);
  scarfGeo.rotateX(Math.PI / 2);
  const scarfMat = createCrochetMaterial(0xE89CAE, 0.85);
  const scarfMesh = new THREE.Mesh(scarfGeo, scarfMat);
  scarfMesh.position.set(0, 0.5, 0.06);
  bearGroup.add(scarfMesh);

  worldTeddyBear = { body: bBody, head: bHead };
  benchGroup.add(bearGroup);
  greatTreeGroup.add(benchGroup);
  worldScene.add(greatTreeGroup);

  // 9. Wildflower Patches & Rustic Split-Rail Wooden Fence
  worldFlowers = [];
  const flowerCoords = [
    { x: -3.3, z: 2.6, color: 0xE89CAE, type: 'tulip' },
    { x: -2.1, z: 4.4, color: 0xF7F4EE, type: 'daisy' },
    { x: -1.3, z: 6.8, color: 0xE89CAE, type: 'tulip' },
    { x: -3.9, z: 7.4, color: 0xF9E79F, type: 'buttercup' },
    { x: 1.9,  z: 3.6, color: 0xE89CAE, type: 'tulip' },
    { x: 2.9,  z: 5.4, color: 0xF7F4EE, type: 'daisy' },
    { x: 3.6,  z: 7.2, color: 0xF9E79F, type: 'buttercup' }
  ];

  flowerCoords.forEach((fc, idx) => {
    const fGroup = new THREE.Group();
    fGroup.position.set(fc.x, 0.06, fc.z);

    const fStem = new THREE.Mesh(
      new THREE.CylinderGeometry(0.03, 0.03, 0.75, 8),
      createCrochetMaterial(0x829A7F, 0.85)
    );
    fStem.position.y = 0.38;
    fStem.castShadow = true;
    fGroup.add(fStem);

    const fBloom = new THREE.Mesh(
      new THREE.SphereGeometry(fc.type === 'tulip' ? 0.24 : 0.19, 12, 12),
      createCrochetMaterial(fc.color, 0.82)
    );
    fBloom.position.y = 0.76;
    fBloom.castShadow = true;
    fGroup.add(fBloom);

    fGroup.userData = { speed: 1.2 + (idx % 3) * 0.4, offset: idx * 0.9 };
    worldScene.add(fGroup);
    worldFlowers.push(fGroup);
  });

  // Split-Rail Wooden Fence (Lower Right Foreground)
  const fenceGroup = new THREE.Group();
  fenceGroup.position.set(4.9, 0.06, 6.4);
  fenceGroup.rotation.y = -0.44;

  const fWoodMat = createCrochetMaterial(0x8B7969, 0.9);
  [-1.25, 0, 1.25].forEach(fx => {
    const pMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 0.9, 8), fWoodMat);
    pMesh.position.set(fx, 0.45, 0);
    pMesh.castShadow = true;
    fenceGroup.add(pMesh);
  });
  [0.34, 0.66].forEach(ry => {
    const rMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.065, 2.7, 8), fWoodMat);
    rMesh.rotateZ(Math.PI / 2);
    rMesh.position.set(0, ry, 0);
    rMesh.castShadow = true;
    fenceGroup.add(rMesh);
  });

  // Plump Colorful Amigurumi Mushrooms Along the Fence
  const mushColors = [0xE89CAE, 0xE59866, 0xF9E79F, 0xFAF4EB];
  [-0.6, -0.2, 0.4, 0.8].forEach((mx, idx) => {
    const mGroup = new THREE.Group();
    mGroup.position.set(mx, 0, 0.38);

    const stemMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.045, 0.06, 0.24, 8),
      createCrochetMaterial(0xFFFAF2, 0.85)
    );
    stemMesh.position.y = 0.12;
    mGroup.add(stemMesh);

    const capMesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.13, 12, 12, 0, Math.PI * 2, 0, Math.PI / 2),
      createCrochetMaterial(mushColors[idx % mushColors.length], 0.8)
    );
    capMesh.position.y = 0.24;
    mGroup.add(capMesh);

    fenceGroup.add(mGroup);
  });

  worldScene.add(fenceGroup);

  // 10. Soaring Dynamic Birds with banking and flap-and-glide cycles
  worldBirds = [];
  const birdScales = [1.0, 0.85, 0.92, 0.75];
  const bWingMat = createCrochetMaterial(0x4A433D, 0.82);
  const bBellyMat = createCrochetMaterial(0xEFE8DD, 0.88);

  for (let b = 0; b < 4; b++) {
    const bird = new THREE.Group();
    const bodyGeo = new THREE.SphereGeometry(0.18, 10, 8);
    bodyGeo.scale(0.8, 0.7, 1.8);
    bird.add(new THREE.Mesh(bodyGeo, bBellyMat));

    const beak = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.16, 6), new THREE.MeshBasicMaterial({ color: 0xF39C12 }));
    beak.rotateX(Math.PI / 2);
    beak.position.set(0, 0, 0.38);
    bird.add(beak);

    const lWing = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.025, 0.18), bWingMat);
    lWing.position.set(-0.2, 0.04, -0.05);
    bird.add(lWing);

    const rWing = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.025, 0.18), bWingMat);
    rWing.position.set(0.2, 0.04, -0.05);
    bird.add(rWing);

    const tail = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.02, 0.28), bWingMat);
    tail.position.set(0, 0.02, -0.42);
    tail.rotation.x = -0.15;
    bird.add(tail);

    const s = birdScales[b];
    bird.scale.set(s, s, s);

    bird.userData = {
      lWing, rWing,
      centerX: (b % 2 === 0 ? 1.5 : -2.5) + (b * 1.2),
      centerZ: -6.0 + (b * 2.5),
      radiusX: 11.0 + b * 2.2,
      radiusZ: 8.5 + b * 1.8,
      altitudeBase: 8.5 + b * 1.4,
      speed: 0.22 + b * 0.04,
      phase: b * (Math.PI / 2)
    };
    worldScene.add(bird);
    worldBirds.push(bird);
  }

  // 11. Chimney Smoke Puffs Rising in the Breeze
  worldChimneySmoke = [];
  const smokeMat = createCrochetMaterial(0xFAF6EE, 0.95);
  smokeMat.transparent = true;
  smokeMat.opacity = 0.75;
  const smokeGeo = new THREE.SphereGeometry(0.18, 10, 10);
  const chimneyWorldPos = new THREE.Vector3(4.25, 3.65, 0.2);

  for (let s = 0; s < 7; s++) {
    const puff = new THREE.Mesh(smokeGeo, smokeMat.clone());
    puff.userData = {
      basePos: chimneyWorldPos.clone(),
      age: s * 0.55,
      lifeTime: 3.8
    };
    puff.position.copy(chimneyWorldPos);
    worldScene.add(puff);
    worldChimneySmoke.push(puff);
  }

  // 12. Floating Pollen & Dandelion Breeze Particles
  const particleCount = 120;
  const breezeGeo = new THREE.BufferGeometry();
  const bPositions = new Float32Array(particleCount * 3);
  const bVelocities = [];

  for (let i = 0; i < particleCount; i++) {
    bPositions[i * 3] = (Math.random() - 0.5) * 36;
    bPositions[i * 3 + 1] = 0.6 + Math.random() * 9.5;
    bPositions[i * 3 + 2] = (Math.random() - 0.5) * 28;

    bVelocities.push({
      vx: 0.45 + Math.random() * 0.55,
      vy: (Math.random() - 0.5) * 0.25,
      vz: 0.35 + Math.random() * 0.45,
      wobbleSpeed: 1.2 + Math.random() * 2.0,
      wobbleAmp: 0.015 + Math.random() * 0.02
    });
  }
  breezeGeo.setAttribute('position', new THREE.BufferAttribute(bPositions, 3));

  const pCanvas = document.createElement('canvas');
  pCanvas.width = 64; pCanvas.height = 64;
  const pCtx = pCanvas.getContext('2d');
  const grad = pCtx.createRadialGradient(32, 32, 0, 32, 32, 30);
  grad.addColorStop(0, 'rgba(255, 250, 240, 1.0)');
  grad.addColorStop(0.35, 'rgba(255, 243, 214, 0.7)');
  grad.addColorStop(1, 'rgba(255, 243, 214, 0)');
  pCtx.fillStyle = grad;
  pCtx.fillRect(0, 0, 64, 64);

  const pMat = new THREE.PointsMaterial({
    size: 0.42,
    map: new THREE.CanvasTexture(pCanvas),
    transparent: true,
    opacity: 0.72,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  worldBreezePollen = new THREE.Points(breezeGeo, pMat);
  worldBreezePollen.userData = { velocities: bVelocities };
  worldScene.add(worldBreezePollen);

  // 13. Drifting Knitted Clouds
  worldClouds = [];
  const cloudData = [
    { x: -14, y: 13.5, z: -18, scale: 1.3 },
    { x: -2,  y: 15.0, z: -22, scale: 1.1 },
    { x: 10,  y: 13.8, z: -19, scale: 1.25 }
  ];
  const cloudMat = createCrochetMaterial(0xFFFAF2, 0.94);
  cloudData.forEach((cd, idx) => {
    const cGroup = new THREE.Group();
    cGroup.position.set(cd.x, cd.y, cd.z);
    cGroup.scale.set(cd.scale, cd.scale * 0.75, cd.scale);
    const offsets = [
      { x: 0,    y: 0,   z: 0,   r: 1.2 },
      { x: -1.2, y: -0.2, z: 0.1, r: 0.85 },
      { x: 1.1,  y: -0.15, z: -0.1, r: 0.95 },
      { x: -0.6, y: 0.45, z: -0.15, r: 0.9 },
      { x: 0.7,  y: 0.35, z: 0.1,  r: 0.8 }
    ];
    offsets.forEach(o => {
      const puff = new THREE.Mesh(new THREE.SphereGeometry(o.r, 12, 10), cloudMat);
      puff.position.set(o.x, o.y, o.z);
      cGroup.add(puff);
    });
    cGroup.userData = { speed: 0.35 + idx * 0.12 };
    worldScene.add(cGroup);
    worldClouds.push(cGroup);
  });

  // 14. Fluttering Colorful Butterflies
  worldButterflies = [];
  const bfColors = [0xE89CAE, 0xF9E79F, 0xC3A6D8];
  const bfCenters = [
    { x: -2.0, y: 1.1, z: 4.8 },
    { x: 2.8,  y: 1.2, z: 4.2 },
    { x: 0.4,  y: 1.4, z: 2.1 }
  ];
  bfCenters.forEach((bc, idx) => {
    const bfGroup = new THREE.Group();
    const wingMat = createCrochetMaterial(bfColors[idx], 0.78);
    const lWing = new THREE.Mesh(new THREE.CircleGeometry(0.16, 8), wingMat);
    lWing.position.x = -0.12;
    bfGroup.add(lWing);
    const rWing = new THREE.Mesh(new THREE.CircleGeometry(0.16, 8), wingMat);
    rWing.position.x = 0.12;
    bfGroup.add(rWing);
    const bBody = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.18, 6), createCrochetMaterial(0x3B322C, 0.9));
    bBody.rotateX(Math.PI / 2);
    bfGroup.add(bBody);
    bfGroup.userData = { lWing, rWing, center: bc, radius: 0.9 + idx * 0.3, speed: 1.6 + idx * 0.4, seed: idx * 2.3 };
    worldScene.add(bfGroup);
    worldButterflies.push(bfGroup);
  });
}

function setupWorldEventListeners() {
  window.addEventListener('resize', onWindowResize);
  document.addEventListener('visibilitychange', onVisibilityChange);

  const dragLayer = document.getElementById('crochet-interactive-layer');
  if (dragLayer) {
    dragLayer.addEventListener('pointerdown', (e) => {
      isDioramaDragging = true;
      dragStartX = e.clientX;
      dragStartY = e.clientY;
    });

    window.addEventListener('pointermove', (e) => {
      if (!isDioramaDragging) return;
      const dx = e.clientX - dragStartX;
      const dy = e.clientY - dragStartY;
      dragStartX = e.clientX;
      dragStartY = e.clientY;

      targetOrbitAngleX -= dx * 0.0055;
      targetOrbitAngleY = Math.max(0.14, Math.min(0.62, targetOrbitAngleY + dy * 0.0045));
    });

    window.addEventListener('pointerup', () => { isDioramaDragging = false; });
    window.addEventListener('pointercancel', () => { isDioramaDragging = false; });
  }
}

function onWindowResize() {
  if (!worldRenderer || !worldCamera) return;
  const container = document.getElementById('hero-stage') || document.body;
  const width = container.clientWidth || window.innerWidth;
  const height = container.clientHeight || window.innerHeight;
  worldCamera.aspect = width / height;
  worldCamera.updateProjectionMatrix();
  worldRenderer.setSize(width, height);
}

function onVisibilityChange() {
  if (document.hidden) {
    isWorldActive = false;
  } else {
    isWorldActive = true;
    animateCrochetWorld();
  }
}

const clock = new THREE.Clock();

function animateCrochetWorld() {
  if (!isWorldActive) return;
  requestAnimationFrame(animateCrochetWorld);

  const delta = clock.getDelta();
  const time = clock.getElapsedTime();

  // 1. Smooth Camera Orbit Interpolation
  orbitAngleX += (targetOrbitAngleX - orbitAngleX) * 0.08;
  orbitAngleY += (targetOrbitAngleY - orbitAngleY) * 0.08;

  const idleSway = (isMotionPaused || isDioramaDragging) ? 0 : Math.sin(time * 0.35) * 0.025;
  const cx = orbitAngleX + idleSway;
  const cy = orbitAngleY;

  worldCamera.position.x = lookAtTarget.x + orbitDistance * Math.sin(cx) * Math.cos(cy);
  worldCamera.position.y = lookAtTarget.y + orbitDistance * Math.sin(cy);
  worldCamera.position.z = lookAtTarget.z + orbitDistance * Math.cos(cx) * Math.cos(cy);
  worldCamera.lookAt(lookAtTarget);

  // 2. Realistic Environmental & Handcrafted Living Motion
  if (!isMotionPaused) {
    // A. Rowboat moving along river curve with wave bobbing and rock
    if (worldRowBoat && worldRiverCurve) {
      worldBoatU += delta * 0.026;
      if (worldBoatU > 0.96) worldBoatU = 0.02;

      const currentPt = worldRiverCurve.getPointAt(worldBoatU);
      const nextPt = worldRiverCurve.getPointAt(Math.min(1.0, worldBoatU + 0.01));
      const tangent = nextPt.clone().sub(currentPt).normalize();

      const bobbing = Math.sin(time * 2.4) * 0.028;
      const rockRoll = Math.sin(time * 2.8) * 0.07;
      const rockPitch = Math.cos(time * 1.9) * 0.045;

      worldRowBoat.position.set(currentPt.x, currentPt.y + 0.08 + bobbing, currentPt.z);
      worldRowBoat.lookAt(currentPt.clone().add(tangent));
      worldRowBoat.rotation.z += rockRoll;
      worldRowBoat.rotation.x += rockPitch;
    }

    // B. River flowing ripple texture animation & floating foam/petals
    if (riverTexture) {
      riverTexture.offset.y -= delta * 0.35;
    }
    if (riverRibbonMesh) {
      riverRibbonMesh.material.bumpScale = 0.038 + Math.sin(time * 1.6) * 0.008;
    }
    if (worldRiverCurve && worldRiverFoam.length) {
      worldRiverFoam.forEach(foam => {
        foam.userData.u += delta * foam.userData.speed;
        if (foam.userData.u >= 0.98) foam.userData.u = 0.02;
        const pt = worldRiverCurve.getPointAt(foam.userData.u);
        const tan = worldRiverCurve.getTangentAt(foam.userData.u);
        const normal = new THREE.Vector3(-tan.z, 0, tan.x).normalize();
        const pos = pt.clone().add(normal.clone().multiplyScalar(foam.userData.lateralOffset));
        foam.position.set(pos.x, pt.y + 0.04 + Math.sin(time * 3 + foam.userData.wobbleOffset) * 0.012, pos.z);
        foam.rotation.y += delta * foam.userData.spinSpeed;
      });
    }

    // C. Flying Soaring Birds with realistic banking & flap-and-glide cycles
    worldBirds.forEach(bird => {
      const ud = bird.userData;
      const progress = (time * ud.speed) + ud.phase;

      const px = ud.centerX + Math.sin(progress) * ud.radiusX;
      const pz = ud.centerZ + Math.sin(progress * 2) * (ud.radiusZ * 0.65);
      const py = ud.altitudeBase + Math.sin(progress * 1.5) * 1.4;

      const nextProg = progress + 0.02;
      const nx = ud.centerX + Math.sin(nextProg) * ud.radiusX;
      const nz = ud.centerZ + Math.sin(nextProg * 2) * (ud.radiusZ * 0.65);
      const ny = ud.altitudeBase + Math.sin(nextProg * 1.5) * 1.4;

      bird.position.set(px, py, pz);
      bird.rotation.y = Math.atan2(nx - px, nz - pz);
      bird.rotation.x = -(ny - py) * 0.8;
      bird.rotation.z = -Math.cos(progress) * 0.35; // banking into turn

      const cycle = (time * 1.2 + ud.phase) % 4.0;
      if (cycle < 2.2) {
        const flap = Math.sin(time * 14 + ud.phase) * 0.55;
        ud.lWing.rotation.z = flap;
        ud.rWing.rotation.z = -flap;
      } else {
        ud.lWing.rotation.z = 0.08 + Math.sin(time * 2) * 0.03;
        ud.rWing.rotation.z = -0.08 - Math.sin(time * 2) * 0.03;
      }
    });

    // D. Air Breeze & Floating Pollen / Dandelion fluff particles
    if (worldBreezePollen) {
      const positions = worldBreezePollen.geometry.attributes.position.array;
      const vels = worldBreezePollen.userData.velocities;
      for (let i = 0; i < vels.length; i++) {
        const v = vels[i];
        positions[i * 3] += v.vx * delta * 2.2;
        positions[i * 3 + 1] += Math.sin(time * v.wobbleSpeed + i) * v.wobbleAmp;
        positions[i * 3 + 2] += v.vz * delta * 1.8;

        if (positions[i * 3] > 18) positions[i * 3] = -18;
        if (positions[i * 3 + 2] > 14) positions[i * 3 + 2] = -14;
        if (positions[i * 3 + 1] > 10) positions[i * 3 + 1] = 0.8;
        if (positions[i * 3 + 1] < 0.5) positions[i * 3 + 1] = 8.5;
      }
      worldBreezePollen.geometry.attributes.position.needsUpdate = true;
    }

    // E. Swaying Pine Trees & Great Tree Canopy in the breeze
    worldPineTrees.forEach((tree, idx) => {
      tree.rotation.z = Math.sin(time * 1.8 + tree.position.x * 0.4 + idx) * 0.038;
      tree.rotation.x = Math.cos(time * 1.4 + tree.position.z * 0.3) * 0.02;
    });
    worldGreatTreeCanopy.forEach((cMesh, idx) => {
      cMesh.position.x = cMesh.userData.baseX + Math.sin(time * 1.5 + idx * 1.1) * 0.05;
      cMesh.position.y = cMesh.userData.baseY + Math.cos(time * 1.2 + idx) * 0.03;
    });

    // F. Swaying Wildflowers
    worldFlowers.forEach(fg => {
      fg.rotation.z = Math.sin(time * fg.userData.speed + fg.userData.offset) * 0.09;
    });

    // G. Cottage Chimney Smoke Rising & Billowing
    worldChimneySmoke.forEach(puff => {
      puff.userData.age += delta;
      if (puff.userData.age > puff.userData.lifeTime) {
        puff.userData.age = 0;
        puff.position.copy(puff.userData.basePos);
      }
      const tNorm = puff.userData.age / puff.userData.lifeTime;
      puff.position.y = puff.userData.basePos.y + tNorm * 2.8;
      puff.position.x = puff.userData.basePos.x + tNorm * 1.6 + Math.sin(time * 2 + puff.userData.age) * 0.12;
      puff.position.z = puff.userData.basePos.z - tNorm * 0.5;
      const s = 0.5 + tNorm * 1.8;
      puff.scale.set(s, s * 0.85, s);
      puff.material.opacity = Math.max(0, (1 - tNorm) * 0.75);
    });

    // H. Fluttering Butterflies
    worldButterflies.forEach(bf => {
      const ud = bf.userData;
      const t = time * ud.speed + ud.seed;
      bf.position.x = ud.center.x + Math.sin(t) * ud.radius;
      bf.position.z = ud.center.z + Math.cos(t * 1.5) * ud.radius;
      bf.position.y = ud.center.y + Math.sin(t * 3.2) * 0.28;
      const flap = Math.sin(time * 32 + ud.seed) * 0.85;
      ud.lWing.rotation.y = flap;
      ud.rWing.rotation.y = -flap;
      bf.rotation.y = Math.atan2(Math.cos(t), -Math.sin(t * 1.5));
    });

    // I. Drifting Knitted Clouds
    worldClouds.forEach(cloud => {
      cloud.position.x += delta * cloud.userData.speed;
      if (cloud.position.x > 24) cloud.position.x = -24;
    });

    // J. Teddy Bear Gentle Breathing on Bench
    if (worldTeddyBear) {
      const breathe = Math.sin(time * 1.8) * 0.025;
      worldTeddyBear.body.scale.set(1 + breathe * 0.6, 1 + breathe, 1 + breathe * 0.6);
      worldTeddyBear.head.rotation.z = Math.sin(time * 0.9) * 0.035;
    }
  }

  worldRenderer.render(worldScene, worldCamera);
}

/* ===================================================
   3. CINEMATIC CURTAINS CONTROLLER
   =================================================== */
function initCinematicCurtains() {
  const curtainWrap = document.getElementById('cinematic-curtains-wrap');
  if (!curtainWrap) return;

  const hasSeen = sessionStorage.getItem('prisha_curtains_seen');
  if (hasSeen === 'true') {
    curtainWrap.classList.add('opened');
    return;
  }

  // Auto-play entrance sequence
  setTimeout(() => {
    openCurtains();
  }, 1200);
}

function openCurtains() {
  const curtainWrap = document.getElementById('cinematic-curtains-wrap');
  if (!curtainWrap || curtainWrap.classList.contains('opening') || curtainWrap.classList.contains('opened')) return;

  curtainWrap.classList.add('opening');
  sessionStorage.setItem('prisha_curtains_seen', 'true');

  // Play audio chime if enabled
  playChimeSound(523.25); // C5 note

  setTimeout(() => {
    curtainWrap.classList.add('opened');
  }, 2300);
}

function skipCinematicCurtains() {
  const curtainWrap = document.getElementById('cinematic-curtains-wrap');
  if (!curtainWrap) return;
  sessionStorage.setItem('prisha_curtains_seen', 'true');
  curtainWrap.classList.add('opened');
  curtainWrap.classList.remove('opening');
}

function replayCinematicEntrance() {
  const curtainWrap = document.getElementById('cinematic-curtains-wrap');
  if (!curtainWrap) return;

  window.scrollTo({ top: 0, behavior: 'smooth' });
  curtainWrap.classList.remove('opened');
  curtainWrap.classList.remove('opening');

  setTimeout(() => {
    openCurtains();
  }, 600);
}

/* ===================================================
   4. PROCEDURAL AMBIENT GARDEN AUDIO SOUNDSCAPE
   =================================================== */
let audioCtx = null;
let isAudioActive = false;
let ambientInterval = null;

function toggleAmbientAudio() {
  if (!isAudioActive) {
    startAmbientAudio();
  } else {
    stopAmbientAudio();
  }
}

function startAmbientAudio() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    if (!audioCtx) audioCtx = new AudioContext();
    if (audioCtx.state === 'suspended') audioCtx.resume();

    isAudioActive = true;
    updateAudioUI(true);

    // Play periodic soothing pentatonic wind chimes
    const pentatonicNotes = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33]; // C, D, E, G, A, C5, D5
    playChimeSound(pentatonicNotes[0]);

    ambientInterval = setInterval(() => {
      if (!isAudioActive) return;
      const note = pentatonicNotes[Math.floor(Math.random() * pentatonicNotes.length)];
      playChimeSound(note);
    }, 2800);

    showToast("🌸 Cozy garden soundscape enabled ♡");
  } catch (e) {
    console.warn("Audio unavailable:", e);
  }
}

function stopAmbientAudio() {
  isAudioActive = false;
  if (ambientInterval) clearInterval(ambientInterval);
  updateAudioUI(false);
  showToast("Audio muted");
}

function playChimeSound(freq) {
  if (!audioCtx) return;
  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

    gain.gain.setValueAtTime(0.001, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.045, audioCtx.currentTime + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 2.4);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 2.5);
  } catch (e) {}
}

function updateAudioUI(active) {
  const btn = document.getElementById('ambient-audio-btn');
  const icon = document.getElementById('audio-icon');
  const text = document.getElementById('audio-text');
  if (!btn || !icon) return;

  if (active) {
    btn.classList.add('sound-active');
    icon.className = 'fa-solid fa-volume-high text-[#D88A9A]';
    if (text) text.textContent = 'Audio On';
  } else {
    btn.classList.remove('sound-active');
    icon.className = 'fa-solid fa-volume-xmark text-[#8A9A86]';
    if (text) text.textContent = 'Garden Audio';
  }
}

/* ===================================================
   5. 3D PRODUCT DETAIL MODAL & REALTIME CUSTOMIZER
   =================================================== */
let modal3DScene, modal3DCamera, modal3DRenderer, modal3DControls;
let modal3DMeshGroup = null;
let isModal3DActive = false;

function openProductModal(productId) {
  const p = products.find(prod => prod.id === productId);
  if (!p) return;

  currentDetailProduct = p;
  selectedModalColor = p.colors ? p.colors[0] : 'Standard';
  selectedGiftWrap = isFlowerProduct(p) ? 'Without Gift Wrap' : 'No Gift Wrap';

  // Initialize customizable parts state
  activeCustomParts = {};
  if (p.customParts) {
    Object.keys(p.customParts).forEach(partKey => {
      activeCustomParts[partKey] = p.customParts[partKey].defaultColor;
    });
  }

  const modal = document.getElementById('modal-product-detail');
  const container = document.getElementById('modal-product-inner-content');
  if (!modal || !container) return;

  const displayPrice = p.salePrice || p.price;
  const isFlower = isFlowerProduct(p);
  const wrapCost = p.customization?.giftWrapPrice || 99.00;

  container.innerHTML = `
    <!-- Left Column: 3D Viewport / Photo Gallery -->
    <div class="md:col-span-6 space-y-4">
      <div class="product-3d-viewport relative">
        <canvas id="modal-3d-canvas" class="product-3d-canvas"></canvas>
        <img id="modal-photo-img" src="${p.images[0]}" alt="${p.name}" class="w-full h-full object-cover hidden">
        
        <!-- Toggle 3D vs Photo Gallery View -->
        <div class="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <div class="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-[11px] font-bold text-[#2E252E] shadow-sm flex items-center gap-1.5 pointer-events-auto">
            <i class="fa-solid fa-hand-pointer text-[#D88A9A]"></i> Drag to rotate • Scroll to zoom
          </div>
          
          <button type="button" onclick="toggleModalViewMode()" id="modal-view-mode-btn" class="bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full text-[11px] font-bold text-[#D88A9A] border border-[#EFE4EA] shadow-sm hover:bg-[#FFF0F4] transition pointer-events-auto">
            <i class="fa-regular fa-image mr-1"></i> View Photos
          </button>
        </div>
      </div>

      <!-- Part Customizer (If product supports 3D custom parts) -->
      ${p.customParts ? `
        <div class="bg-white p-4 rounded-2xl border border-[#EFE4EA] space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold uppercase tracking-wider text-[#2E252E]">🎨 3D Yarn Colour Customizer:</span>
            <button onclick="resetModalCustomParts()" class="text-[11px] text-[#7A6B7A] hover:text-[#D88A9A] font-bold underline">Reset Colors</button>
          </div>

          <div class="grid grid-cols-2 gap-2" id="modal-part-tabs">
            ${Object.keys(p.customParts).map((k, idx) => `
              <button type="button" onclick="setModalActivePart('${k}')" class="modal-part-tab-btn text-xs font-bold py-1.5 px-3 rounded-xl border ${idx === 0 ? 'border-[#D88A9A] bg-[#FFF0F4] text-[#D88A9A]' : 'border-[#EFE4EA] bg-white text-[#2E252E]'} text-left truncate">
                ${p.customParts[k].label}
              </button>
            `).join('')}
          </div>

          <!-- Color Swatches Grid -->
          <div class="pt-2">
            <div class="text-[11px] font-bold text-[#7A6B7A] mb-2" id="active-part-label">Recolouring: ${Object.values(p.customParts)[0].label}</div>
            <div class="flex flex-wrap gap-2" id="modal-palette-chips">
              ${ARTISAN_YARN_PALETTE.map(c => `
                <button type="button" onclick="applyModalPartColor('${c.hex}', '${c.name}')" class="yarn-color-chip" style="background-color: ${c.hex};" title="${c.name}">
                </button>
              `).join('')}
              <label class="w-8 h-8 rounded-full border-2 border-dashed border-[#D88A9A] flex items-center justify-center cursor-pointer hover:bg-[#FFF0F4]" title="Custom Hex Shade">
                <input type="color" onchange="applyModalPartColor(this.value, 'Custom Shade')" class="opacity-0 w-0 h-0">
                <i class="fa-solid fa-plus text-[10px] text-[#D88A9A]"></i>
              </label>
            </div>
            <p class="text-[10px] text-[#7A6B7A] mt-2 italic">* Natural combed cotton. Screen shades may vary slightly from physical yarn.</p>
          </div>
        </div>
      ` : ''}
    </div>

    <!-- Right Column: Product Specs, INR Price & Actions -->
    <div class="md:col-span-6 space-y-4 text-left">
      <div>
        <div class="flex items-center gap-2 mb-1">
          <span class="text-[10px] font-bold uppercase tracking-wider text-[#D88A9A] bg-[#FFF0F4] px-2.5 py-0.5 rounded-full">${p.yarnType}</span>
          <span class="text-[11px] font-bold text-[#8A9A86] flex items-center gap-1"><i class="fa-solid fa-star text-xs text-[#F9E79F]"></i> ${p.rating} (${p.reviewsCount} reviews)</span>
        </div>
        <h2 class="font-editorial text-2xl sm:text-3xl font-bold text-[#2E252E]" id="modal-prod-title">${p.name}</h2>
      </div>

      <!-- Price in INR -->
      <div class="flex items-baseline gap-3">
        <span class="font-editorial text-2xl sm:text-3xl font-bold text-[#C96554]" id="modal-price-display">₹${displayPrice.toFixed(2)}</span>
        ${p.salePrice ? `<span class="text-xs text-[#7A6B7A] line-through">₹${p.price.toFixed(2)}</span>` : ''}
        <span class="text-[11px] font-bold text-[#8A9A86] bg-[#EBF0EA] px-2 py-0.5 rounded-md">In Stock (${p.stock} units)</span>
      </div>

      <!-- Lead time & specs -->
      <div class="grid grid-cols-2 gap-2 text-xs bg-white p-3 rounded-2xl border border-[#EFE4EA]">
        <div>
          <span class="text-[#7A6B7A] block text-[10px] font-bold uppercase">Production Time</span>
          <strong class="text-[#2E252E]">${p.leadTime}</strong>
        </div>
        <div>
          <span class="text-[#7A6B7A] block text-[10px] font-bold uppercase">Dimensions</span>
          <strong class="text-[#2E252E]">${p.dimensions}</strong>
        </div>
      </div>

      <p class="text-xs text-[#7A6B7A] leading-relaxed">${p.description}</p>

      <!-- GIFT WRAPPING OPTION (Strictly exclusively for Flower Products) -->
      ${isFlower ? `
        <div class="bg-[#FFF0F4] p-3.5 rounded-2xl border border-[#D88A9A]/40 space-y-2">
          <label class="block font-bold text-xs text-[#2E252E]">
            🎁 Gift Wrap Options (Flower Exclusive):
          </label>
          <div class="space-y-1.5">
            <label class="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#2E252E]">
              <input type="radio" name="modal-wrap-choice" value="Without Gift Wrap" checked onchange="toggleModalGiftWrap(this, 0)" class="accent-[#D88A9A]">
              <span>Without Gift Wrap (Stem Only - Ready for Vase)</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#2E252E]">
              <input type="radio" name="modal-wrap-choice" value="With Gift Wrap (Optional)" onchange="toggleModalGiftWrap(this, ${wrapCost})" class="accent-[#D88A9A]">
              <span>Aesthetic Paper &amp; Ribbon Gift Wrap (+ ₹${wrapCost.toFixed(2)}) 🎁</span>
            </label>
          </div>
        </div>
      ` : ''}

      <!-- Color Variant Selection Pill List -->
      ${p.colors ? `
        <div>
          <label class="block text-xs font-bold text-[#2E252E] mb-1.5">Select Primary Color Combination:</label>
          <div class="flex flex-wrap gap-1.5">
            ${p.colors.map((c, idx) => `
              <button type="button" onclick="selectModalColorChip(this, '${c}')" class="modal-color-pill text-[11px] font-bold px-3 py-1.5 rounded-full border ${idx === 0 ? 'bg-[#D88A9A] text-white border-[#D88A9A]' : 'bg-white text-[#2E252E] border-[#EFE4EA]'} transition">
                ${c}
              </button>
            `).join('')}
          </div>
        </div>
      ` : ''}

      <!-- Custom Note -->
      ${p.customization && p.customization.allowCustomText ? `
        <div>
          <label class="block text-xs font-bold text-[#2E252E] mb-1">Gift Card Note Message (Optional):</label>
          <input type="text" id="modal-card-note" placeholder="e.g. Happy Birthday to my favorite person ♡" class="w-full text-xs p-2.5 rounded-xl border border-[#EFE4EA] bg-white">
        </div>
      ` : ''}

      <!-- Actions -->
      <div class="pt-2 flex items-center gap-3">
        <button onclick="addModalItemToCart(false)" class="flex-1 btn-artisan justify-center py-3.5 text-xs font-bold">
          <i class="fa-solid fa-basket-shopping"></i> Add to Basket ♡
        </button>
        <button onclick="addModalItemToCart(true)" class="btn-artisan-outline py-3.5 px-5 text-xs font-bold text-[#C96554] border-[#C96554]/40 hover:border-[#C96554]">
          Buy Now
        </button>
      </div>

      <div class="text-[11px] text-[#7A6B7A] pt-1 flex items-center justify-between border-t border-[#EFE4EA]">
        <span>🧼 Care: ${p.care}</span>
        <button onclick="toggleWishlist('${p.id}')" class="text-[#D88A9A] font-bold hover:underline flex items-center gap-1">
          <i class="fa-regular fa-heart"></i> Save to Wishlist
        </button>
      </div>
    </div>
  `;

  modal.classList.add('active');

  // Initialize dedicated 3D canvas viewport
  setTimeout(() => {
    initModal3DCanvas(p);
  }, 50);
}

function closeProductModal() {
  const modal = document.getElementById('modal-product-detail');
  if (modal) modal.classList.remove('active');
  isModal3DActive = false;
  if (modal3DControls) modal3DControls.dispose();
}

let activeModalPartKey = 'petals';

function setModalActivePart(partKey) {
  activeModalPartKey = partKey;
  document.querySelectorAll('.modal-part-tab-btn').forEach(btn => {
    btn.classList.remove('border-[#D88A9A]', 'bg-[#FFF0F4]', 'text-[#D88A9A]');
    btn.classList.add('border-[#EFE4EA]', 'bg-white', 'text-[#2E252E]');
  });
  if (event && event.currentTarget) {
    event.currentTarget.classList.add('border-[#D88A9A]', 'bg-[#FFF0F4]', 'text-[#D88A9A]');
  }
  const labelElem = document.getElementById('active-part-label');
  if (labelElem && currentDetailProduct?.customParts[partKey]) {
    labelElem.textContent = `Recolouring: ${currentDetailProduct.customParts[partKey].label}`;
  }
}

function applyModalPartColor(hexColor, name) {
  if (!activeModalPartKey) return;
  activeCustomParts[activeModalPartKey] = hexColor;

  updateModal3DPartMeshColor(activeModalPartKey, hexColor);
  showToast(`Updated ${activeModalPartKey} to ${name}!`);
}

function resetModalCustomParts() {
  if (!currentDetailProduct?.customParts) return;
  Object.keys(currentDetailProduct.customParts).forEach(k => {
    activeCustomParts[k] = currentDetailProduct.customParts[k].defaultColor;
    updateModal3DPartMeshColor(k, currentDetailProduct.customParts[k].defaultColor);
  });
  showToast("Restored original artisan colors ♡");
}

function toggleModalGiftWrap(radio, extraCost) {
  selectedGiftWrap = radio.value;
  if (!currentDetailProduct) return;
  const basePrice = currentDetailProduct.salePrice || currentDetailProduct.price;
  const totalPrice = basePrice + extraCost;
  const priceElem = document.getElementById('modal-price-display');
  if (priceElem) priceElem.textContent = `₹${totalPrice.toFixed(2)}`;
}

function selectModalColorChip(btn, color) {
  document.querySelectorAll('.modal-color-pill').forEach(b => {
    b.classList.remove('bg-[#D88A9A]', 'text-white', 'border-[#D88A9A]');
    b.classList.add('bg-white', 'text-[#2E252E]', 'border-[#EFE4EA]');
  });
  btn.classList.remove('bg-white', 'text-[#2E252E]', 'border-[#EFE4EA]');
  btn.classList.add('bg-[#D88A9A]', 'text-white', 'border-[#D88A9A]');
  selectedModalColor = color;
}

let isPhotoViewActive = false;
function toggleModalViewMode() {
  isPhotoViewActive = !isPhotoViewActive;
  const canvas = document.getElementById('modal-3d-canvas');
  const img = document.getElementById('modal-photo-img');
  const btn = document.getElementById('modal-view-mode-btn');

  if (isPhotoViewActive) {
    canvas.classList.add('hidden');
    img.classList.remove('hidden');
    btn.innerHTML = '<i class="fa-solid fa-cube mr-1"></i> View in 3D';
  } else {
    canvas.classList.remove('hidden');
    img.classList.add('hidden');
    btn.innerHTML = '<i class="fa-regular fa-image mr-1"></i> View Photos';
  }
}

/* ===================================================
   6. DEDICATED MODAL 3D CANVAS & PROCEDURAL MODELS
   =================================================== */
function initModal3DCanvas(product) {
  const canvas = document.getElementById('modal-3d-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const width = canvas.parentElement.clientWidth || 400;
  const height = canvas.parentElement.clientHeight || 380;

  modal3DScene = new THREE.Scene();
  modal3DCamera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
  modal3DCamera.position.set(0, 0, 4.5);

  modal3DRenderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true
  });
  modal3DRenderer.setSize(width, height);
  modal3DRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

  // Controls with drag-to-rotate and zoom
  modal3DControls = new THREE.OrbitControls(modal3DCamera, modal3DRenderer.domElement);
  modal3DControls.enableDamping = true;
  modal3DControls.dampingFactor = 0.08;
  modal3DControls.autoRotate = true;
  modal3DControls.autoRotateSpeed = 1.2;
  modal3DControls.maxDistance = 7;
  modal3DControls.minDistance = 2.5;

  // Pause auto-rotation when user touches or drags
  modal3DControls.addEventListener('start', () => { modal3DControls.autoRotate = false; });

  // Soft Studio Lighting
  const ambLight = new THREE.AmbientLight(0xFFF7F2, 1.3);
  modal3DScene.add(ambLight);

  const mainLight = new THREE.DirectionalLight(0xFFFFFF, 1.2);
  mainLight.position.set(5, 8, 6);
  modal3DScene.add(mainLight);

  const rimLight = new THREE.DirectionalLight(0xE89CAE, 0.8);
  rimLight.position.set(-6, -2, -4);
  modal3DScene.add(rimLight);

  // Build the dedicated 3D crochet geometry for this product
  modal3DMeshGroup = buildProceduralCrochetModel(product);
  modal3DScene.add(modal3DMeshGroup);

  isModal3DActive = true;
  renderModal3D();
}

function buildProceduralCrochetModel(product) {
  const group = new THREE.Group();
  const type = product.modelType || 'bouquet';

  if (type === 'bouquet') {
    // 1. Bouquet Blossom
    const petalsGeom = new THREE.SphereGeometry(0.85, 24, 24);
    petalsGeom.scale(1, 1.15, 1);
    const petalsMat = createCrochetMaterial(activeCustomParts.petals || 0xE89CAE);
    const petalsMesh = new THREE.Mesh(petalsGeom, petalsMat);
    petalsMesh.position.y = 0.55;
    petalsMesh.name = 'part-petals';
    group.add(petalsMesh);

    // 2. Stamen / Center
    const centerGeom = new THREE.SphereGeometry(0.35, 16, 16);
    const centerMat = createCrochetMaterial(activeCustomParts.center || 0xF9E79F);
    const centerMesh = new THREE.Mesh(centerGeom, centerMat);
    centerMesh.position.set(0, 1.1, 0);
    centerMesh.name = 'part-center';
    group.add(centerMesh);

    // 3. Stems / Leaves
    const leavesGeom = new THREE.CylinderGeometry(0.08, 0.12, 1.6, 12);
    const leavesMat = createCrochetMaterial(activeCustomParts.leaves || 0x8A9A86);
    const leavesMesh = new THREE.Mesh(leavesGeom, leavesMat);
    leavesMesh.position.y = -0.55;
    leavesMesh.name = 'part-leaves';
    group.add(leavesMesh);

    // 4. Wrapping Paper Cone / Ribbon
    const wrapGeom = new THREE.ConeGeometry(0.8, 1.2, 16, 1, true);
    wrapGeom.rotateX(Math.PI);
    const wrapMat = createCrochetMaterial(activeCustomParts.wrap || 0xFAF9F6, 0.7);
    const wrapMesh = new THREE.Mesh(wrapGeom, wrapMat);
    wrapMesh.position.y = -0.3;
    wrapMesh.name = 'part-wrap';
    group.add(wrapMesh);

  } else if (type === 'sunflower') {
    // Center seed disc
    const coreGeom = new THREE.CylinderGeometry(0.55, 0.55, 0.22, 24);
    coreGeom.rotateX(Math.PI / 2);
    const coreMat = createCrochetMaterial(activeCustomParts.center || 0x5C3A21);
    const coreMesh = new THREE.Mesh(coreGeom, coreMat);
    coreMesh.name = 'part-center';
    group.add(coreMesh);

    // Petal array
    const petalGeom = new THREE.TorusGeometry(0.78, 0.25, 16, 32);
    const petalMat = createCrochetMaterial(activeCustomParts.petals || 0xF9E79F);
    const petalMesh = new THREE.Mesh(petalGeom, petalMat);
    petalMesh.name = 'part-petals';
    group.add(petalMesh);

    // Stem
    const stemGeom = new THREE.CylinderGeometry(0.06, 0.08, 1.8, 12);
    const stemMat = createCrochetMaterial(activeCustomParts.leaves || 0x8A9A86);
    const stemMesh = new THREE.Mesh(stemGeom, stemMat);
    stemMesh.position.y = -0.9;
    stemMesh.name = 'part-leaves';
    group.add(stemMesh);

  } else if (type === 'bow') {
    // Bow Loops
    const bowGeom = new THREE.TorusGeometry(0.72, 0.24, 16, 32);
    bowGeom.scale(1.4, 0.8, 0.9);
    const bowMat = createCrochetMaterial(activeCustomParts.petals || 0xE89CAE);
    const bowMesh = new THREE.Mesh(bowGeom, bowMat);
    bowMesh.name = 'part-petals';
    group.add(bowMesh);

    // Center Knot
    const knotGeom = new THREE.SphereGeometry(0.32, 16, 16);
    const knotMat = createCrochetMaterial(activeCustomParts.center || 0xC94A5B);
    const knotMesh = new THREE.Mesh(knotGeom, knotMat);
    knotMesh.name = 'part-center';
    group.add(knotMesh);

  } else {
    // Generic Knot/Sphere Crochet Art
    const geom = new THREE.TorusKnotGeometry(0.75, 0.26, 64, 16);
    const mat = createCrochetMaterial(activeCustomParts.petals || 0xE89CAE);
    const mesh = new THREE.Mesh(geom, mat);
    mesh.name = 'part-petals';
    group.add(mesh);
  }

  return group;
}

function updateModal3DPartMeshColor(partKey, hexColor) {
  if (!modal3DMeshGroup) return;
  const targetMesh = modal3DMeshGroup.getObjectByName(`part-${partKey}`);
  if (targetMesh && targetMesh.material) {
    targetMesh.material.color.set(hexColor);
  }
}

function renderModal3D() {
  if (!isModal3DActive) return;
  requestAnimationFrame(renderModal3D);

  if (modal3DControls) modal3DControls.update();
  if (modal3DRenderer && modal3DScene && modal3DCamera) {
    modal3DRenderer.render(modal3DScene, modal3DCamera);
  }
}

/* ===================================================
   7. ZONE 5 STUDIO INTERACTIVE 3D CANVAS
   =================================================== */
let studio3DScene, studio3DCamera, studio3DRenderer, studio3DControls;
let studio3DMeshGroup = null;
let activeStudioPart = 'petals';

function initStudio3DCanvas() {
  const canvas = document.getElementById('studio-3d-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const width = canvas.parentElement.clientWidth || 400;
  const height = canvas.parentElement.clientHeight || 340;

  studio3DScene = new THREE.Scene();
  studio3DCamera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
  studio3DCamera.position.set(0, 0, 4.2);

  studio3DRenderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  studio3DRenderer.setSize(width, height);
  studio3DRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

  studio3DControls = new THREE.OrbitControls(studio3DCamera, studio3DRenderer.domElement);
  studio3DControls.enableDamping = true;
  studio3DControls.autoRotate = true;
  studio3DControls.autoRotateSpeed = 1.0;

  const amb = new THREE.AmbientLight(0xFFF7F2, 1.25);
  studio3DScene.add(amb);
  const dir = new THREE.DirectionalLight(0xFFFFFF, 1.2);
  dir.position.set(5, 7, 5);
  studio3DScene.add(dir);

  // Build Sample Studio Bouquet Model
  studio3DMeshGroup = buildProceduralCrochetModel(products[0]);
  studio3DScene.add(studio3DMeshGroup);

  renderStudio3D();
  renderStudioSwatches();
}

function renderStudio3D() {
  requestAnimationFrame(renderStudio3D);
  if (studio3DControls) studio3DControls.update();
  if (studio3DRenderer && studio3DScene && studio3DCamera) {
    studio3DRenderer.render(studio3DScene, studio3DCamera);
  }
}

function renderStudioSwatches() {
  const container = document.getElementById('studio-swatches');
  if (!container) return;

  container.innerHTML = ARTISAN_YARN_PALETTE.map(c => `
    <button type="button" onclick="applyStudioSwatchColor('${c.hex}', '${c.name}')" class="yarn-color-chip" style="background-color: ${c.hex};" title="${c.name}">
    </button>
  `).join('');
}

function setStudioActivePart(partKey) {
  activeStudioPart = partKey;
  document.querySelectorAll('.studio-part-btn').forEach(btn => {
    btn.classList.remove('border-[#D88A9A]', 'bg-[#FFF0F4]', 'text-[#D88A9A]');
    btn.classList.add('border-[#EFE4EA]', 'bg-white', 'text-[#2E252E]');
  });
  if (event && event.currentTarget) {
    event.currentTarget.classList.add('border-[#D88A9A]', 'bg-[#FFF0F4]', 'text-[#D88A9A]');
  }
}

function applyStudioSwatchColor(hexColor, name) {
  if (!studio3DMeshGroup) return;
  const mesh = studio3DMeshGroup.getObjectByName(`part-${activeStudioPart}`);
  if (mesh && mesh.material) {
    mesh.material.color.set(hexColor);
    showToast(`Updated ${activeStudioPart} to ${name}!`);
  }
}

function applyStudioCustomHex(hex) {
  applyStudioSwatchColor(hex, "Custom Shade");
}

function resetStudio3DColors() {
  if (!studio3DMeshGroup) return;
  const defaultColors = { petals: '#E89CAE', center: '#F9E79F', leaves: '#8A9A86', wrap: '#FAF9F6' };
  Object.keys(defaultColors).forEach(k => {
    const mesh = studio3DMeshGroup.getObjectByName(`part-${k}`);
    if (mesh && mesh.material) mesh.material.color.set(defaultColors[k]);
  });
  showToast("Restored original studio palette ♡");
}

function orderStudioCustomConfig() {
  openProductModal('prod-1');
  showToast("Loaded custom configuration into order viewer! ♡");
}

/* ===================================================
   8. CART, CHECKOUT & INDIAN PAYMENTS
   =================================================== */
function addModalItemToCart(isBuyNow = false) {
  if (!currentDetailProduct) return;

  const cardNote = document.getElementById('modal-card-note')?.value.trim() || '';
  const item = {
    productId: currentDetailProduct.id,
    name: currentDetailProduct.name,
    price: currentDetailProduct.salePrice || currentDetailProduct.price,
    color: selectedModalColor,
    customParts: { ...activeCustomParts },
    giftWrap: selectedGiftWrap,
    customText: cardNote,
    qty: 1,
    image: currentDetailProduct.images[0]
  };

  // Extra gift wrap fee if applicable
  if (isFlowerProduct(currentDetailProduct) && selectedGiftWrap.includes('With Gift Wrap')) {
    item.price += (currentDetailProduct.customization?.giftWrapPrice || 99.00);
  }

  // Check if identical item already exists in cart
  const existingIdx = cart.findIndex(c => 
    c.productId === item.productId && 
    c.color === item.color && 
    c.giftWrap === item.giftWrap && 
    JSON.stringify(c.customParts) === JSON.stringify(item.customParts)
  );

  if (existingIdx > -1) {
    cart[existingIdx].qty += 1;
  } else {
    cart.push(item);
  }

  saveCart();
  closeProductModal();

  if (isBuyNow) {
    openCheckoutModal();
  } else {
    toggleCartDrawer(true);
    showToast(`Added ${item.name} to basket ♡`);
  }
}

function saveCart() {
  localStorage.setItem('sp_cart', JSON.stringify(cart));
  updateCartBadges();
  renderCartItems();
}

function updateCartBadges() {
  const totalCount = cart.reduce((sum, i) => sum + i.qty, 0);
  const badge1 = document.getElementById('cart-badge');
  const badge2 = document.getElementById('mobile-cart-badge');
  const countSpan = document.getElementById('cart-badge-count');
  if (badge1) badge1.textContent = totalCount;
  if (badge2) badge2.textContent = totalCount;
  if (countSpan) countSpan.textContent = totalCount;
}

function renderCartItems() {
  const container = document.getElementById('cart-items-container');
  if (!container) return;

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="text-center py-12 text-[#7A6B7A]">
        <div class="text-4xl mb-3">🧺</div>
        <h4 class="font-bold text-sm text-[#2E252E]">Your basket is empty</h4>
        <p class="text-xs mt-1">Explore our garden and discover handcrafted treasures.</p>
        <button onclick="toggleCartDrawer(); scrollToGardenZone('section-shop')" class="btn-artisan text-xs mt-4">
          Start Shopping ➔
        </button>
      </div>
    `;
    updateCartTotals(0);
    return;
  }

  let subtotal = 0;
  container.innerHTML = cart.map((item, idx) => {
    const lineTotal = item.price * item.qty;
    subtotal += lineTotal;

    return `
      <div class="flex items-start gap-3 p-3 bg-white rounded-2xl border border-[#EFE4EA]">
        <img src="${item.image}" alt="${item.name}" class="w-16 h-16 rounded-xl object-cover border border-[#EFE4EA] shrink-0">
        <div class="flex-1 min-w-0 text-left">
          <h4 class="font-bold text-xs text-[#2E252E] truncate">${item.name}</h4>
          <div class="text-[11px] text-[#7A6B7A] mt-0.5">${item.color}</div>
          ${item.giftWrap && item.giftWrap.includes('With Gift Wrap') ? `<div class="text-[10px] font-bold text-[#D88A9A]">🎁 Gift Wrapped</div>` : ''}
          ${item.customText ? `<div class="text-[10px] text-[#7A6B7A] italic truncate">Note: "${item.customText}"</div>` : ''}
          <div class="flex items-center justify-between mt-2">
            <div class="flex items-center gap-2 border border-[#EFE4EA] rounded-full px-2 py-0.5">
              <button onclick="updateCartQty(${idx}, -1)" class="text-xs text-[#7A6B7A] hover:text-[#2E252E] px-1 font-bold">-</button>
              <span class="text-xs font-bold text-[#2E252E]">${item.qty}</span>
              <button onclick="updateCartQty(${idx}, 1)" class="text-xs text-[#7A6B7A] hover:text-[#2E252E] px-1 font-bold">+</button>
            </div>
            <span class="font-editorial font-bold text-sm text-[#C96554]">₹${lineTotal.toFixed(2)}</span>
          </div>
        </div>
        <button onclick="removeCartItem(${idx})" class="text-[#7A6B7A] hover:text-[#C96554] p-1 text-xs">
          <i class="fa-solid fa-trash-can"></i>
        </button>
      </div>
    `;
  }).join('');

  updateCartTotals(subtotal);
}

function updateCartQty(idx, delta) {
  if (!cart[idx]) return;
  cart[idx].qty += delta;
  if (cart[idx].qty <= 0) {
    cart.splice(idx, 1);
  }
  saveCart();
}

function removeCartItem(idx) {
  cart.splice(idx, 1);
  saveCart();
}

function updateCartTotals(subtotal) {
  const freeThreshold = 499;
  const isFree = subtotal >= freeThreshold;
  const delivery = subtotal === 0 ? 0 : (isFree ? 0 : 50);
  const total = subtotal + delivery;

  const subElem = document.getElementById('cart-subtotal');
  const delElem = document.getElementById('cart-delivery');
  const totElem = document.getElementById('cart-total');
  const msgElem = document.getElementById('free-shipping-msg');
  const progElem = document.getElementById('free-shipping-progress');

  if (subElem) subElem.textContent = `₹${subtotal.toFixed(2)}`;
  if (delElem) delElem.textContent = delivery === 0 ? 'Free' : `₹${delivery.toFixed(2)}`;
  if (totElem) totElem.textContent = `₹${total.toFixed(2)}`;

  if (msgElem && progElem) {
    if (subtotal >= freeThreshold) {
      msgElem.textContent = '🎉 You unlocked Free Delivery!';
      progElem.style.width = '100%';
    } else {
      const remaining = freeThreshold - subtotal;
      msgElem.textContent = `Add ₹${remaining.toFixed(2)} more for Free Delivery!`;
      progElem.style.width = `${Math.min((subtotal / freeThreshold) * 100, 100)}%`;
    }
  }
}

function toggleCartDrawer(forceOpen = null) {
  const drawer = document.getElementById('cart-drawer');
  const overlay = document.getElementById('cart-drawer-overlay');
  if (!drawer || !overlay) return;

  const shouldOpen = forceOpen !== null ? forceOpen : drawer.classList.contains('translate-x-full');

  if (shouldOpen) {
    drawer.classList.remove('translate-x-full');
    overlay.classList.remove('opacity-0', 'pointer-events-none');
    overlay.classList.add('opacity-100', 'pointer-events-auto');
    renderCartItems();
  } else {
    drawer.classList.add('translate-x-full');
    overlay.classList.remove('opacity-100', 'pointer-events-auto');
    overlay.classList.add('opacity-0', 'pointer-events-none');
  }
}

/* ===================================================
   9. CHECKOUT & PAYMENT INTEGRATION
   =================================================== */
function openCheckoutModal() {
  if (cart.length === 0) {
    showToast("Your basket is empty!");
    return;
  }
  toggleCartDrawer(false);
  const modal = document.getElementById('modal-checkout');
  if (modal) modal.classList.add('active');
}

function closeCheckoutModal() {
  const modal = document.getElementById('modal-checkout');
  if (modal) modal.classList.remove('active');
}

let activeOrderData = null;

async function handleCheckoutSubmit(e) {
  e.preventDefault();

  const name = document.getElementById('checkout-name')?.value.trim();
  const phone = document.getElementById('checkout-phone')?.value.trim();
  const email = document.getElementById('checkout-email')?.value.trim();
  const address = document.getElementById('checkout-address')?.value.trim();
  const city = document.getElementById('checkout-city')?.value.trim();
  const state = document.getElementById('checkout-state')?.value.trim();
  const zip = document.getElementById('checkout-zip')?.value.trim();
  const method = document.querySelector('input[name="payment-method"]:checked')?.value || 'UPI_QR';

  const subtotal = cart.reduce((s, i) => s + (i.price * i.qty), 0);
  const delivery = subtotal >= 499 ? 0 : 50;
  const total = subtotal + delivery;

  const orderId = `ORD-${Date.now().toString().slice(-6)}`;

  activeOrderData = {
    id: orderId,
    customerName: name,
    customerEmail: email,
    customerPhone: phone,
    shippingAddress: { address, city, state, zip },
    items: [...cart],
    subtotal,
    deliveryFee: delivery,
    totalAmount: total,
    paymentMethod: method,
    status: 'PAID'
  };

  closeCheckoutModal();

  if (method === 'UPI_QR') {
    openUpiModal(activeOrderData);
  } else {
    // Razorpay standard checkout simulation / payload
    showToast("Opening Razorpay Secure Gateway...");
    setTimeout(() => {
      openOrderSuccessModal(activeOrderData);
      cart = [];
      saveCart();
    }, 1200);
  }
}

function openUpiModal(order) {
  const modal = document.getElementById('modal-upi-pay');
  const amtDisplay = document.getElementById('upi-amount-display');
  const qrImg = document.getElementById('upi-qr-image');
  const appLink = document.getElementById('upi-app-link');
  if (!modal) return;

  const upiUrl = `upi://pay?pa=crochetbyprisha@okhdfcbank&pn=Crochet%20by%20Prisha&am=${order.totalAmount.toFixed(2)}&cu=INR&tn=Order%20${order.id}`;

  if (amtDisplay) amtDisplay.textContent = `Amount Payable: ₹${order.totalAmount.toFixed(2)}`;
  if (qrImg) qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiUrl)}`;
  if (appLink) appLink.href = upiUrl;

  modal.classList.add('active');
}

function closeUpiModal() {
  const modal = document.getElementById('modal-upi-pay');
  if (modal) modal.classList.remove('active');
}

function simulateVerifyUpiPayment() {
  closeUpiModal();
  showToast("Verifying UPI transaction with bank gateway...");

  setTimeout(() => {
    if (activeOrderData) {
      openOrderSuccessModal(activeOrderData);
      cart = [];
      saveCart();
    }
  }, 900);
}

function openOrderSuccessModal(order) {
  const modal = document.getElementById('modal-order-success');
  const details = document.getElementById('order-success-details');
  const waBtn = document.getElementById('order-whatsapp-btn');
  if (!modal || !details) return;

  details.innerHTML = `
    <div class="flex justify-between font-bold text-[#2E252E]">
      <span>Order ID:</span>
      <span class="font-mono text-[#D88A9A]">#${order.id}</span>
    </div>
    <div class="flex justify-between">
      <span>Amount Paid:</span>
      <span class="font-bold text-[#C96554]">₹${order.totalAmount.toFixed(2)}</span>
    </div>
    <div class="flex justify-between">
      <span>Items:</span>
      <span>${order.items.reduce((s, i) => s + i.qty, 0)} handcrafted item(s)</span>
    </div>
    <div class="flex justify-between">
      <span>Deliver to:</span>
      <span class="truncate max-w-[200px]">${order.customerName}, ${order.shippingAddress.city}</span>
    </div>
    <div class="text-[10px] text-[#8A9A86] pt-1">
      Estimated Delivery: 4–6 business days. Tracking updates will be shared via WhatsApp.
    </div>
  `;

  if (waBtn) {
    const waText = encodeURIComponent(`Hi Prisha! I just placed Order #${order.id} for ₹${order.totalAmount.toFixed(2)}. Excited for my handmade crochet piece ♡`);
    waBtn.href = `https://wa.me/919876543210?text=${waText}`;
  }

  modal.classList.add('active');
}

function closeOrderSuccessModal() {
  const modal = document.getElementById('modal-order-success');
  if (modal) modal.classList.remove('active');
}

/* ===================================================
   10. ZONE RENDERING & CATALOG GRID
   =================================================== */
function renderGardenZoneProducts() {
  // Zone 2 Flowers
  const flowerBox = document.getElementById('zone-flower-products');
  if (flowerBox) {
    const flowers = products.filter(p => isFlowerProduct(p)).slice(0, 2);
    flowerBox.innerHTML = flowers.map(renderMiniProductCardHTML).join('');
  }

  // Zone 3 Cozy Corner
  const plushBox = document.getElementById('zone-plushie-products');
  if (plushBox) {
    const plushies = products.filter(p => p.category === 'cat-keychains').slice(0, 2);
    plushBox.innerHTML = plushies.map(renderMiniProductCardHTML).join('');
  }

  // Zone 4 Style Pavilion
  const styleBox = document.getElementById('zone-style-products');
  if (styleBox) {
    const styles = products.filter(p => p.category === 'cat-hair').slice(0, 2);
    styleBox.innerHTML = styles.map(renderMiniProductCardHTML).join('');
  }

  // Zone 7 Gifts
  const giftBox = document.getElementById('zone-gift-products');
  if (giftBox) {
    const gifts = products.filter(p => p.category === 'cat-hampers').slice(0, 1);
    giftBox.innerHTML = gifts.map(renderMiniProductCardHTML).join('');
  }
}

function renderMiniProductCardHTML(p) {
  const displayPrice = p.salePrice || p.price;
  return `
    <div class="bg-white/95 backdrop-blur-sm p-4 rounded-3xl border border-[#EFE4EA] shadow-sm hover:shadow-md transition text-left flex flex-col justify-between group">
      <div>
        <div class="relative rounded-2xl overflow-hidden aspect-square mb-3 cursor-pointer" onclick="openProductModal('${p.id}')">
          <img src="${p.images[0]}" alt="${p.name}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500">
          ${p.has3DModel ? `
            <span class="absolute top-2.5 right-2.5 bg-white/90 backdrop-blur-sm text-[10px] font-bold text-[#D88A9A] px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1">
              <i class="fa-solid fa-cube"></i> 3D
            </span>
          ` : ''}
        </div>
        <div class="flex items-center justify-between text-[11px] text-[#7A6B7A] mb-1">
          <span class="font-bold text-[#D88A9A]">${p.yarnType}</span>
          <span>★ ${p.rating}</span>
        </div>
        <h4 onclick="openProductModal('${p.id}')" class="font-editorial text-sm font-bold text-[#2E252E] hover:text-[#D88A9A] transition cursor-pointer line-clamp-1 mb-1">
          ${p.name}
        </h4>
        <p class="text-[11px] text-[#7A6B7A] line-clamp-2 mb-3">${p.description}</p>
      </div>

      <div class="pt-3 border-t border-[#EFE4EA] flex items-center justify-between">
        <div>
          <span class="font-editorial font-bold text-base text-[#C96554]">₹${displayPrice.toFixed(2)}</span>
          ${p.salePrice ? `<span class="text-[10px] text-[#7A6B7A] line-through ml-1">₹${p.price.toFixed(2)}</span>` : ''}
        </div>
        <button onclick="openProductModal('${p.id}')" class="btn-artisan text-[11px] !py-1.5 !px-3.5">
          <span>View 3D</span>
        </button>
      </div>
    </div>
  `;
}

function renderCatalogGrid() {
  const grid = document.getElementById('catalog-product-grid');
  if (!grid) return;

  let list = [...products];

  // 1. Category Filter
  if (currentCategoryFilter !== 'all') {
    list = list.filter(p => p.category === currentCategoryFilter);
  }

  // 2. Search Filter
  if (currentSearchQuery) {
    const q = currentSearchQuery.toLowerCase();
    list = list.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.description.toLowerCase().includes(q) ||
      (p.colors && p.colors.some(c => c.toLowerCase().includes(q)))
    );
  }

  // 3. Sorting
  if (currentSortMode === 'price-low') {
    list.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
  } else if (currentSortMode === 'price-high') {
    list.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
  } else if (currentSortMode === 'rating') {
    list.sort((a, b) => b.rating - a.rating);
  }

  if (list.length === 0) {
    grid.innerHTML = `
      <div class="col-span-full text-center py-12 text-[#7A6B7A]">
        <div class="text-3xl mb-2">🔍</div>
        <h4 class="font-bold text-sm text-[#2E252E]">No handcrafted creations found</h4>
        <p class="text-xs">Try searching for other shades or clear your filters.</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = list.map(p => {
    const displayPrice = p.salePrice || p.price;
    const isWish = wishlist.includes(p.id);

    return `
      <div class="bg-white/95 backdrop-blur-sm p-4 rounded-3xl border border-[#EFE4EA] shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between group">
        <div>
          <div class="relative rounded-2xl overflow-hidden aspect-square mb-3 cursor-pointer" onclick="openProductModal('${p.id}')">
            <img src="${p.images[0]}" alt="${p.name}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500">
            
            <button onclick="event.stopPropagation(); toggleWishlist('${p.id}')" class="absolute top-2.5 left-2.5 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm text-[#7A6B7A] hover:text-[#D88A9A] flex items-center justify-center shadow-sm transition" title="Wishlist">
              <i class="${isWish ? 'fa-solid text-[#D88A9A]' : 'fa-regular'} fa-heart text-xs"></i>
            </button>

            ${p.has3DModel ? `
              <span class="absolute top-2.5 right-2.5 bg-white/90 backdrop-blur-sm text-[10px] font-bold text-[#D88A9A] px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                <i class="fa-solid fa-cube"></i> 3D Customizer
              </span>
            ` : ''}
          </div>

          <div class="flex items-center justify-between text-[11px] text-[#7A6B7A] mb-1">
            <span class="font-bold text-[#D88A9A] uppercase tracking-wider text-[9px]">${p.yarnType}</span>
            <span class="font-bold text-[#2E252E]">★ ${p.rating} (${p.reviewsCount})</span>
          </div>

          <h3 onclick="openProductModal('${p.id}')" class="font-editorial text-base font-bold text-[#2E252E] hover:text-[#D88A9A] transition cursor-pointer line-clamp-1 mb-1">
            ${p.name}
          </h3>
          <p class="text-xs text-[#7A6B7A] line-clamp-2 mb-3">${p.description}</p>
        </div>

        <div class="pt-3 border-t border-[#EFE4EA] flex items-center justify-between">
          <div>
            <span class="font-editorial font-bold text-lg text-[#C96554]">₹${displayPrice.toFixed(2)}</span>
            ${p.salePrice ? `<span class="text-xs text-[#7A6B7A] line-through ml-1">₹${p.price.toFixed(2)}</span>` : ''}
          </div>
          
          <button onclick="openProductModal('${p.id}')" class="btn-artisan text-xs !py-2 !px-4">
            <i class="fa-solid fa-wand-magic-sparkles"></i> Customize
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function filterShopByCategory(catId) {
  currentCategoryFilter = catId;
  document.querySelectorAll('.cat-filter-btn').forEach(btn => {
    btn.classList.remove('bg-[#D88A9A]', 'text-white', 'border-[#D88A9A]');
    btn.classList.add('bg-white', 'text-[#2E252E]', 'border-[#EFE4EA]');
  });
  if (event && event.currentTarget) {
    event.currentTarget.classList.add('bg-[#D88A9A]', 'text-white', 'border-[#D88A9A]');
  }
  renderCatalogGrid();
}

function handleCatalogSearch(val) {
  currentSearchQuery = val.trim();
  renderCatalogGrid();
}

function handleCatalogSort(val) {
  currentSortMode = val;
  renderCatalogGrid();
}

function scrollToGardenZone(zoneId) {
  const elem = document.getElementById(zoneId);
  if (elem) {
    elem.scrollIntoView({ behavior: 'smooth' });
  }
}

/* ===================================================
   11. CUSTOM ORDER ENQUIRY & TRACKING
   =================================================== */
function openCustomOrderModal() {
  const modal = document.getElementById('modal-custom-order');
  if (modal) modal.classList.add('active');
}

function closeCustomOrderModal() {
  const modal = document.getElementById('modal-custom-order');
  if (modal) modal.classList.remove('active');
}

function handleCustomOrderSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('custom-name')?.value;
  const productType = document.getElementById('custom-product-type')?.value;
  closeCustomOrderModal();

  showToast(`Thank you ${name}! Your bespoke request for "${productType}" has been sent to Prisha ♡`);
}

function openTrackOrderModal() {
  const modal = document.getElementById('modal-track-order');
  if (modal) modal.classList.add('active');
}

function closeTrackOrderModal() {
  const modal = document.getElementById('modal-track-order');
  if (modal) modal.classList.remove('active');
}

function trackOrder() {
  const val = document.getElementById('track-order-input')?.value.trim();
  const res = document.getElementById('track-order-result');
  if (!val || !res) return;

  res.classList.remove('hidden');
  res.innerHTML = `
    <div class="p-3 bg-[#FFF7FA] rounded-xl border border-[#D88A9A]/30">
      <div class="flex justify-between font-bold">
        <span>Order #${val}</span>
        <span class="text-[#8A9A86]">HANDCRAFTING</span>
      </div>
      <p class="text-[11px] text-[#7A6B7A] mt-1">
        Prisha is currently crocheting your items with love. Estimated dispatch in 24–48 hours.
      </p>
    </div>
  `;
}

function openPolicyModal(type) {
  const modal = document.getElementById('modal-policy');
  const content = document.getElementById('policy-modal-content');
  if (!modal || !content) return;

  if (type === 'shipping') {
    content.innerHTML = `
      <h3 class="font-editorial text-xl font-bold text-[#2E252E] mb-2">Shipping &amp; Delivery Policy</h3>
      <p>• <strong>Free Shipping:</strong> On all orders above ₹499 across India.</p>
      <p>• <strong>Standard Shipping:</strong> Flat ₹50 for orders below ₹499.</p>
      <p>• <strong>Handcrafting Timeline:</strong> Every item is made to order by hand. Please allow 2–4 business days for crafting before dispatch.</p>
      <p>• <strong>Delivery Courier:</strong> Shipped via premium air couriers (Bluedart, Delhivery, DTDC) with tracking updates sent to your WhatsApp and email.</p>
    `;
  } else if (type === 'returns') {
    content.innerHTML = `
      <h3 class="font-editorial text-xl font-bold text-[#2E252E] mb-2">Return &amp; Refund Policy</h3>
      <p>Because each piece is uniquely hand-hooked and custom made, we do not accept general returns or exchanges once shipped.</p>
      <p>• In the rare event of transit damage, please share an unboxing video within 24 hours of delivery to <strong>crochetbyprisha@gmail.com</strong> or WhatsApp, and we will happily remake or refund your piece immediately.</p>
    `;
  } else if (type === 'care') {
    content.innerHTML = `
      <h3 class="font-editorial text-xl font-bold text-[#2E252E] mb-2">Crochet Care Instructions</h3>
      <p>• <strong>Material:</strong> 100% natural combed milk cotton yarn.</p>
      <p>• <strong>Washing:</strong> Spot clean or hand wash gently in cool water with mild wool detergent.</p>
      <p>• <strong>Drying:</strong> Do not wring or tumble dry. Pat with dry towel and lay flat in shade to dry.</p>
      <p>• <strong>Longevity:</strong> Never wilts, bleaches, or rots. Keep away from pet claws and open flames.</p>
    `;
  } else {
    content.innerHTML = `
      <h3 class="font-editorial text-xl font-bold text-[#2E252E] mb-2">Privacy &amp; Terms</h3>
      <p>Your privacy is strictly respected. Customer contact details and shipping addresses are only used for order fulfillment and WhatsApp dispatch notifications.</p>
    `;
  }

  modal.classList.add('active');
}

function closePolicyModal() {
  const modal = document.getElementById('modal-policy');
  if (modal) modal.classList.remove('active');
}

function toggleWishlist(productId) {
  const idx = wishlist.indexOf(productId);
  if (idx > -1) {
    wishlist.splice(idx, 1);
    showToast("Removed from wishlist");
  } else {
    wishlist.push(productId);
    showToast("Added to your wishlist ♡");
  }
  localStorage.setItem('sp_wishlist', JSON.stringify(wishlist));
  updateWishlistBadge();
  renderCatalogGrid();
}

function updateWishlistBadge() {
  const badge = document.getElementById('wishlist-badge');
  if (badge) {
    badge.textContent = wishlist.length;
    if (wishlist.length > 0) badge.classList.remove('hidden');
    else badge.classList.add('hidden');
  }
}

function toggleWishlistDrawer() {
  if (wishlist.length === 0) {
    showToast("Your wishlist is empty. Tap ♡ on any piece to save it!");
    return;
  }
  scrollToGardenZone('section-shop');
}

function toggleMobileNav() {
  // Mobile drawer or simple scroll
  scrollToGardenZone('section-shop');
}

function showToast(msg) {
  const existing = document.getElementById('prisha-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.id = 'prisha-toast';
  toast.className = 'fixed bottom-6 left-1/2 -translate-x-1/2 z-[999999] bg-[#2E252E] text-white px-5 py-3 rounded-full text-xs font-bold shadow-2xl flex items-center gap-2 border border-white/20 transition-all duration-300';
  toast.innerHTML = `<span>🌸</span> <span>${msg}</span>`;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translate(-50%, 15px)';
    setTimeout(() => toast.remove(), 350);
  }, 2800);
}

// Deep Link handler
function checkDeepLinkProduct() {
  const params = new URLSearchParams(window.location.search);
  const prodId = params.get('product') || (window.location.hash.startsWith('#product-') ? window.location.hash.replace('#product-', '') : null);
  if (prodId) {
    openProductModal(prodId);
  }
}

/* ===================================================
   INITIALIZATION LIFECYCLE
   =================================================== */
document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Cinematic Curtains
  initCinematicCurtains();

  // 2. Initialize 3D Living Crochet World
  init3DCrochetWorld();

  // 3. Initialize Zone 5 Studio
  setTimeout(() => {
    initStudio3DCanvas();
  }, 300);

  // 4. Render Zone Overlays and Catalog Grid
  renderGardenZoneProducts();
  renderCatalogGrid();
  updateCartBadges();
  updateWishlistBadge();

  // 5. Deep Link Check
  checkDeepLinkProduct();
});
