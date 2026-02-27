import { useEffect } from 'react';

const BASE_TITLE = '직결-인 | 인테리어 직거래 플랫폼';

export function usePageTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} | 직결-인` : BASE_TITLE;
    return () => {
      document.title = BASE_TITLE;
    };
  }, [title]);
}
