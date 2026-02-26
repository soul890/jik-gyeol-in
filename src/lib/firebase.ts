import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyCLMpMAXTBKp7M9NxyVjsepdHlq5xCEYv8',
  authDomain: 'jik-gyeol-in.firebaseapp.com',
  projectId: 'jik-gyeol-in',
  storageBucket: 'jik-gyeol-in.firebasestorage.app',
  messagingSenderId: '259471210398',
  appId: '1:259471210398:web:758fc4c183b1db4090088f',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
