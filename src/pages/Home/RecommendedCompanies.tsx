import { useState, useEffect, useMemo } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { CompanyCard } from '@/components/common/CompanyCard';
import { SectionHeader } from '@/components/common/SectionHeader';
import { db } from '@/lib/firebase';
import type { Company } from '@/types';

export function RecommendedCompanies() {
  const [firestoreCompanies, setFirestoreCompanies] = useState<Company[]>([]);

  useEffect(() => {
    getDocs(collection(db, 'companies'))
      .then((snapshot) => {
        const docs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Company[];
        setFirestoreCompanies(docs);
      })
      .catch(() => {});
  }, []);

  const topCompanies = useMemo(() => {
    return [...firestoreCompanies]
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 3);
  }, [firestoreCompanies]);

  if (topCompanies.length === 0) return null;

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 py-14">
      <SectionHeader
        title="추천 업체"
        subtitle="검증된 인테리어 전문 업체"
        linkTo="/companies"
        linkText="전체보기"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
        {topCompanies.map((company) => (
          <CompanyCard key={company.id} company={company} />
        ))}
      </div>
    </section>
  );
}
