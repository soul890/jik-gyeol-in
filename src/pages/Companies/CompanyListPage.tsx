import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { companies as staticCompanies } from '@/data/companies';
import { CompanyCard } from '@/components/common/CompanyCard';
import { CategoryFilter } from '@/components/common/CategoryFilter';
import { SearchBar } from '@/components/ui/SearchBar';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { db } from '@/lib/firebase';
import { usePageTitle } from '@/hooks/usePageTitle';
import type { Company } from '@/types';

export function CompanyListPage() {
  usePageTitle('인테리어 업체');
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');
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
      .catch(() => {
        // Firebase 미연결 시 정적 데이터만 사용
      });
  }, []);

  const allCompanies = useMemo(() => {
    const firestoreIds = new Set(firestoreCompanies.map((d) => d.id));
    const uniqueStatic = staticCompanies.filter((d) => !firestoreIds.has(d.id));
    return [...firestoreCompanies, ...uniqueStatic];
  }, [firestoreCompanies]);

  const filtered = useMemo(() => {
    return allCompanies.filter((c) => {
      if (category !== 'all' && !c.categories.includes(category)) return false;
      if (search && !c.name.includes(search) && !c.description.includes(search)) return false;
      return true;
    });
  }, [allCompanies, category, search]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-warm-800">인테리어 업체</h1>
          <p className="text-sm text-warm-500 mt-1">검증된 인테리어 업체를 찾아보세요</p>
        </div>
        <Link to="/companies/register">
          <Button>
            <Plus className="w-4 h-4" />
            업체 등록
          </Button>
        </Link>
      </div>

      <div className="space-y-4 mb-6">
        <SearchBar placeholder="업체명 또는 키워드 검색..." onSearch={setSearch} />
        <CategoryFilter selected={category} onChange={setCategory} />
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((company) => (
            <CompanyCard key={company.id} company={company} />
          ))}
        </div>
      ) : (
        <EmptyState title="등록된 업체가 없습니다" description="검색 조건을 변경해보세요." />
      )}
    </div>
  );
}
