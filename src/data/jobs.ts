import type { Job } from '@/types';

export const jobs: Job[] = [
  {
    id: 'job-1',
    type: '구인',
    title: '강남구 아파트 리모델링 타일 기사님 구합니다',
    categoryId: 'tile',
    location: '서울 강남구',
    pay: '일 35만원',
    description: '강남구 대치동 32평 아파트 욕실 2곳 + 주방 타일 시공 가능하신 기사님 구합니다.\n\n- 작업 기간: 약 5일\n- 자재는 준비되어 있습니다\n- 경력 5년 이상 우대\n- 포트폴리오 있으시면 보내주세요',
    contact: '010-1234-5678',
    author: '김인테리어',
    createdAt: '2026-02-26T09:00:00',
    views: 234,
    isUrgent: true,
  },
];
