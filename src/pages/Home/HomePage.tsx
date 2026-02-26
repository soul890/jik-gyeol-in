import { HeroSection } from './HeroSection';
import { FeatureHighlights } from './FeatureHighlights';
import { QuickCategorySearch } from './QuickCategorySearch';
import { LatestJobs } from './LatestJobs';
import { RecentCommunity } from './RecentCommunity';

export function HomePage() {
  return (
    <>
      <HeroSection />
      <FeatureHighlights />
      <QuickCategorySearch />
      <LatestJobs />
      <RecentCommunity />
    </>
  );
}
