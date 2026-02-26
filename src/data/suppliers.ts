import type { Supplier } from '@/types';

export const suppliers: Supplier[] = [
  {
    id: 'supplier-1',
    name: '대한타일',
    description: '국내외 프리미엄 타일을 합리적인 가격에 공급합니다. 포세린, 세라믹, 대리석 타일 등 다양한 제품을 보유하고 있습니다.',
    categories: ['tile'],
    products: ['포세린 타일', '세라믹 타일', '대리석 타일', '모자이크 타일', '외장 타일'],
    location: '경기 광주시',
    rating: 4.7,
    reviewCount: 89,
    contact: 'daehan@example.com',
    phone: '031-1234-5678',
    minOrderAmount: '50만원',
    deliveryInfo: '수도권 당일 배송, 지방 익일 배송',
    createdAt: '2025-02-10',
  },
];
