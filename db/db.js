const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'data.json');

const INITIAL_DATA = {
  users: [
    {
      id: "usr-admin",
      name: "Studio Admin",
      email: "admin@stitchandpetal.com",
      passwordHash: "$2a$10$wE.gJ3zS3sW4P8rLqLqZ0eD0YxW1x9j0X.p8p.W8W.W8W.W8W.W8W", // password: admin123 (hashed or fallback check)
      role: "admin",
      phone: "+1 (555) 019-2831",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      addresses: [
        { id: "addr-1", title: "Studio HQ", name: "Stitch & Petal Studio", address: "742 Evergreen Terrace", city: "Portland", state: "OR", zip: "97201", country: "USA", default: true }
      ]
    },
    {
      id: "usr-customer1",
      name: "Emma Watson",
      email: "emma@example.com",
      passwordHash: "$2a$10$wE.gJ3zS3sW4P8rLqLqZ0eD0YxW1x9j0X.p8p.W8W.W8W.W8W.W8W",
      role: "customer",
      phone: "+1 (555) 234-5678",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
      addresses: [
        { id: "addr-2", title: "Home", name: "Emma Watson", address: "124 Rosewood Lane", city: "Seattle", state: "WA", zip: "98101", country: "USA", default: true }
      ]
    }
  ],
  categories: [
    { id: "cat-flowers", name: "Flowers & Bouquets", slug: "flowers", icon: "💐", image: "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?auto=format&fit=crop&w=600&q=80", description: "Eternal handmade crochet floral arrangements that never wilt." },
    { id: "cat-plushies", name: "Amigurumi Plushies", slug: "plushies", icon: "🧸", image: "https://images.unsplash.com/photo-1558679908-541bcf1249ff?auto=format&fit=crop&w=600&q=80", description: "Soft, velvet-yarn cuddly friends stitched with love." },
    { id: "cat-bags", name: "Bags & Totes", slug: "bags", icon: "👜", image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=600&q=80", description: "Stylish granny-square & textured crochet bags." },
    { id: "cat-keychains", name: "Keychains & Charms", slug: "keychains", icon: "🔑", image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=600&q=80", description: "Pocket-sized crochet cuteness for your bags & keys." },
    { id: "cat-decor", name: "Home Décor & Plants", slug: "decor", icon: "🪴", image: "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80", description: "Crochet succulents, wall hangings, and coaster sets." },
    { id: "cat-gifts", name: "Gifts & Occasions", slug: "gifts", icon: "🎁", image: "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=600&q=80", description: "Curated gift bundles for birthdays, anniversaries & holidays." }
  ],
  products: [
    {
      id: "prod-1",
      name: "Pastel Dream 9-Stem Rose & Daisy Bouquet",
      slug: "pastel-dream-bouquet",
      category: "cat-flowers",
      price: 54.99,
      salePrice: 48.99,
      isSale: true,
      isBestseller: true,
      isNew: false,
      rating: 4.9,
      reviewsCount: 38,
      stock: 14,
      yarnType: "Soft Combed Milk Cotton",
      dimensions: "16\" Height x 10\" Width",
      colors: ["Dusty Pink & White", "Lavender & Cream", "Peach & Sage"],
      description: "Our signature bouquet featuring 5 hand-stitched blush roses, 4 fluffy daisies, and eucalyptus foliage wrapped in craft parchment paper and tied with a silk ribbon. Guaranteed to stay fresh forever!",
      images: [
        "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=800&q=80"
      ],
      customization: {
        allowColorPicker: true,
        allowCustomText: true,
        textLabel: "Gift Card Message (Included)",
        customTextPrice: 0
      }
    },
    {
      id: "prod-2",
      name: "Mochi the Soft Velvet Strawberry Cow",
      slug: "mochi-strawberry-cow",
      category: "cat-plushies",
      price: 38.00,
      salePrice: null,
      isSale: false,
      isBestseller: true,
      isNew: true,
      rating: 5.0,
      reviewsCount: 52,
      stock: 9,
      yarnType: "Ultra Plush Velvet Chenille",
      dimensions: "9\" x 7.5\" x 8\"",
      colors: ["Blush Pink & White", "Matcha Green & Cream", "Lavender & Milk"],
      description: "Handcrafted from velvety chenille yarn, Mochi features cute rosy spots, soft horns, and a stitched strawberry tag. Hypoallergenic and incredibly soft to cuddle.",
      images: [
        "https://images.unsplash.com/photo-1558679908-541bcf1249ff?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=800&q=80"
      ],
      customization: {
        allowColorPicker: true,
        allowCustomText: true,
        textLabel: "Embroidered Monogram Initials",
        customTextPrice: 4.00
      }
    },
    {
      id: "prod-3",
      name: "Vintage Sunburst Daisy Granny Square Bag",
      slug: "sunburst-daisy-bag",
      category: "cat-bags",
      price: 64.50,
      salePrice: 58.00,
      isSale: true,
      isBestseller: true,
      isNew: false,
      rating: 4.8,
      reviewsCount: 29,
      stock: 6,
      yarnType: "100% Organic Cotton Yarn",
      dimensions: "13\" x 13\" (Strap drop 11\")",
      colors: ["Terracotta & Mustard", "Sage & Cream", "Black & Sunflower"],
      description: "Artisanal shoulder bag composed of 13 hand-crocheted sunflower granny squares. Lined with sturdy natural linen canvas featuring an inner pocket and magnetic button closure.",
      images: [
        "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80"
      ],
      customization: {
        allowColorPicker: true,
        allowCustomText: false
      }
    },
    {
      id: "prod-4",
      name: "Chubby Bumblebee Keychain Trio",
      slug: "bumblebee-keychain-trio",
      category: "cat-keychains",
      price: 18.99,
      salePrice: null,
      isSale: false,
      isBestseller: false,
      isNew: true,
      rating: 4.9,
      reviewsCount: 44,
      stock: 22,
      yarnType: "Fine Cotton Thread",
      dimensions: "2.5\" x 2\" each",
      colors: ["Honey Yellow", "Baby Blue Bee", "Pink Pastel Bee"],
      description: "Set of 3 adorable mini bumblebees complete with silver keyrings, cute blush cheeks, and translucent wings. Perfect gift for besties or bag charm enthusiasts!",
      images: [
        "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80"
      ],
      customization: {
        allowColorPicker: true,
        allowCustomText: true,
        textLabel: "Custom Charm Name Tag",
        customTextPrice: 2.50
      }
    },
    {
      id: "prod-5",
      name: "No-Water Potted Monstera & Succulent Set",
      slug: "crochet-potted-monstera",
      category: "cat-decor",
      price: 42.00,
      salePrice: null,
      isSale: false,
      isBestseller: false,
      isNew: true,
      rating: 5.0,
      reviewsCount: 17,
      stock: 11,
      yarnType: "Mercerized Cotton & Terracotta Pot",
      dimensions: "7\" Height x 5\" Width",
      colors: ["Deep Forest Green", "Variegated Sage"],
      description: "Evergreen potted Monstera Deliciosa in a real mini terracotta clay pot. Zero watering, zero sunlight needed, 100% cozy desk plant aesthetic.",
      images: [
        "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=800&q=80"
      ],
      customization: {
        allowColorPicker: false,
        allowCustomText: true,
        textLabel: "Custom Engraved Clay Pot Text",
        customTextPrice: 3.50
      }
    },
    {
      id: "prod-6",
      name: "Forever Sunflower Single Stem in Glass Vase",
      slug: "sunflower-single-stem",
      category: "cat-flowers",
      price: 22.50,
      salePrice: 19.99,
      isSale: true,
      isBestseller: false,
      isNew: false,
      rating: 4.7,
      reviewsCount: 23,
      stock: 18,
      yarnType: "Milk Cotton Yarn",
      dimensions: "14\" Stem Height",
      colors: ["Golden Yellow", "Warm Amber"],
      description: "A single radiant sunflower crafted with golden petals and textured center seeds, complete with wired stem and green leaves. Comes in a sleek glass vase.",
      images: [
        "https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&w=800&q=80"
      ],
      customization: {
        allowColorPicker: true,
        allowCustomText: true,
        textLabel: "Gift Note Tag",
        customTextPrice: 0
      }
    }
  ],
  reviews: [
    {
      id: "rev-1",
      productId: "prod-1",
      customerName: "Sophia Martinez",
      rating: 5,
      date: "2026-09-24",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
      comment: "I gave this pastel bouquet to my sister for her birthday and she literally cried! The craftsmanship is top tier, and it looks even better than real flowers."
    },
    {
      id: "rev-2",
      productId: "prod-2",
      customerName: "Lucas Chen",
      rating: 5,
      date: "2026-09-20",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
      comment: "Mochi the strawberry cow is so unbelievably squishy and soft. Shipped very fast in a cute box with stickers!"
    }
  ],
  coupons: [
    { code: "WELCOME10", discountPercent: 10, minSpend: 0, expires: "2027-12-31" },
    { code: "FLOWER15", discountPercent: 15, minSpend: 40, expires: "2027-12-31" },
    { code: "FREESHIP", discountPercent: 0, freeShipping: true, minSpend: 30, expires: "2027-12-31" }
  ],
  orders: [
    {
      id: "ORD-8821",
      userId: "usr-customer1",
      customerName: "Emma Watson",
      customerEmail: "emma@example.com",
      phone: "+1 (555) 234-5678",
      date: "2026-09-28",
      items: [
        { productId: "prod-1", name: "Pastel Dream 9-Stem Rose & Daisy Bouquet", price: 48.99, qty: 1, color: "Dusty Pink & White", customText: "Happy Birthday Emma!" }
      ],
      subtotal: 48.99,
      shipping: 0.00,
      tax: 3.92,
      total: 52.91,
      status: "Handed to Courier",
      trackingNumber: "TRK-99201482US",
      courier: "FedEx Express",
      shippingAddress: {
        address: "124 Rosewood Lane", city: "Seattle", state: "WA", zip: "98101", country: "USA"
      },
      paymentMethod: "Credit Card (Visa •••• 4242)",
      timeline: [
        { status: "Order Placed", date: "2026-09-28 10:15 AM", done: true },
        { status: "Payment Confirmed", date: "2026-09-28 10:16 AM", done: true },
        { status: "Preparing Your Order", date: "2026-09-29 02:30 PM", done: true },
        { status: "Handed to Courier", date: "2026-09-30 09:00 AM", done: true },
        { status: "Out for Delivery", date: "Pending", done: false },
        { status: "Delivered", date: "Pending", done: false }
      ]
    }
  ],
  customOrders: [
    {
      id: "CUST-3041",
      customerName: "Claire Dupont",
      customerEmail: "claire@example.com",
      phone: "+1 (555) 888-1212",
      productType: "Bridal Bouquet",
      colors: "Cream, Peach, Eucalpytus Sage, Terracotta accent",
      size: "Large (15 stems)",
      quantity: 1,
      budget: "$90 - $120",
      eventDate: "2026-11-15",
      description: "Custom bridal bouquet for autumn wedding with matching groom boutonniere.",
      imageUrl: "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=600&q=80",
      status: "Quote Sent",
      quotedPrice: 110.00,
      adminNotes: "Yarn reserved in dusty peach & sage. Ready to start upon approval.",
      createdAt: "2026-09-27"
    }
  ],
  supportTickets: [
    {
      id: "TCK-102",
      customerName: "David Miller",
      customerEmail: "david@example.com",
      orderId: "ORD-8821",
      subject: "Custom Yarn Color Request",
      message: "Can I request a custom blue shade for the strawberry cow plushie?",
      status: "Open",
      replies: [
        { sender: "Admin", date: "2026-09-29 11:20 AM", text: "Hi David! Yes, we have Sky Blue and Baby Blue available. Feel free to specify in custom notes!" }
      ],
      createdAt: "2026-09-29"
    }
  ]
};

function readDb() {
  try {
    let data;
    if (!fs.existsSync(DB_PATH)) {
      data = JSON.parse(JSON.stringify(INITIAL_DATA));
      fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
    } else {
      const raw = fs.readFileSync(DB_PATH, 'utf-8');
      data = JSON.parse(raw);
    }
    // Ensure all required collections exist
    if (!data.auditLogs) data.auditLogs = [];
    if (!data.inventoryLogs) data.inventoryLogs = [];
    if (!data.payments) data.payments = [];
    if (!data.webhookEvents) data.webhookEvents = [];
    if (!data.refunds) data.refunds = [];
    return data;
  } catch (err) {
    console.error('Error reading data.json:', err);
    return INITIAL_DATA;
  }
}

function writeDb(data) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error writing data.json:', err);
  }
}

function logAudit(adminUser, action, entity, details, ip = '127.0.0.1') {
  try {
    const db = readDb();
    const entry = {
      id: `audit-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      adminId: adminUser ? adminUser.id : 'system',
      adminName: adminUser ? adminUser.name : 'System',
      adminEmail: adminUser ? adminUser.email : 'system@crochetbyprisha.com',
      role: adminUser ? adminUser.role : 'system',
      action: action,
      entity: entity,
      details: details,
      ip: ip,
      timestamp: new Date().toISOString()
    };
    db.auditLogs.unshift(entry);
    // Keep max 500 audit logs
    if (db.auditLogs.length > 500) db.auditLogs = db.auditLogs.slice(0, 500);
    writeDb(db);
    return entry;
  } catch (err) {
    console.error('Failed to log audit:', err);
  }
}

function logInventory(productId, productName, sku, changeQty, newStock, reason, adminUser) {
  try {
    const db = readDb();
    const entry = {
      id: `inv-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      productId,
      productName,
      sku: sku || 'N/A',
      changeQty: parseInt(changeQty, 10),
      newStock: parseInt(newStock, 10),
      reason: reason || 'Manual adjustment',
      adminName: adminUser ? adminUser.name : 'System',
      adminEmail: adminUser ? adminUser.email : 'system',
      timestamp: new Date().toISOString()
    };
    db.inventoryLogs.unshift(entry);
    if (db.inventoryLogs.length > 500) db.inventoryLogs = db.inventoryLogs.slice(0, 500);
    writeDb(db);
    return entry;
  } catch (err) {
    console.error('Failed to log inventory change:', err);
  }
}

module.exports = {
  readDb,
  writeDb,
  logAudit,
  logInventory
};
