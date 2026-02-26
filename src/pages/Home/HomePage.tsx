import { HeroSection } from './HeroSection';
import { FeatureHighlights } from './FeatureHighlights';
import { AIDesignBanner } from './AIDesignBanner';
import { QuickCategorySearch } from './QuickCategorySearch';
import { RecommendedCompanies } from './RecommendedCompanies';
import { LatestJobs } from './LatestJobs';
import { RecentCommunity } from './RecentCommunity';

export function HomePage() {
  return (
    <>
      <HeroSection />
      <FeatureHighlights />
      <AIDesignBanner />
      <QuickCategorySearch />
      <RecommendedCompanies />
      <LatestJobs />
      <RecentCommunity />
    </>
  );
}
