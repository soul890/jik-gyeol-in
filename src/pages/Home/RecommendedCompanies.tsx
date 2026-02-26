import { companies } from '@/data/companies';
import { CompanyCard } from '@/components/common/CompanyCard';
import { SectionHeader } from '@/components/common/SectionHeader';

export function RecommendedCompanies() {
  const topCompanies = [...companies]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3);

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 py-14">
      <SectionHeader
        title="추천 업체"
        subtitle="검증된 인테리어 전문 업체"
        linkTo="/companies"
        linkText="전체보기"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {topCompanies.map((company) => (
          <CompanyCard key={company.id} company={company} />
        ))}
      </div>
    </section>
  );
}
