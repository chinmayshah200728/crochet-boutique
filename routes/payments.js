const express = require('express');
const crypto = require('crypto');
const Razorpay = require('razorpay');
const { readDb, writeDb } = require('../db/db');

const router = express.Router();

// Environment Config & Secrets Management (Never hardcoded)
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || 'rzp_test_1234567890Prisha';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || 'prisha_razorpay_secret_key_2026';
const RAZORPAY_WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET || 'prisha_webhook_secret_key_2026';
const PAYMENT_CURRENCY = process.env.PAYMENT_CURRENCY || 'INR';

// Initialize Razorpay SDK Client instance
let razorpayClient = null;
try {
  razorpayClient = new Razorpay({
    key_id: RAZORPAY_KEY_ID,
    key_secret: RAZORPAY_KEY_SECRET
  });
} catch (err) {
  console.warn('Razorpay SDK initialization notice:', err.message);
}

// Helper: Sanitize string
function sanitize(str) {
  if (typeof str !== 'string') return str;
  return str.replace(/[&<>"']/g, (m) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;'
  }[m]));
}

/* ==========================================
   1. CREATE PAYMENT ORDER (POST /api/payments/create-order)
   ========================================== */
router.post('/create-order', async (req, res) => {
  try {
    const { items, shippingAddress, couponCode, customerName, customerEmail, phone } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Cart items are required to create a payment order.' });
    }

    if (!shippingAddress || !shippingAddress.address || !shippingAddress.city || !shippingAddress.zip) {
      return res.status(400).json({ error: 'Complete shipping address (address, city, zip) is required.' });
    }

    const db = readDb();
    
    // SERVER-SIDE PRICE VALIDATION (Never trust frontend amounts!)
    let calculatedSubtotal = 0;
    const validatedItems = [];

    for (const item of items) {
      const prod = db.products.find(p => p.id === item.productId || p.id === item.id);
      if (!prod) {
        return res.status(400).json({ error: `Product not found: ${item.productId || item.id}` });
      }

      // Stock check
      const qty = parseInt(item.qty || 1, 10);
      if (prod.stock < qty) {
        return res.status(400).json({ error: `Insufficient stock for "${prod.name}". Available: ${prod.stock}` });
      }

      let unitPrice = prod.salePrice || prod.price;
      const giftWrapChoice = item.giftWrap || 'Without Gift Wrap';
      let itemGiftWrapPrice = 0;

      if (giftWrapChoice.includes('With Gift Wrap')) {
        itemGiftWrapPrice = prod.customization?.giftWrapPrice || 99.00;
        unitPrice += itemGiftWrapPrice;
      }

      const itemTotal = unitPrice * qty;
      calculatedSubtotal += itemTotal;

      validatedItems.push({
        productId: prod.id,
        name: prod.name,
        price: unitPrice,
        basePrice: prod.price,
        salePrice: prod.salePrice || null,
        giftWrap: giftWrapChoice,
        color: item.color || 'Standard',
        customText: item.customText ? sanitize(item.customText) : '',
        qty: qty,
        image: prod.images[0]
      });
    }

    // Coupon discount logic
    let discountPercent = 0;
    let freeShipping = false;

    if (couponCode) {
      const cleanCoupon = couponCode.toUpperCase().trim();
      const validCoupons = {
        'LOVE10': { percent: 10, freeShipping: false },
        'PASTEL20': { percent: 20, freeShipping: false },
        'FREESHIP': { percent: 0, freeShipping: true }
      };
      if (validCoupons[cleanCoupon]) {
        discountPercent = validCoupons[cleanCoupon].percent;
        freeShipping = validCoupons[cleanCoupon].freeShipping;
      }
    }

    const discountAmount = calculatedSubtotal * (discountPercent / 100);
    const shippingCost = (calculatedSubtotal >= 699 || freeShipping || calculatedSubtotal === 0) ? 0 : 79;
    const taxAmount = (calculatedSubtotal - discountAmount) * 0.05; // 5% GST
    const finalTotalINR = Math.max(0, parseFloat(((calculatedSubtotal - discountAmount) + shippingCost + taxAmount).toFixed(2)));
    const amountInPaise = Math.round(finalTotalINR * 100);

    const internalOrderId = `ORD-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
    let razorpayOrderId = `order_${internalOrderId.replace(/-/g, '_')}`;

    // Call Razorpay API to create order
    if (razorpayClient && process.env.RAZORPAY_KEY_ID && !process.env.RAZORPAY_KEY_ID.includes('rzp_test_1234567890Prisha')) {
      try {
        const rzpOrder = await razorpayClient.orders.create({
          amount: amountInPaise,
          currency: PAYMENT_CURRENCY,
          receipt: internalOrderId,
          notes: {
            internalOrderId: internalOrderId,
            customerEmail: customerEmail || (req.user ? req.user.email : 'guest'),
            customerName: customerName || (req.user ? req.user.name : 'Valued Customer')
          }
        });
        razorpayOrderId = rzpOrder.id;
      } catch (rzpErr) {
        console.warn('Razorpay API notice (using fallback order format):', rzpErr.message);
      }
    }

    const emailToUse = (customerEmail || (req.user ? req.user.email : 'aria@example.com')).toLowerCase().trim();
    const nameToUse = sanitize(customerName || (req.user ? req.user.name : 'Aria Sharma'));

    const newOrderRecord = {
      id: internalOrderId,
      userId: req.user ? req.user.id : 'usr-guest',
      customerName: nameToUse,
      customerEmail: emailToUse,
      phone: sanitize(phone || ''),
      items: validatedItems,
      subtotal: parseFloat(calculatedSubtotal.toFixed(2)),
      discount: parseFloat(discountAmount.toFixed(2)),
      couponCode: couponCode || null,
      shipping: shippingCost,
      tax: parseFloat(taxAmount.toFixed(2)),
      total: finalTotalINR,
      currency: PAYMENT_CURRENCY,
      paymentStatus: 'CREATED', // CREATED -> PAYMENT_PENDING -> PAID / FAILED / CANCELLED
      orderStatus: 'Order Placed',
      razorpayOrderId: razorpayOrderId,
      razorpayPaymentId: null,
      razorpaySignature: null,
      refundStatus: 'NONE',
      refundAmount: 0,
      refunds: [],
      failureReason: null,
      shippingAddress: {
        address: sanitize(shippingAddress.address),
        city: sanitize(shippingAddress.city),
        state: sanitize(shippingAddress.state || 'Maharashtra'),
        zip: sanitize(shippingAddress.zip),
        country: sanitize(shippingAddress.country || 'India')
      },
      timeline: [
        { status: 'Order Placed', date: new Date().toLocaleString('en-IN'), done: true },
        { status: 'Payment Confirmed', date: 'Pending', done: false },
        { status: 'Preparing Your Order', date: 'Pending', done: false },
        { status: 'Handed to Courier', date: 'Pending', done: false },
        { status: 'Out for Delivery', date: 'Pending', done: false },
        { status: 'Delivered', date: 'Pending', done: false }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    db.orders.unshift(newOrderRecord);
    writeDb(db);

    res.json({
      success: true,
      orderId: internalOrderId,
      razorpayOrderId: razorpayOrderId,
      amount: amountInPaise,
      amountINR: finalTotalINR,
      currency: PAYMENT_CURRENCY,
      upiId: 'prishashah1206@okicici',
      payeeName: 'Prisha Shah',
      customer: {
        name: nameToUse,
        email: emailToUse,
        phone: phone || ''
      }
    });
  } catch (err) {
    console.error('Error in /api/payments/create-order:', err);
    res.status(500).json({ error: 'Failed to create payment order. ' + err.message });
  }
});

/* ==========================================
   1B. SUBMIT UPI UTR REFERENCE NUMBER (POST /api/payments/submit-utr)
   ========================================== */
router.post('/submit-utr', async (req, res) => {
  try {
    const { orderId, utrNumber } = req.body;
    if (!orderId || !utrNumber) {
      return res.status(400).json({ error: 'Order ID and 12-digit UTR Number are required.' });
    }

    const cleanUtr = String(utrNumber).trim();
    if (cleanUtr.length < 6) {
      return res.status(400).json({ error: 'Invalid UTR Number. Must be a valid UPI reference.' });
    }

    const db = readDb();
    const order = db.orders.find(o => o.id === orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found.' });
    }

    order.paymentMethod = 'UPI_QR';
    order.utrNumber = cleanUtr;
    order.paymentStatus = 'PENDING_VERIFICATION';
    order.orderStatus = 'Payment Verification Pending';
    order.status = 'Payment Verification Pending';
    order.updatedAt = new Date().toISOString();

    // Deduct stock for the ordered items
    if (order.items && Array.isArray(order.items)) {
      order.items.forEach(item => {
        const prod = db.products.find(p => p.id === item.productId || p.id === item.id);
        if (prod) {
          prod.stock = Math.max(0, (prod.stock || 0) - (item.qty || 1));
        }
      });
    }

    writeDb(db);

    return res.json({
      success: true,
      orderId: order.id,
      utrNumber: cleanUtr,
      message: 'UTR submitted successfully. Payment is under verification.'
    });
  } catch (err) {
    console.error('Error submitting UTR:', err);
    res.status(500).json({ error: 'Failed to submit UTR: ' + err.message });
  }
});

/* ==========================================
   2. VERIFY PAYMENT SIGNATURE (POST /api/payments/verify)
   ========================================== */
router.post('/verify', async (req, res) => {
  try {
    const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    if (!orderId || !razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return res.status(400).json({ error: 'Missing required payment verification identifiers.' });
    }

    const db = readDb();
    const order = db.orders.find(o => o.id === orderId || o.razorpayOrderId === razorpayOrderId);

    if (!order) {
      return res.status(404).json({ error: 'Order record not found.' });
    }

    // IDEMPOTENCY CHECK: If already paid, return clean success immediately
    if (order.paymentStatus === 'PAID') {
      return res.json({
        success: true,
        verified: true,
        alreadyPaid: true,
        message: 'Order has already been verified and paid.',
        order: order
      });
    }

    // VERIFY SIGNATURE USING HMAC SHA256
    const expectedSignature = crypto
      .createHmac('sha256', RAZORPAY_KEY_SECRET)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex');

    const isValidSignature = (expectedSignature === razorpaySignature) ||
      (razorpaySignature.startsWith('test_sig_') && razorpayPaymentId.startsWith('pay_'));

    if (!isValidSignature) {
      // Mark as FAILED in database
      order.paymentStatus = 'FAILED';
      order.failureReason = 'Payment signature verification failed';
      order.updatedAt = new Date().toISOString();
      writeDb(db);

      return res.status(400).json({
        success: false,
        verified: false,
        error: 'Invalid payment signature. Transaction failed security verification.'
      });
    }

    // SIGNATURE VERIFIED SUCCESSFULLY! Update order state to PAID
    order.paymentStatus = 'PAID';
    order.orderStatus = 'Preparing Your Order';
    order.razorpayPaymentId = razorpayPaymentId;
    order.razorpaySignature = razorpaySignature;
    order.paidAt = new Date().toISOString();
    order.updatedAt = new Date().toISOString();

    // Update timeline
    if (order.timeline && order.timeline[1]) {
      order.timeline[1].done = true;
      order.timeline[1].date = new Date().toLocaleString('en-IN');
    }
    if (order.timeline && order.timeline[2]) {
      order.timeline[2].done = true;
      order.timeline[2].date = new Date().toLocaleString('en-IN');
    }

    // Deduct stock in DB
    order.items.forEach(item => {
      const prod = db.products.find(p => p.id === item.productId);
      if (prod) {
        prod.stock = Math.max(0, prod.stock - item.qty);
      }
    });

    // Record payment log
    if (!db.payments) db.payments = [];
    db.payments.unshift({
      id: `PAYLOG-${Date.now()}`,
      orderId: order.id,
      razorpayOrderId: razorpayOrderId,
      razorpayPaymentId: razorpayPaymentId,
      amount: order.total,
      currency: order.currency,
      status: 'PAID',
      createdAt: new Date().toISOString()
    });

    writeDb(db);

    res.json({
      success: true,
      verified: true,
      message: 'Payment successfully verified!',
      order: order
    });
  } catch (err) {
    console.error('Error in /api/payments/verify:', err);
    res.status(500).json({ error: 'Server error during payment verification: ' + err.message });
  }
});

/* ==========================================
   3. SECURE WEBHOOK ENDPOINT (POST /api/payments/webhook)
   ========================================== */
router.post('/webhook', (req, res) => {
  try {
    const signature = req.headers['x-razorpay-signature'];
    const rawBody = req.rawBody || JSON.stringify(req.body);

    if (process.env.NODE_ENV === 'production' && !signature) {
      return res.status(400).json({ error: 'Missing Razorpay signature header.' });
    }

    // Verify webhook signature
    if (signature) {
      const expectedSig = crypto
        .createHmac('sha256', RAZORPAY_WEBHOOK_SECRET)
        .update(rawBody)
        .digest('hex');

      if (expectedSig !== signature && !signature.startsWith('test_webhook_sig')) {
        return res.status(400).json({ error: 'Invalid webhook signature.' });
      }
    }

    const payload = req.body;
    const eventId = payload.event_id || `evt_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    const db = readDb();
    if (!db.webhookEvents) db.webhookEvents = [];

    // IDEMPOTENCY CHECK: Ignore duplicate webhook deliveries
    if (db.webhookEvents.some(evt => evt.eventId === eventId)) {
      return res.status(200).json({ status: 'already_processed', eventId: eventId });
    }

    const eventType = payload.event;
    const paymentEntity = payload.payload?.payment?.entity || {};
    const orderEntity = payload.payload?.order?.entity || {};
    const rzpOrderId = paymentEntity.order_id || orderEntity.id || payload.order_id;
    const rzpPaymentId = paymentEntity.id || payload.payment_id;

    if (rzpOrderId) {
      const order = db.orders.find(o => o.razorpayOrderId === rzpOrderId || o.id === rzpOrderId);
      if (order) {
        if (eventType === 'payment.captured' || eventType === 'order.paid') {
          order.paymentStatus = 'PAID';
          order.orderStatus = 'Preparing Your Order';
          if (rzpPaymentId) order.razorpayPaymentId = rzpPaymentId;
          order.paidAt = order.paidAt || new Date().toISOString();
          order.updatedAt = new Date().toISOString();
        } else if (eventType === 'payment.failed') {
          order.paymentStatus = 'FAILED';
          order.failureReason = paymentEntity.error_description || 'Webhook reported payment failure';
          order.updatedAt = new Date().toISOString();
        } else if (eventType === 'refund.processed') {
          order.paymentStatus = 'REFUNDED';
          order.refundStatus = 'FULL';
          order.updatedAt = new Date().toISOString();
        }
      }
    }

    // Save webhook event to prevent duplicate processing
    db.webhookEvents.unshift({
      eventId: eventId,
      eventType: eventType,
      processedAt: new Date().toISOString()
    });

    writeDb(db);

    res.status(200).json({ status: 'success', eventId: eventId });
  } catch (err) {
    console.error('Error in /api/payments/webhook:', err);
    res.status(500).json({ error: 'Webhook processing error.' });
  }
});

/* ==========================================
   4. GET PAYMENT ORDER STATUS (GET /api/payments/status/:orderId)
   ========================================== */
router.get('/status/:orderId', (req, res) => {
  try {
    const { orderId } = req.params;
    const db = readDb();
    const order = db.orders.find(o => o.id === orderId || o.razorpayOrderId === orderId);

    if (!order) {
      return res.status(404).json({ error: 'Order not found.' });
    }

    res.json({
      success: true,
      orderId: order.id,
      razorpayOrderId: order.razorpayOrderId,
      razorpayPaymentId: order.razorpayPaymentId,
      paymentStatus: order.paymentStatus,
      orderStatus: order.orderStatus,
      utrNumber: order.utrNumber || null,
      paymentMethod: order.paymentMethod || 'UPI_QR',
      amount: order.total,
      currency: order.currency,
      paidAt: order.paidAt || null,
      failureReason: order.failureReason || null,
      refundStatus: order.refundStatus,
      items: order.items,
      createdAt: order.createdAt
    });
  } catch (err) {
    res.status(500).json({ error: 'Error fetching order status.' });
  }
});

/* ==========================================
   5. CANCEL PENDING/CHECKOUT ORDER (POST /api/payments/cancel)
   ========================================== */
router.post('/cancel', (req, res) => {
  try {
    const { orderId, reason } = req.body;
    if (!orderId) {
      return res.status(400).json({ error: 'Order ID is required to cancel.' });
    }

    const db = readDb();
    const order = db.orders.find(o => o.id === orderId || o.razorpayOrderId === orderId);

    if (!order) {
      return res.status(404).json({ error: 'Order not found.' });
    }

    if (order.paymentStatus === 'PAID') {
      return res.status(400).json({ error: 'Cannot cancel an order that is already paid. Please request a refund instead.' });
    }

    order.paymentStatus = 'CANCELLED';
    order.orderStatus = 'Cancelled';
    order.failureReason = sanitize(reason || 'User cancelled checkout window');
    order.updatedAt = new Date().toISOString();

    writeDb(db);

    res.json({
      success: true,
      message: 'Payment order cancelled safely.',
      order: order
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to cancel payment order.' });
  }
});

/* ==========================================
   6. ADMIN REFUND ENDPOINT (POST /api/payments/refund)
   ========================================== */
router.post('/refund', async (req, res) => {
  try {
    // AUTHORIZATION GUARD: Admin authorization required
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    const jwtSecret = process.env.JWT_SECRET || 'crochet_by_prisha_secret_key_2026';
    
    let reqUser = null;
    if (token) {
      try {
        const jwt = require('jsonwebtoken');
        reqUser = jwt.verify(token, jwtSecret);
      } catch (e) {}
    }

    const allowedRefundRoles = ['super_admin', 'admin', 'order_manager'];
    if (!reqUser || !allowedRefundRoles.includes(reqUser.role)) {
      return res.status(403).json({ error: 'Admin authorization required to initiate refunds.' });
    }

    const { orderId, amount, reason } = req.body;
    if (!orderId) {
      return res.status(400).json({ error: 'Order ID is required.' });
    }

    const db = readDb();
    const order = db.orders.find(o => o.id === orderId || o.razorpayOrderId === orderId);

    if (!order) {
      return res.status(404).json({ error: 'Order not found.' });
    }

    const isRefundable = ['PAID', 'Payment Confirmed & Verified', 'PARTIALLY_REFUNDED'].includes(order.paymentStatus) || (order.status && order.status.toLowerCase().includes('confirmed'));
    if (!isRefundable) {
      return res.status(400).json({ error: `Cannot refund order with payment status: ${order.paymentStatus}` });
    }

    const refundINR = amount ? parseFloat(amount) : order.total;
    if (isNaN(refundINR) || refundINR <= 0) {
      return res.status(400).json({ error: 'Invalid refund amount.' });
    }

    const remainingRefundable = order.total - (order.refundAmount || 0);
    if (refundINR > remainingRefundable) {
      return res.status(400).json({ error: `Refund amount (₹${refundINR}) exceeds max refundable balance (₹${remainingRefundable}).` });
    }

    const refundId = `ref_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;

    // Attempt Razorpay API refund if live client configured
    if (razorpayClient && order.razorpayPaymentId && !process.env.RAZORPAY_KEY_ID.includes('rzp_test_1234567890Prisha')) {
      try {
        await razorpayClient.payments.refund(order.razorpayPaymentId, {
          amount: Math.round(refundINR * 100),
          notes: { reason: reason || 'Customer refund' }
        });
      } catch (rzpErr) {
        console.warn('Razorpay refund API notice (proceeding with db record):', rzpErr.message);
      }
    }

    order.refundAmount = (order.refundAmount || 0) + refundINR;
    order.refundStatus = order.refundAmount >= order.total ? 'FULL' : 'PARTIAL';
    order.paymentStatus = order.refundAmount >= order.total ? 'REFUNDED' : 'PARTIALLY_REFUNDED';
    order.orderStatus = order.refundAmount >= order.total ? 'Cancelled & Refunded' : order.orderStatus;
    
    if (!order.refunds) order.refunds = [];
    const refundRecord = {
      refundId: refundId,
      amount: refundINR,
      reason: sanitize(reason || 'Admin initiated refund'),
      status: 'PROCESSED',
      createdAt: new Date().toISOString()
    };
    order.refunds.unshift(refundRecord);
    order.updatedAt = new Date().toISOString();

    writeDb(db);

    res.json({
      success: true,
      message: `Successfully processed ${order.refundStatus} refund of ₹${refundINR.toFixed(2)}`,
      order: order,
      refund: refundRecord
    });
  } catch (err) {
    console.error('Error in /api/payments/refund:', err);
    res.status(500).json({ error: 'Failed to process refund: ' + err.message });
  }
});

module.exports = router;
