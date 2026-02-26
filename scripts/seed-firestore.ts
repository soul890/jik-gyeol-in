import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, getDoc, setDoc } from 'firebase/firestore';
import { jobs } from '../src/data/jobs';
import { suppliers } from '../src/data/suppliers';
import { communityPosts } from '../src/data/communityPosts';
import { companies } from '../src/data/companies';

const firebaseConfig = {
  apiKey: 'AIzaSyCLMpMAXTBKp7M9NxyVjsepdHlq5xCEYv8',
  authDomain: 'jik-gyeol-in.firebaseapp.com',
  projectId: 'jik-gyeol-in',
  storageBucket: 'jik-gyeol-in.firebasestorage.app',
  messagingSenderId: '259471210398',
  appId: '1:259471210398:web:758fc4c183b1db4090088f',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function seedCollection<T extends { id: string }>(
  collectionName: string,
  items: T[],
) {
  console.log(`\n--- Seeding ${collectionName} (${items.length} items) ---`);
  let created = 0;
  let skipped = 0;

  for (const item of items) {
    const ref = doc(db, collectionName, item.id);
    const snap = await getDoc(ref);

    if (snap.exists()) {
      console.log(`  [skip] ${item.id} already exists`);
      skipped++;
      continue;
    }

    const { id: _id, ...data } = item;
    await setDoc(ref, { ...data, isSample: true });
    console.log(`  [created] ${item.id}`);
    created++;
  }

  console.log(`  => ${created} created, ${skipped} skipped`);
}

async function main() {
  console.log('Starting Firestore seed...');

  await seedCollection('companies', companies);
  await seedCollection('jobs', jobs);
  await seedCollection('suppliers', suppliers);
  await seedCollection('communityPosts', communityPosts);

  console.log('\nSeed complete!');
  process.exit(0);
}

main().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
