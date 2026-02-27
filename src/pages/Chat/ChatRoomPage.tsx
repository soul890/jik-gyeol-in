import { useEffect, useRef, useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowLeft, Send } from 'lucide-react';
import {
  doc,
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  serverTimestamp,
  increment,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/Badge';
import type { ChatRoom, ChatMessage } from '@/types';

const contextLabel: Record<string, string> = {
  job: '구인구직',
  company: '인테리어 업체',
  supplier: '자재업체',
};

export function ChatRoomPage() {
  const { roomId } = useParams();
  const { user, profile, loading: authLoading } = useAuth();
  const [room, setRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Subscribe to room metadata
  useEffect(() => {
    if (!roomId) return;
    const unsub = onSnapshot(doc(db, 'chatRooms', roomId), (snap) => {
      if (snap.exists()) {
        setRoom({ id: snap.id, ...snap.data() } as ChatRoom);
      }
    });
    return unsub;
  }, [roomId]);

  // Subscribe to messages
  useEffect(() => {
    if (!roomId) return;
    const q = query(
      collection(db, 'chatRooms', roomId, 'messages'),
      orderBy('createdAt', 'asc'),
    );
    const unsub = onSnapshot(q, (snap) => {
      const msgs: ChatMessage[] = snap.docs.map((d) => ({ id: d.id, ...d.data() } as ChatMessage));
      setMessages(msgs);
    });
    return unsub;
  }, [roomId]);

  // Reset unread count on enter
  useEffect(() => {
    if (!roomId || !user) return;
    updateDoc(doc(db, 'chatRooms', roomId), {
      [`unreadCount.${user.uid}`]: 0,
    }).catch(() => {});
  }, [roomId, user, messages.length]);

  // Auto-scroll on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  const handleSend = async () => {
    if (!text.trim() || !roomId || !user || sending) return;
    const msg = text.trim();
    setText('');
    setSending(true);

    try {
      const senderName = profile?.nickname || user.email || '나';

      await addDoc(collection(db, 'chatRooms', roomId, 'messages'), {
        senderId: user.uid,
        senderName,
        text: msg,
        createdAt: serverTimestamp(),
      });

      // Find the other participant
      const otherUid = room?.participants.find((p) => p !== user.uid);
      const updates: Record<string, unknown> = {
        lastMessage: msg,
        lastMessageAt: serverTimestamp(),
      };
      if (otherUid) {
        updates[`unreadCount.${otherUid}`] = increment(1);
      }

      await updateDoc(doc(db, 'chatRooms', roomId), updates);
    } catch {
      // silently fail
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      handleSend();
    }
  };

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

  const otherName = room
    ? Object.entries(room.participantNames).find(([uid]) => uid !== user.uid)?.[1] ?? '상대방'
    : '...';

  return (
    <div className="flex flex-col h-[calc(100dvh-4rem)] max-w-3xl mx-auto">
      {/* Top bar */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-warm-200 bg-white shrink-0">
        <Link to="/chat" className="p-1 rounded-lg hover:bg-warm-100 transition-colors">
          <ArrowLeft className="w-5 h-5 text-warm-600" />
        </Link>
        <div className="flex-1 min-w-0">
          <span className="font-semibold text-warm-800 truncate block">{otherName}</span>
          {room && (
            <div className="flex items-center gap-1.5">
              <Badge variant="default" className="text-[10px]">
                {contextLabel[room.context.type] ?? room.context.type}
              </Badge>
              <span className="text-xs text-warm-400 truncate">{room.context.title}</span>
            </div>
          )}
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-warm-50">
        {messages.length === 0 && (
          <p className="text-center text-sm text-warm-400 py-8">
            대화를 시작해보세요!
          </p>
        )}
        {messages.map((msg) => {
          const isMe = msg.senderId === user.uid;
          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] sm:max-w-[75%] ${isMe ? 'order-1' : ''}`}>
                {!isMe && (
                  <p className="text-xs text-warm-500 mb-1 ml-1">{msg.senderName}</p>
                )}
                <div
                  className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed break-words ${
                    isMe
                      ? 'bg-primary-500 text-white rounded-br-md'
                      : 'bg-warm-100 text-warm-800 rounded-bl-md'
                  }`}
                >
                  {msg.text}
                </div>
                <p className={`text-[10px] text-warm-400 mt-0.5 ${isMe ? 'text-right mr-1' : 'ml-1'}`}>
                  {msg.createdAt
                    ? msg.createdAt.toDate().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
                    : ''}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div className="shrink-0 px-4 py-3 border-t border-warm-200 bg-white">
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="메시지를 입력하세요..."
            className="flex-1 px-4 py-2.5 border border-warm-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <button
            onClick={handleSend}
            disabled={!text.trim() || sending}
            className="w-10 h-10 bg-primary-500 hover:bg-primary-600 disabled:bg-warm-300 text-white rounded-full flex items-center justify-center transition-colors cursor-pointer disabled:cursor-not-allowed shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
