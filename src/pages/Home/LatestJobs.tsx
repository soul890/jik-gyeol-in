import { jobs } from '@/data/jobs';
import { JobCard } from '@/components/common/JobCard';
import { SectionHeader } from '@/components/common/SectionHeader';

export function LatestJobs() {
  const latestJobs = jobs.slice(0, 3);

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 py-14">
      <SectionHeader
        title="최신 구인구직"
        subtitle="방금 올라온 새로운 일감"
        linkTo="/jobs"
        linkText="전체보기"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {latestJobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </section>
  );
}
