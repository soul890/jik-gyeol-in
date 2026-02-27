import { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import type { ChatRoom } from '@/types';

export interface Notification {
  id: string;
  type: 'chat';
  title: string;
  message: string;
  link: string;
  createdAt: string;
  read: boolean;
}

export function useNotifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (!user) {
      setNotifications([]);
      return;
    }

    const q = query(
      collection(db, 'chatRooms'),
      where('participants', 'array-contains', user.uid),
      orderBy('lastMessageAt', 'desc'),
      limit(20),
    );

    const unsub = onSnapshot(q, (snap) => {
      const notifs: Notification[] = [];
      snap.forEach((doc) => {
        const data = doc.data() as ChatRoom;
        const unread = (data.unreadCount as Record<string, number>)?.[user.uid] ?? 0;
        if (unread > 0 && data.lastMessage) {
          const otherName = Object.entries(data.participantNames || {})
            .find(([k]) => k !== user.uid)?.[1] || '상대방';
          const ts = data.lastMessageAt?.toDate?.()?.toISOString() || '';
          notifs.push({
            id: doc.id,
            type: 'chat',
            title: `${otherName}님의 새 메시지`,
            message: data.lastMessage.length > 30 ? data.lastMessage.slice(0, 30) + '...' : data.lastMessage,
            link: `/chat/${doc.id}`,
            createdAt: ts,
            read: false,
          });
        }
      });
      setNotifications(notifs);
    }, () => {
      setNotifications([]);
    });

    return unsub;
  }, [user]);

  return { notifications, unreadCount: notifications.length };
}
