/**
 * Cloudflare Pages Function: POST /api/payment-confirm
 *
 * Confirms a TossPayments payment and activates Pro subscription.
 *
 * Environment variable required:
 *   TOSS_SECRET_KEY – TossPayments secret key
 */

export async function onRequestPost(context) {
  const { request, env } = context;
  const TOSS_SECRET_KEY = env.TOSS_SECRET_KEY;

  if (!TOSS_SECRET_KEY) {
    return jsonResponse({ error: 'TOSS_SECRET_KEY is not configured' }, 500);
  }

  try {
    const { paymentKey, orderId, amount, uid } = await request.json();

    if (!paymentKey || !orderId || !amount || !uid) {
      return jsonResponse({ error: '필수 파라미터가 누락되었습니다.' }, 400);
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
      );
    }

    // Activate Pro subscription via Firestore REST API
    const projectId = 'jik-gyeol-in';
    const now = new Date();
    const endDate = new Date(now);
    endDate.setMonth(endDate.getMonth() + 1);

    const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/users/${uid}?updateMask.fieldPaths=subscription.plan&updateMask.fieldPaths=subscription.startDate&updateMask.fieldPaths=subscription.endDate&updateMask.fieldPaths=subscription.paymentKey&updateMask.fieldPaths=subscription.orderId`;

    const firestoreRes = await fetch(firestoreUrl, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
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
      return jsonResponse({ error: '구독 상태 업데이트에 실패했습니다.' }, 500);
    }

    return jsonResponse({ success: true, plan: 'pro', endDate: endDate.toISOString() });
  } catch (err) {
    console.error('Payment confirm error:', err);
    return jsonResponse(
      { error: err.message || '결제 처리 중 오류가 발생했습니다.' },
      500,
    );
  }
}

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
