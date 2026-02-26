import { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';

export function useUnreadCount(): number {
  const { user } = useAuth();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!user) {
      setCount(0);
      return;
    }

    const q = query(
      collection(db, 'chatRooms'),
      where('participants', 'array-contains', user.uid),
    );

    const unsub = onSnapshot(q, (snap) => {
      let total = 0;
      snap.forEach((doc) => {
        const data = doc.data();
        total += data.unreadCount?.[user.uid] ?? 0;
      });
      setCount(total);
    }, () => {
      setCount(0);
    });

    return unsub;
  }, [user]);

  return count;
}
