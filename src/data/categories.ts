import type { Category } from '@/types';

export const categories: Category[] = [
  { id: 'demolition', name: '철거', icon: 'Hammer', description: '기존 구조물 철거 및 해체', jobCount: 0, group: 'construction' },
  { id: 'carpentry', name: '목공', icon: 'TreePine', description: '목재 가공 및 시공', jobCount: 0, group: 'construction' },
  { id: 'tile', name: '타일', icon: 'Grid3x3', description: '타일 시공 및 줄눈 작업', jobCount: 1, group: 'construction' },
  { id: 'wallpaper', name: '도배', icon: 'Wallpaper', description: '벽지 시공 및 마감', jobCount: 0, group: 'construction' },
  { id: 'paint', name: '페인트', icon: 'Paintbrush', description: '페인팅 및 도장 작업', jobCount: 0, group: 'construction' },
  { id: 'electrical', name: '전기', icon: 'Zap', description: '전기 배선 및 설비', jobCount: 0, group: 'construction' },
  { id: 'plumbing', name: '설비(배관)', icon: 'Pipette', description: '배관 설비 및 수리', jobCount: 0, group: 'construction' },
  { id: 'flooring', name: '바닥', icon: 'Square', description: '바닥재 시공 (마루, 장판 등)', jobCount: 0, group: 'construction' },
  { id: 'window', name: '창호', icon: 'DoorOpen', description: '창문 및 문 시공', jobCount: 0, group: 'construction' },
  { id: 'furniture', name: '가구/싱크대', icon: 'Armchair', description: '붙박이장, 싱크대 등 제작 설치', jobCount: 0, group: 'material' },
  { id: 'lighting', name: '조명', icon: 'Lightbulb', description: '조명 설계 및 설치', jobCount: 0, group: 'material' },
  { id: 'waterproof', name: '방수', icon: 'Droplets', description: '방수 처리 및 시공', jobCount: 0, group: 'construction' },
  { id: 'film', name: '필름', icon: 'Film', description: '인테리어 필름 시공', jobCount: 0, group: 'material' },
  { id: 'labor', name: '인력', icon: 'HardHat', description: '인력 공급 및 파견', jobCount: 0, group: 'service' },
  { id: 'cleaning', name: '청소', icon: 'SprayCan', description: '입주 청소 및 사후 관리', jobCount: 0, group: 'service' },
  { id: 'aircon', name: '에어컨', icon: 'AirVent', description: '에어컨 설치 및 이전', jobCount: 0, group: 'service' },
  { id: 'design', name: '설계 디자이너', icon: 'PenTool', description: '인테리어 설계 및 디자인', jobCount: 0, group: 'service' },
  { id: 'sitemanager', name: '현장소장', icon: 'ClipboardList', description: '현장 관리 및 공정 총괄', jobCount: 0, group: 'service' },
];
