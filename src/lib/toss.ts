import { loadTossPayments } from '@tosspayments/tosspayments-sdk';

const CLIENT_KEY = import.meta.env.VITE_TOSS_CLIENT_KEY || 'test_ck_ORzdMaqN3waPNv7j2x7Pr5AkYXQG';

let tossPromise: ReturnType<typeof loadTossPayments> | null = null;

export function getTossPayments() {
  if (!tossPromise) {
    tossPromise = loadTossPayments(CLIENT_KEY);
  }
  return tossPromise;
}
