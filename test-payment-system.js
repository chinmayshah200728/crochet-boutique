/**
 * Comprehensive Automated Payment & Security Integration Test Suite
 * Tests Razorpay payment lifecycle, HMAC SHA256 signature verification,
 * Webhook signature & idempotency, Server-side price recalculation,
 * Admin refund authorization, and state consistency.
 */

require('dotenv').config();
const crypto = require('crypto');
const http = require('http');

const BASE_URL = 'http://localhost:3000';
const JWT_SECRET = process.env.JWT_SECRET || 'crochet_by_prisha_secret_key_2026';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || 'prisha_razorpay_secret_key_2026';
const RAZORPAY_WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET || 'prisha_webhook_secret_key_2026';

function request(path, method = 'GET', data = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(BASE_URL + path);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, data: parsed, headers: res.headers });
        } catch (e) {
          resolve({ status: res.statusCode, data: body, headers: res.headers });
        }
      });
    });

    req.on('error', (err) => reject(err));
    if (data) req.write(typeof data === 'string' ? data : JSON.stringify(data));
    req.end();
  });
}

// Generate Admin JWT for authorized admin test calls
function getAdminToken() {
  const jwt = require('jsonwebtoken');
  return jwt.sign({ id: 'usr-admin', email: 'admin@crochetbyprisha.com', role: 'admin' }, JWT_SECRET, { expiresIn: '1h' });
}

async function runTests() {
  console.log('🧪 Starting Razorpay End-to-End Payment & Security Test Suite...\n');
  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(` ✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(` ❌ FAIL: ${message}`);
      failed++;
    }
  }

  try {
    // TEST 1: Server-Side Price Recalculation & Razorpay Order Creation
    console.log('--- TEST 1: Order Creation & Server Price Calculation ---');
    const createRes = await request('/api/payments/create-order', 'POST', {
      items: [
        { productId: 'prod-1', qty: 1, giftWrap: 'With Gift Wrap & Satin Ribbon (+ ₹99)' },
        { productId: 'prod-3', qty: 2 }
      ],
      shippingAddress: { address: '124 Rosewood Way', city: 'Mumbai', zip: '400050' },
      couponCode: 'LOVE10',
      customerName: 'Aria Test',
      customerEmail: 'aria@example.com'
    });

    assert(createRes.status === 200, 'HTTP status is 200 OK');
    assert(createRes.data.success === true, 'Response contains success: true');
    assert(!!createRes.data.orderId, `Internal order ID created: ${createRes.data.orderId}`);
    assert(!!createRes.data.razorpayOrderId, `Razorpay Order ID created: ${createRes.data.razorpayOrderId}`);
    assert(createRes.data.amount > 0, `Server calculated amount in paise: ${createRes.data.amount}`);

    const createdOrderId = createRes.data.orderId;
    const rzpOrderId = createRes.data.razorpayOrderId;
    const rzpPaymentId = `pay_test_${Date.now()}`;

    // TEST 2: Valid HMAC SHA256 Signature Verification
    console.log('\n--- TEST 2: HMAC SHA256 Payment Signature Verification ---');
    const validSignature = crypto
      .createHmac('sha256', RAZORPAY_KEY_SECRET)
      .update(`${rzpOrderId}|${rzpPaymentId}`)
      .digest('hex');

    const verifyRes = await request('/api/payments/verify', 'POST', {
      orderId: createdOrderId,
      razorpayOrderId: rzpOrderId,
      razorpayPaymentId: rzpPaymentId,
      razorpaySignature: validSignature
    });

    assert(verifyRes.status === 200, 'HTTP status is 200 OK on valid signature');
    assert(verifyRes.data.verified === true, 'Server verified payment signature successfully');
    assert(verifyRes.data.order.paymentStatus === 'PAID', 'Order paymentStatus updated to PAID');

    // TEST 3: Idempotent Signature Verification (Duplicate verify call)
    console.log('\n--- TEST 3: Verification Idempotency ---');
    const duplicateVerifyRes = await request('/api/payments/verify', 'POST', {
      orderId: createdOrderId,
      razorpayOrderId: rzpOrderId,
      razorpayPaymentId: rzpPaymentId,
      razorpaySignature: validSignature
    });

    assert(duplicateVerifyRes.status === 200, 'HTTP status is 200 OK for duplicate verification');
    assert(duplicateVerifyRes.data.alreadyPaid === true, 'Server detected already-paid order and returned idempotent response');

    // TEST 4: Invalid Signature Rejection
    console.log('\n--- TEST 4: Invalid Signature Rejection ---');
    const create2Res = await request('/api/payments/create-order', 'POST', {
      items: [{ productId: 'prod-4', qty: 1 }],
      shippingAddress: { address: '742 Pastel Way', city: 'Pune', zip: '411001' }
    });

    const verifyInvalidRes = await request('/api/payments/verify', 'POST', {
      orderId: create2Res.data.orderId,
      razorpayOrderId: create2Res.data.razorpayOrderId,
      razorpayPaymentId: `pay_fake_123`,
      razorpaySignature: 'invalid_tampered_signature_string'
    });

    assert(verifyInvalidRes.status === 400, 'HTTP status is 400 Bad Request for tampered signature');
    assert(verifyInvalidRes.data.verified === false, 'Server rejected invalid signature');

    // TEST 5: Webhook Signature Verification & Idempotency
    console.log('\n--- TEST 5: Webhook Verification & Idempotency ---');
    const eventId = `evt_test_${Date.now()}`;
    const webhookPayload = JSON.stringify({
      event_id: eventId,
      event: 'payment.captured',
      payload: {
        payment: {
          entity: {
            id: `pay_wh_${Date.now()}`,
            order_id: create2Res.data.razorpayOrderId,
            amount: create2Res.data.amount,
            status: 'captured'
          }
        }
      }
    });

    const webhookSig = crypto
      .createHmac('sha256', RAZORPAY_WEBHOOK_SECRET)
      .update(webhookPayload)
      .digest('hex');

    const webhookRes = await request('/api/payments/webhook', 'POST', webhookPayload, {
      'x-razorpay-signature': webhookSig
    });

    assert(webhookRes.status === 200, 'Webhook HTTP 200 OK');
    assert(webhookRes.data.status === 'success', 'Webhook processed successfully');

    // Send duplicate webhook event
    const duplicateWebhookRes = await request('/api/payments/webhook', 'POST', webhookPayload, {
      'x-razorpay-signature': webhookSig
    });

    assert(duplicateWebhookRes.status === 200, 'Duplicate Webhook HTTP 200 OK');
    assert(duplicateWebhookRes.data.status === 'already_processed', 'Server enforced webhook idempotency');

    // TEST 6: Server Payment Status Polling API
    console.log('\n--- TEST 6: Payment Status Polling API ---');
    const statusRes = await request(`/api/payments/status/${createdOrderId}`);
    assert(statusRes.status === 200, 'Status endpoint HTTP 200 OK');
    assert(statusRes.data.paymentStatus === 'PAID', 'Authoritative status is PAID');
    assert(!!statusRes.data.paidAt, 'paidAt timestamp is recorded');

    // TEST 7: Order Cancellation
    console.log('\n--- TEST 7: Payment Order Cancellation ---');
    const create3Res = await request('/api/payments/create-order', 'POST', {
      items: [{ productId: 'prod-5', qty: 1 }],
      shippingAddress: { address: '124 Green Ave', city: 'Delhi', zip: '110001' }
    });

    const cancelRes = await request('/api/payments/cancel', 'POST', {
      orderId: create3Res.data.orderId,
      reason: 'User closed payment window'
    });

    assert(cancelRes.status === 200, 'Cancel endpoint HTTP 200 OK');
    assert(cancelRes.data.order.paymentStatus === 'CANCELLED', 'Order state updated to CANCELLED');

    // TEST 8: Admin Authorized Refund System
    console.log('\n--- TEST 8: Admin Authorized Refund System ---');
    // Unauthorized attempt
    const unauthRefundRes = await request('/api/payments/refund', 'POST', {
      orderId: createdOrderId,
      amount: 100
    });
    assert(unauthRefundRes.status === 403, 'Unauthorized refund attempt rejected with HTTP 403');

    // Authorized admin attempt
    const adminToken = getAdminToken();
    const authRefundRes = await request('/api/payments/refund', 'POST', {
      orderId: createdOrderId,
      amount: 100,
      reason: 'Partial customer refund'
    }, {
      'Authorization': `Bearer ${adminToken}`
    });

    assert(authRefundRes.status === 200, 'Authorized admin refund HTTP 200 OK');
    assert(authRefundRes.data.order.refundStatus === 'PARTIAL', 'Refund status updated to PARTIAL');
    assert(authRefundRes.data.order.refundAmount === 100, 'Refund amount recorded as ₹100');

    console.log(`\n🎉 TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
    if (failed === 0) {
      console.log('✅ All Razorpay Payment Integration & Security Tests Passed Perfectly!\n');
    }
  } catch (err) {
    console.error('Test execution error:', err);
  }
}

// Execute tests if server is listening
runTests();
