import { loadTossPayments } from '@tosspayments/tosspayments-sdk';

const CLIENT_KEY = 'test_ck_D5GePWvyJnrK0W0k6q8gmeYYookV';

let tossPromise: ReturnType<typeof loadTossPayments> | null = null;

export function getTossPayments() {
  if (!tossPromise) {
    tossPromise = loadTossPayments(CLIENT_KEY);
  }
  return tossPromise;
}
