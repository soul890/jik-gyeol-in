export interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
  jobCount: number;
}

export type JobType = '구인' | '구직';

export interface Job {
  id: string;
  type: JobType;
  title: string;
  categoryId: string;
  location: string;
  pay: string;
  description: string;
  contact: string;
  author: string;
  createdAt: string;
  views: number;
  isUrgent?: boolean;
  images?: string[];
  uid?: string;
}

export interface Review {
  id: string;
  title: string;
  content: string;
  rating: number;
  author: string;
  date: string;
  tags: string[];
  imageUrl?: string;
}

export interface Company {
  id: string;
  name: string;
  description: string;
  categories: string[];
  location: string;
  rating: number;
  reviewCount: number;
  portfolio: string[];
  contact: string;
  phone: string;
  experience: string;
  employeeCount: string;
  createdAt: string;
  portfolioImages?: string[];
  businessLicenseUrl?: string;
  reviews?: Review[];
  uid?: string;
}

export interface Supplier {
  id: string;
  name: string;
  description: string;
  categories: string[];
  products: string[];
  location: string;
  rating: number;
  reviewCount: number;
  contact: string;
  phone: string;
  minOrderAmount: string;
  deliveryInfo: string;
  createdAt: string;
  images?: string[];
  uid?: string;
}

export type SubscriptionPlan = 'free' | 'pro' | 'business';

export interface Subscription {
  plan: SubscriptionPlan;
  startDate: string;
  endDate: string;
  paymentKey?: string;
  orderId?: string;
}

export interface UsageTracking {
  aiDesignCount: number;
  lastResetDate: string;
}

export interface ChatRoom {
  id: string;
  participants: string[];
  participantNames: Record<string, string>;
  lastMessage: string;
  lastMessageAt: { toDate: () => Date; toMillis: () => number } | null;
  context: { type: 'job' | 'company' | 'supplier'; id: string; title: string };
  createdAt: { toDate: () => Date; toMillis: () => number };
  unreadCount: Record<string, number>;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  createdAt: { toDate: () => Date } | null;
}

export type CommunityCategory = '시공노하우' | '질문답변' | '자유게시판';

export interface CommunityPost {
  id: string;
  category: CommunityCategory;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  views: number;
  likes: number;
  commentCount: number;
  images?: string[];
  uid?: string;
}
