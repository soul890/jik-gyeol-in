import type { Category } from '@/types';

export const categories: Category[] = [
  { id: 'demolition', name: '철거', icon: 'Hammer', description: '기존 구조물 철거 및 해체', jobCount: 45 },
  { id: 'carpentry', name: '목공', icon: 'TreePine', description: '목재 가공 및 시공', jobCount: 62 },
  { id: 'tile', name: '타일', icon: 'Grid3x3', description: '타일 시공 및 줄눈 작업', jobCount: 38 },
  { id: 'wallpaper', name: '도배', icon: 'Wallpaper', description: '벽지 시공 및 마감', jobCount: 51 },
  { id: 'paint', name: '페인트', icon: 'Paintbrush', description: '페인팅 및 도장 작업', jobCount: 44 },
  { id: 'electrical', name: '전기', icon: 'Zap', description: '전기 배선 및 설비', jobCount: 33 },
  { id: 'plumbing', name: '설비(배관)', icon: 'Pipette', description: '배관 설비 및 수리', jobCount: 28 },
  { id: 'flooring', name: '바닥', icon: 'Square', description: '바닥재 시공 (마루, 장판 등)', jobCount: 47 },
  { id: 'window', name: '창호', icon: 'DoorOpen', description: '창문 및 문 시공', jobCount: 22 },
  { id: 'furniture', name: '가구/싱크대', icon: 'Armchair', description: '붙박이장, 싱크대 등 제작 설치', jobCount: 35 },
  { id: 'lighting', name: '조명', icon: 'Lightbulb', description: '조명 설계 및 설치', jobCount: 19 },
  { id: 'waterproof', name: '방수', icon: 'Droplets', description: '방수 처리 및 시공', jobCount: 26 },
  { id: 'film', name: '필름', icon: 'Film', description: '인테리어 필름 시공', jobCount: 31 },
];
