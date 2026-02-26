import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { EmptyState } from '@/components/ui/EmptyState';
import { Badge } from '@/components/ui/Badge';
import { formatTimestamp } from '@/utils/format';
import type { ChatRoom } from '@/types';

const contextLabel: Record<string, string> = {
  job: '구인구직',
  company: '인테리어 업체',
  supplier: '자재업체',
};

export function ChatListPage() {
  const { user, loading: authLoading } = useAuth();
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'chatRooms'),
      where('participants', 'array-contains', user.uid),
      orderBy('lastMessageAt', 'desc'),
    );

    const unsub = onSnapshot(q, (snap) => {
      const list: ChatRoom[] = snap.docs.map((d) => ({ id: d.id, ...d.data() } as ChatRoom));
      setRooms(list);
      setLoading(false);
    }, () => {
      setLoading(false);
    });

    return unsub;
  }, [user]);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-warm-800 mb-6">채팅</h1>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin" />
        </div>
      ) : rooms.length === 0 ? (
        <EmptyState title="채팅이 없습니다" description="상세 페이지에서 '채팅으로 상담하기'를 눌러 대화를 시작하세요." />
      ) : (
        <div className="space-y-2">
          {rooms.map((room) => {
            const otherName = Object.entries(room.participantNames)
              .find(([uid]) => uid !== user.uid)?.[1] ?? '상대방';
            const unread = room.unreadCount?.[user.uid] ?? 0;

            return (
              <Link
                key={room.id}
                to={`/chat/${room.id}`}
                className="flex items-center gap-3 p-4 bg-white rounded-xl border border-warm-200 hover:border-primary-300 hover:shadow-sm transition-all"
              >
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center shrink-0">
                  <MessageCircle className="w-6 h-6 text-primary-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-semibold text-warm-800 truncate">{otherName}</span>
                    <Badge variant="default" className="text-[10px] shrink-0">
                      {contextLabel[room.context.type] ?? room.context.type}
                    </Badge>
                  </div>
                  <p className="text-sm text-warm-500 truncate">
                    {room.context.title}
                  </p>
                  <p className="text-sm text-warm-400 truncate">
                    {room.lastMessage || '대화를 시작해보세요'}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className="text-xs text-warm-400">
                    {formatTimestamp(room.lastMessageAt)}
                  </span>
                  {unread > 0 && (
                    <span className="w-5 h-5 bg-accent text-white text-xs font-bold rounded-full flex items-center justify-center">
                      {unread > 9 ? '9+' : unread}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
