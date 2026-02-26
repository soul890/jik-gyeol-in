import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ArrowLeft, MapPin, Phone, Mail, Users, Calendar, Briefcase, X } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { companies as staticCompanies } from '@/data/companies';
import { categories } from '@/data/categories';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Rating } from '@/components/ui/Rating';
import { db } from '@/lib/firebase';
import type { Company } from '@/types';

export function CompanyDetailPage() {
  const { id } = useParams();
  const [company, setCompany] = useState<Company | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);

  useEffect(() => {
    const staticMatch = staticCompanies.find((c) => c.id === id);
    if (staticMatch) {
      setCompany(staticMatch);
      setLoading(false);
      return;
    }

    if (!id) {
      setLoading(false);
      return;
    }

    getDoc(doc(db, 'companies', id))
      .then((snap) => {
        if (snap.exists()) {
          setCompany({ id: snap.id, ...snap.data() } as Company);
        }
      })
      .catch(() => {
        // Firebase 미연결
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!company) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center">
        <h2 className="text-xl font-semibold text-warm-700 mb-4">업체를 찾을 수 없습니다</h2>
        <Link to="/companies">
          <Button variant="outline">목록으로 돌아가기</Button>
        </Link>
      </div>
    );
  }

  const portfolioImages = company.portfolioImages ?? [];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <Link to="/companies" className="inline-flex items-center gap-1 text-sm text-warm-500 hover:text-warm-700 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        목록으로
      </Link>

      <Card>
        <CardContent className="py-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center shrink-0">
              <span className="text-primary-600 font-bold text-2xl">{company.name[0]}</span>
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-warm-800 mb-1">{company.name}</h1>
              <Rating value={company.rating} size="md" />
              <p className="text-sm text-warm-400 mt-1">리뷰 {company.reviewCount}개</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {company.categories.map((catId) => {
              const cat = categories.find((c) => c.id === catId);
              return cat ? <Badge key={catId} variant="primary">{cat.name}</Badge> : null;
            })}
          </div>

          <p className="text-warm-700 leading-relaxed mb-6">{company.description}</p>

          <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-warm-50 rounded-xl">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-warm-400" />
              <div>
                <p className="text-xs text-warm-400">위치</p>
                <p className="text-sm font-medium text-warm-700">{company.location}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-warm-400" />
              <div>
                <p className="text-xs text-warm-400">경력</p>
                <p className="text-sm font-medium text-warm-700">{company.experience}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-warm-400" />
              <div>
                <p className="text-xs text-warm-400">직원 수</p>
                <p className="text-sm font-medium text-warm-700">{company.employeeCount}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-warm-400" />
              <div>
                <p className="text-xs text-warm-400">등록일</p>
                <p className="text-sm font-medium text-warm-700">{company.createdAt}</p>
              </div>
            </div>
          </div>

          {portfolioImages.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-warm-800 mb-3">시공 사례 사진</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {portfolioImages.map((url, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setLightboxUrl(url)}
                    className="aspect-[4/3] rounded-lg overflow-hidden border border-warm-200 cursor-pointer hover:opacity-90 transition-opacity"
                  >
                    <img
                      src={url}
                      alt={`시공 사례 ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mb-6">
            <h3 className="font-semibold text-warm-800 mb-3">포트폴리오</h3>
            <div className="space-y-2">
              {company.portfolio.map((item, i) => (
                <div key={i} className="flex items-center gap-2 p-3 bg-warm-50 rounded-lg">
                  <div className="w-2 h-2 bg-primary-400 rounded-full" />
                  <span className="text-sm text-warm-700">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-6 border-t border-warm-200">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-primary-500" />
              <span className="text-sm text-warm-700">{company.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-primary-500" />
              <span className="text-sm text-warm-700">{company.contact}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {lightboxUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70" onClick={() => setLightboxUrl(null)}>
          <button
            onClick={() => setLightboxUrl(null)}
            className="absolute top-4 right-4 p-2 bg-white/20 rounded-full text-white hover:bg-white/30 transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={lightboxUrl}
            alt="시공 사례"
            className="max-w-full max-h-[85vh] rounded-lg object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
