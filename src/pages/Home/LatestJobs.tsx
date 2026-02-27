import { useState, useEffect, useMemo } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { JobCard } from '@/components/common/JobCard';
import { SectionHeader } from '@/components/common/SectionHeader';
import { db } from '@/lib/firebase';
import type { Job } from '@/types';

export function LatestJobs() {
  const [firestoreJobs, setFirestoreJobs] = useState<Job[]>([]);

  useEffect(() => {
    getDocs(collection(db, 'jobs'))
      .then((snapshot) => {
        const docs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Job[];
        setFirestoreJobs(docs);
      })
      .catch(() => {});
  }, []);

  const latestJobs = useMemo(() => {
    return [...firestoreJobs]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 3);
  }, [firestoreJobs]);

  if (latestJobs.length === 0) return null;

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
