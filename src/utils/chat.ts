import { collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface FindOrCreateParams {
  currentUserId: string;
  currentUserName: string;
  otherUserId: string;
  otherUserName: string;
  context: { type: 'job' | 'company' | 'supplier'; id: string; title: string };
}

export async function findOrCreateChatRoom({
  currentUserId,
  currentUserName,
  otherUserId,
  otherUserName,
  context,
}: FindOrCreateParams): Promise<string> {
  const roomsRef = collection(db, 'chatRooms');
  const q = query(roomsRef, where('participants', 'array-contains', currentUserId));
  const snap = await getDocs(q);

  for (const doc of snap.docs) {
    const data = doc.data();
    if (
      data.participants.includes(otherUserId) &&
      data.context?.type === context.type &&
      data.context?.id === context.id
    ) {
      return doc.id;
    }
  }

  const newRoom = await addDoc(roomsRef, {
    participants: [currentUserId, otherUserId],
    participantNames: {
      [currentUserId]: currentUserName,
      [otherUserId]: otherUserName,
    },
    lastMessage: '',
    lastMessageAt: null,
    context,
    createdAt: serverTimestamp(),
    unreadCount: { [currentUserId]: 0, [otherUserId]: 0 },
  });

  return newRoom.id;
}
