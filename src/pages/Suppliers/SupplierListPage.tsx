import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { SupplierCard } from '@/components/common/SupplierCard';
import { SearchBar } from '@/components/ui/SearchBar';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { db } from '@/lib/firebase';
import { usePageTitle } from '@/hooks/usePageTitle';
import type { Supplier } from '@/types';

export function SupplierListPage() {
  usePageTitle('자재업체');
  const [search, setSearch] = useState('');
  const [firestoreSuppliers, setFirestoreSuppliers] = useState<Supplier[]>([]);

  useEffect(() => {
    getDocs(collection(db, 'suppliers'))
      .then((snapshot) => {
        const docs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Supplier[];
        setFirestoreSuppliers(docs);
      })
      .catch(() => {});
  }, []);

  const allSuppliers = firestoreSuppliers;

  const filtered = useMemo(() => {
    return allSuppliers.filter((s) => {
      if (search && !s.name.includes(search) && !s.products.some((p) => p.includes(search))) return false;
      return true;
    });
  }, [allSuppliers, search]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-warm-800">자재업체</h1>
          <p className="text-sm text-warm-500 mt-1">인테리어 자재를 합리적으로 구매하세요</p>
        </div>
        <Link to="/suppliers/register">
          <Button>
            <Plus className="w-4 h-4" />
            업체 등록
          </Button>
        </Link>
      </div>

      <div className="mb-6">
        <SearchBar placeholder="업체명 또는 제품 검색..." onSearch={setSearch} />
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((supplier) => (
            <SupplierCard key={supplier.id} supplier={supplier} />
          ))}
        </div>
      ) : (
        <EmptyState title="등록된 자재업체가 없습니다" description="검색 조건을 변경해보세요." />
      )}
    </div>
  );
}
