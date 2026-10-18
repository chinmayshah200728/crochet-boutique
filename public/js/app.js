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
   1. PROCEDURAL YARN STITCH TEXTURE GENERATOR
   =================================================== */
let cachedYarnBumpTexture = null;

function getCrochetYarnBumpTexture() {
  if (cachedYarnBumpTexture) return cachedYarnBumpTexture;
  if (typeof THREE === 'undefined') return null;

  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  // Fill neutral mid-grey
  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, 256, 256);

  // Draw procedural interlocking crochet/knit purl stitches
  const rowHeight = 16;
  const colWidth = 16;

  for (let y = 0; y < 256; y += rowHeight) {
    const isOdd = (y / rowHeight) % 2 === 1;
    const xOffset = isOdd ? colWidth / 2 : 0;

    for (let x = -colWidth; x < 256 + colWidth; x += colWidth) {
      const cx = x + xOffset;
      const cy = y;

      // Highlight loop
      ctx.beginPath();
      ctx.arc(cx, cy, 7, 0, Math.PI, false);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.lineWidth = 3.5;
      ctx.stroke();

      // Shadow loop
      ctx.beginPath();
      ctx.arc(cx, cy + 4, 7, Math.PI, 0, false);
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.lineWidth = 3.5;
      ctx.stroke();

      // Micro fibrous grain
      ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
      ctx.fillRect(cx - 2, cy - 2, 4, 4);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(8, 8);
  cachedYarnBumpTexture = texture;
  return texture;
}

function createCrochetMaterial(colorHex, roughness = 0.88, metalness = 0.04) {
  const bump = getCrochetYarnBumpTexture();
  return new THREE.MeshStandardMaterial({
    color: colorHex,
    roughness: roughness,
    metalness: metalness,
    bumpMap: bump,
    bumpScale: 0.035
  });
}

/* ===================================================
   2. THREE.JS LIVING CROCHET WORLD ENGINE
   =================================================== */
let worldScene, worldCamera, worldRenderer;
let worldFlowers = [];
let worldClouds = [];
let worldButterflies = [];
let worldYarnBalls = [];
let worldStars = [];
let isWorldActive = false;
let scrollProgress = 0;
let targetScrollProgress = 0;

// Camera waypoints along the garden spline path
const GARDEN_WAYPOINTS = [
  { pos: new THREE.Vector3(0, 3.8, 16), target: new THREE.Vector3(0, 1.8, 0) },     // 1. Meadow
  { pos: new THREE.Vector3(-3.2, 2.6, 11), target: new THREE.Vector3(-0.8, 1.6, 5) },// 2. Flowers
  { pos: new THREE.Vector3(3.6, 2.2, 6), target: new THREE.Vector3(1.5, 1.3, 1) },   // 3. Cozy
  { pos: new THREE.Vector3(-3.0, 2.8, 0), target: new THREE.Vector3(-0.5, 1.8, -4) },// 4. Style
  { pos: new THREE.Vector3(0, 3.2, -5), target: new THREE.Vector3(0, 1.4, -9) },    // 5. Studio
  { pos: new THREE.Vector3(3.2, 2.4, -10), target: new THREE.Vector3(0.8, 1.8, -14) },// 6. Maker
  { pos: new THREE.Vector3(0, 2.8, -15), target: new THREE.Vector3(0, 1.2, -19) }   // 7. Gifts
];

function init3DCrochetWorld() {
  const canvas = document.getElementById('crochet-world-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const width = window.innerWidth;
  const height = window.innerHeight;

  worldScene = new THREE.Scene();
  worldScene.fog = new THREE.FogExp2(0xF5EFEB, 0.028);

  worldCamera = new THREE.PerspectiveCamera(46, width / height, 0.1, 100);
  worldCamera.position.copy(GARDEN_WAYPOINTS[0].pos);

  worldRenderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance'
  });
  worldRenderer.setSize(width, height);
  worldRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  worldRenderer.shadowMap.enabled = true;
  worldRenderer.shadowMap.type = THREE.PCFSoftShadowMap;

  // Warm Golden Sun & Soft Fill Lights
  const ambientLight = new THREE.AmbientLight(0xFFF7F2, 1.15);
  worldScene.add(ambientLight);

  const sunLight = new THREE.DirectionalLight(0xFFF0D6, 1.35);
  sunLight.position.set(12, 22, 14);
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.width = 1024;
  sunLight.shadow.mapSize.height = 1024;
  sunLight.shadow.bias = -0.0005;
  worldScene.add(sunLight);

  const fillLight = new THREE.DirectionalLight(0xD88A9A, 0.55);
  fillLight.position.set(-14, 10, -8);
  worldScene.add(fillLight);

  // Build Woven Landscape Terrain
  buildWovenLandscape();

  // Build Animated Garden Elements
  buildGardenFlowers();
  buildKnittedClouds();
  buildAnimatedButterflies();
  buildInteractiveYarnBalls();
  buildSuspendedStars();

  // Setup Scroll & Pointer Listeners
  setupWorldEventListeners();

  isWorldActive = true;
  animateCrochetWorld();
}

function buildWovenLandscape() {
  // Rolling sage green yarn ground
  const groundGeom = new THREE.PlaneGeometry(70, 70, 48, 48);
  groundGeom.rotateX(-Math.PI / 2);

  const pos = groundGeom.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const z = pos.getZ(i);
    // Soft organic rolling waves
    const y = Math.sin(x * 0.14) * 0.9 + Math.cos(z * 0.12) * 0.7 - (z * 0.08);
    pos.setY(i, y);
  }
  groundGeom.computeVertexNormals();

  const groundMat = createCrochetMaterial(0x8A9A86, 0.92);
  const groundMesh = new THREE.Mesh(groundGeom, groundMat);
  groundMesh.position.set(0, -0.6, 0);
  groundMesh.receiveShadow = true;
  worldScene.add(groundMesh);

  // Curved Woven Pathway (tube curve)
  const pathCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0.1, 16),
    new THREE.Vector3(-1.8, 0.15, 11),
    new THREE.Vector3(1.6, 0.12, 6),
    new THREE.Vector3(-1.4, 0.18, 0),
    new THREE.Vector3(0, 0.14, -5),
    new THREE.Vector3(1.4, 0.16, -10),
    new THREE.Vector3(0, 0.1, -16)
  ]);

  const pathGeom = new THREE.TubeGeometry(pathCurve, 64, 0.55, 10, false);
  const pathMat = createCrochetMaterial(0xF5EFEB, 0.88);
  const pathMesh = new THREE.Mesh(pathGeom, pathMat);
  pathMesh.receiveShadow = true;
  worldScene.add(pathMesh);
}

function buildGardenFlowers() {
  worldFlowers = [];

  const flowerPositions = [
    { x: -2.8, z: 12, type: 'tulip', color: 0xE89CAE },
    { x: -1.2, z: 13, type: 'rose', color: 0xC94A5B },
    { x: 2.2, z: 10, type: 'sunflower', color: 0xF9E79F },
    { x: 3.5, z: 8, type: 'daisy', color: 0xFAF9F6 },
    { x: -3.6, z: 2, type: 'tulip', color: 0xB8A1D9 },
    { x: -1.8, z: -2, type: 'daisy', color: 0xF9E79F },
    { x: 2.4, z: -7, type: 'rose', color: 0xE89CAE },
    { x: -2.2, z: -12, type: 'sunflower', color: 0xF9E79F },
    { x: 2.0, z: -14, type: 'tulip', color: 0xB8A1D9 }
  ];

  flowerPositions.forEach((fp, idx) => {
    const flowerGroup = new THREE.Group();
    flowerGroup.position.set(fp.x, 0, fp.z);

    // Stem
    const stemGeom = new THREE.CylinderGeometry(0.04, 0.05, 1.4, 8);
    const stemMat = createCrochetMaterial(0x8A9A86, 0.85);
    const stemMesh = new THREE.Mesh(stemGeom, stemMat);
    stemMesh.position.y = 0.7;
    stemMesh.castShadow = true;
    flowerGroup.add(stemMesh);

    // Blossom
    const bloomGeom = new THREE.SphereGeometry(0.38, 14, 14);
    bloomGeom.scale(1, 1.3, 1);
    const bloomMat = createCrochetMaterial(fp.color, 0.82);
    const bloomMesh = new THREE.Mesh(bloomGeom, bloomMat);
    bloomMesh.position.y = 1.45;
    bloomMesh.castShadow = true;
    flowerGroup.add(bloomMesh);

    flowerGroup.userData = {
      baseX: fp.x,
      swayOffset: idx * 0.8,
      speed: 1.4 + (idx % 3) * 0.3
    };

    worldScene.add(flowerGroup);
    worldFlowers.push(flowerGroup);
  });
}

function buildKnittedClouds() {
  worldClouds = [];
  const cloudMat = createCrochetMaterial(0xFFFAF7, 0.95);

  for (let i = 0; i < 7; i++) {
    const cloudGroup = new THREE.Group();
    const puffCount = 5;

    for (let p = 0; p < puffCount; p++) {
      const radius = 1.0 + Math.random() * 0.8;
      const puffGeom = new THREE.SphereGeometry(radius, 12, 12);
      const puffMesh = new THREE.Mesh(puffGeom, cloudMat);
      puffMesh.position.set(
        (p - 2) * 0.9 + (Math.random() - 0.5) * 0.4,
        (Math.random() - 0.5) * 0.3,
        (Math.random() - 0.5) * 0.5
      );
      cloudGroup.add(puffMesh);
    }

    cloudGroup.position.set(
      -25 + Math.random() * 50,
      7 + Math.random() * 3,
      -18 + Math.random() * 34
    );

    cloudGroup.userData = {
      speed: 0.18 + Math.random() * 0.22
    };

    worldScene.add(cloudGroup);
    worldClouds.push(cloudGroup);
  }
}

function buildAnimatedButterflies() {
  worldButterflies = [];

  const butterflyColors = [0xE89CAE, 0xB8A1D9, 0xF9E79F];

  for (let b = 0; b < 3; b++) {
    const bGroup = new THREE.Group();

    // Wings
    const wingGeom = new THREE.CircleGeometry(0.24, 8);
    const wingMat = createCrochetMaterial(butterflyColors[b], 0.8);

    const leftWing = new THREE.Mesh(wingGeom, wingMat);
    leftWing.position.x = -0.15;
    leftWing.rotation.y = 0.3;
    bGroup.add(leftWing);

    const rightWing = new THREE.Mesh(wingGeom, wingMat);
    rightWing.position.x = 0.15;
    rightWing.rotation.y = -0.3;
    bGroup.add(rightWing);

    bGroup.position.set(
      -2 + b * 2,
      2.0 + b * 0.5,
      8 - b * 6
    );

    bGroup.userData = {
      leftWing,
      rightWing,
      offset: b * 2,
      basePos: bGroup.position.clone()
    };

    worldScene.add(bGroup);
    worldButterflies.push(bGroup);
  }
}

function buildInteractiveYarnBalls() {
  worldYarnBalls = [];
  const yarnColors = [0xE89CAE, 0xB8A1D9, 0xF9E79F, 0x8A9A86, 0xC94A5B];

  const ballCoords = [
    { x: 1.8, y: 0.35, z: 13 },
    { x: -2.2, y: 0.32, z: 8 },
    { x: 2.8, y: 0.38, z: 3 },
    { x: -1.6, y: 0.34, z: -3 },
    { x: 1.5, y: 0.36, z: -9 }
  ];

  ballCoords.forEach((bc, idx) => {
    const ballGeom = new THREE.SphereGeometry(0.36, 16, 16);
    const ballMat = createCrochetMaterial(yarnColors[idx % yarnColors.length], 0.88);
    const ballMesh = new THREE.Mesh(ballGeom, ballMat);
    ballMesh.position.set(bc.x, bc.y, bc.z);
    ballMesh.castShadow = true;
    ballMesh.userData = {
      basePos: ballMesh.position.clone(),
      velocity: new THREE.Vector3(),
      wobbleAngle: 0
    };

    worldScene.add(ballMesh);
    worldYarnBalls.push(ballMesh);
  });
}

function buildSuspendedStars() {
  worldStars = [];
  const starMat = createCrochetMaterial(0xF9E79F, 0.7);

  for (let s = 0; s < 6; s++) {
    const starGeom = new THREE.OctahedronGeometry(0.24, 0);
    const starMesh = new THREE.Mesh(starGeom, starMat);
    starMesh.position.set(
      -4 + s * 1.6,
      4.5 + Math.sin(s) * 0.4,
      12 - s * 5
    );
    starMesh.userData = {
      angle: s * 1.2
    };

    worldScene.add(starMesh);
    worldStars.push(starMesh);
  }
}

function setupWorldEventListeners() {
  window.addEventListener('scroll', onWindowScroll, { passive: true });
  window.addEventListener('resize', onWindowResize);
  window.addEventListener('pointermove', onPointerMoveWorld, { passive: true });
  document.addEventListener('visibilitychange', onVisibilityChange);
}

function onWindowScroll() {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  if (maxScroll <= 0) return;
  targetScrollProgress = Math.min(Math.max(window.scrollY / maxScroll, 0), 1);
}

function onWindowResize() {
  if (!worldRenderer || !worldCamera) return;
  const width = window.innerWidth;
  const height = window.innerHeight;
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

// Interactive pointer physics reaction with yarn balls
let mouse3D = new THREE.Vector2(-999, -999);
const raycaster = new THREE.Raycaster();

function onPointerMoveWorld(e) {
  mouse3D.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse3D.y = -(e.clientY / window.innerHeight) * 2 + 1;
}

const clock = new THREE.Clock();

function animateCrochetWorld() {
  if (!isWorldActive) return;
  requestAnimationFrame(animateCrochetWorld);

  const delta = clock.getDelta();
  const time = clock.getElapsedTime();

  // 1. Smooth Camera Spline Tracking
  scrollProgress += (targetScrollProgress - scrollProgress) * 0.08;
  const waypointIndex = scrollProgress * (GARDEN_WAYPOINTS.length - 1);
  const baseIndex = Math.floor(waypointIndex);
  const nextIndex = Math.min(baseIndex + 1, GARDEN_WAYPOINTS.length - 1);
  const blend = waypointIndex - baseIndex;

  const currentCamPos = new THREE.Vector3().lerpVectors(
    GARDEN_WAYPOINTS[baseIndex].pos,
    GARDEN_WAYPOINTS[nextIndex].pos,
    blend
  );

  const currentCamTarget = new THREE.Vector3().lerpVectors(
    GARDEN_WAYPOINTS[baseIndex].target,
    GARDEN_WAYPOINTS[nextIndex].target,
    blend
  );

  worldCamera.position.copy(currentCamPos);
  worldCamera.lookAt(currentCamTarget);

  // 2. Animated Swaying Flowers
  worldFlowers.forEach(fg => {
    const sway = Math.sin(time * fg.userData.speed + fg.userData.swayOffset);
    fg.rotation.z = sway * 0.08;
    fg.rotation.x = Math.cos(time * 1.1 + fg.userData.swayOffset) * 0.05;
  });

  // 3. Drifting Knitted Clouds
  worldClouds.forEach(cg => {
    cg.position.x += cg.userData.speed * delta * 2.2;
    if (cg.position.x > 32) cg.position.x = -32;
  });

  // 4. Fluttering Butterflies
  worldButterflies.forEach(bg => {
    const wingAngle = Math.sin(time * 14 + bg.userData.offset) * 0.75;
    bg.userData.leftWing.rotation.y = wingAngle;
    bg.userData.rightWing.rotation.y = -wingAngle;

    const u = time * 0.8 + bg.userData.offset;
    bg.position.x = bg.userData.basePos.x + Math.sin(u) * 1.4;
    bg.position.y = bg.userData.basePos.y + Math.cos(u * 1.6) * 0.4;
    bg.position.z = bg.userData.basePos.z + Math.cos(u * 0.7) * 1.2;
  });

  // 5. Interactive Yarn Balls Reaction
  worldYarnBalls.forEach(yb => {
    // Idle soft breathing wobble
    yb.rotation.y += 0.005;
    yb.rotation.x += 0.003;

    // Pointer proximity tilt
    const screenPos = yb.position.clone().project(worldCamera);
    const dist = Math.hypot(screenPos.x - mouse3D.x, screenPos.y - mouse3D.y);

    if (dist < 0.35) {
      yb.rotation.x += (Math.random() - 0.5) * 0.1;
      yb.rotation.z += (Math.random() - 0.5) * 0.1;
      yb.position.y = yb.userData.basePos.y + Math.sin(time * 10) * 0.06;
    } else {
      yb.position.y += (yb.userData.basePos.y - yb.position.y) * 0.1;
    }
  });

  // 6. Suspended Stars Pendulum Motion
  worldStars.forEach(st => {
    st.rotation.y += 0.01;
    st.rotation.z = Math.sin(time * 2.0 + st.userData.angle) * 0.12;
  });

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
  if (badge1) badge1.textContent = totalCount;
  if (badge2) badge2.textContent = totalCount;
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
