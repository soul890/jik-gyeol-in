/**
 * Cloudflare Pages Function: POST /api/payment-confirm
 *
 * Confirms a TossPayments payment and activates Pro subscription.
 *
 * Security:
 *   - Firebase ID token verification (Authorization: Bearer <token>)
 *   - Server-side amount validation (19,900 KRW)
 *   - TossPayments response cross-validation
 *   - CORS restricted to allowed origins
 *   - Firestore write authenticated with user's ID token
 *
 * Environment variable required:
 *   TOSS_SECRET_KEY – TossPayments secret key
 */

import { verifyIdToken } from './_auth.js';
import { corsHeaders, handleOptions } from './_cors.js';

const EXPECTED_AMOUNT = 19900;

export async function onRequestPost(context) {
  const { request, env } = context;
  const headers = corsHeaders(request);
  const TOSS_SECRET_KEY = env.TOSS_SECRET_KEY;

  if (!TOSS_SECRET_KEY) {
    return jsonResponse({ error: 'TOSS_SECRET_KEY is not configured' }, 500, headers);
  }

  // Verify Firebase ID token
  const authResult = await verifyIdToken(request);
  if (!authResult) {
    return jsonResponse({ error: '인증이 필요합니다.' }, 401, headers);
  }
  const { uid } = authResult;

  try {
    const { paymentKey, orderId, amount } = await request.json();

    if (!paymentKey || !orderId || !amount) {
      return jsonResponse({ error: '필수 파라미터가 누락되었습니다.' }, 400, headers);
    }

    // Server-side amount validation
    if (amount !== EXPECTED_AMOUNT) {
      return jsonResponse({ error: '결제 금액이 올바르지 않습니다.' }, 400, headers);
    }

    // Confirm payment with TossPayments API
    const confirmRes = await fetch('https://api.tosspayments.com/v1/payments/confirm', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${btoa(TOSS_SECRET_KEY + ':')}`,
      },
      body: JSON.stringify({ paymentKey, orderId, amount }),
    });

    const confirmData = await confirmRes.json();

    if (!confirmRes.ok) {
      return jsonResponse(
        { error: confirmData.message || '결제 승인에 실패했습니다.' },
        confirmRes.status,
        headers,
      );
    }

    // Cross-validate amount from TossPayments response
    if (confirmData.totalAmount !== EXPECTED_AMOUNT) {
      return jsonResponse({ error: '결제 금액 검증에 실패했습니다.' }, 400, headers);
    }

    // Activate Pro subscription via Firestore REST API (authenticated)
    const projectId = 'jik-gyeol-in';
    const now = new Date();
    const endDate = new Date(now);
    endDate.setMonth(endDate.getMonth() + 1);

    // Extract the raw ID token to authenticate the Firestore request
    const idToken = request.headers.get('Authorization').slice(7);

    const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/users/${uid}?updateMask.fieldPaths=subscription.plan&updateMask.fieldPaths=subscription.startDate&updateMask.fieldPaths=subscription.endDate&updateMask.fieldPaths=subscription.paymentKey&updateMask.fieldPaths=subscription.orderId`;

    const firestoreRes = await fetch(firestoreUrl, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify({
        fields: {
          subscription: {
            mapValue: {
              fields: {
                plan: { stringValue: 'pro' },
                startDate: { stringValue: now.toISOString() },
                endDate: { stringValue: endDate.toISOString() },
                paymentKey: { stringValue: paymentKey },
                orderId: { stringValue: orderId },
              },
            },
          },
        },
      }),
    });

    if (!firestoreRes.ok) {
      const errText = await firestoreRes.text();
      console.error('Firestore update failed:', errText);
      return jsonResponse({ error: '구독 상태 업데이트에 실패했습니다.' }, 500, headers);
    }

    return jsonResponse({ success: true, plan: 'pro', endDate: endDate.toISOString() }, 200, headers);
  } catch (err) {
    console.error('Payment confirm error:', err);
    return jsonResponse(
      { error: err.message || '결제 처리 중 오류가 발생했습니다.' },
      500,
      headers,
    );
  }
}

function jsonResponse(body, status = 200, headers = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  });
}

export async function onRequestOptions(context) {
  return handleOptions(context.request);
}
