import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { FileUpload } from '@/components/ui/FileUpload';
import { categories } from '@/data/categories';
import { db, storage } from '@/lib/firebase';
import { cn } from '@/utils/cn';
import { useSubscription } from '@/hooks/useSubscription';
import { useAuth } from '@/contexts/AuthContext';

export function CompanyRegisterPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { maxPortfolioImages } = useSubscription();
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedCats, setSelectedCats] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [location, setLocation] = useState('');
  const [experience, setExperience] = useState('');
  const [employees, setEmployees] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const [licenseFile, setLicenseFile] = useState<File[]>([]);
  const [portfolioFiles, setPortfolioFiles] = useState<File[]>([]);

  const toggleCategory = (id: string) => {
    setSelectedCats((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );
  };

  const uploadFile = async (file: File, path: string): Promise<string> => {
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const companyId = crypto.randomUUID();

      let businessLicenseUrl = '';
      if (licenseFile.length > 0) {
        businessLicenseUrl = await uploadFile(
          licenseFile[0],
          `companies/${companyId}/license/${licenseFile[0].name}`,
        );
      }

      const portfolioImageUrls: string[] = [];
      for (const file of portfolioFiles) {
        const url = await uploadFile(
          file,
          `companies/${companyId}/portfolio/${file.name}`,
        );
        portfolioImageUrls.push(url);
      }

      await addDoc(collection(db, 'companies'), {
        uid: user?.uid || '',
        name,
        description: desc,
        categories: selectedCats,
        location,
        experience,
        employeeCount: employees,
        phone,
        contact: email,
        rating: 0,
        reviewCount: 0,
        portfolio: [],
        portfolioImages: portfolioImageUrls,
        businessLicenseUrl,
        createdAt: new Date().toISOString().split('T')[0],
      });

      setShowSuccess(true);
    } catch {
      setError('등록에 실패했습니다. Firebase 설정을 확인해주세요.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <Link to="/companies" className="inline-flex items-center gap-1 text-sm text-warm-500 hover:text-warm-700 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        목록으로
      </Link>

      <h1 className="text-2xl font-bold text-warm-800 mb-6">인테리어 업체 등록</h1>

      <Card>
        <CardContent className="py-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3">
                {error}
              </div>
            )}

            <Input id="name" label="업체명" placeholder="업체명을 입력하세요" value={name} onChange={(e) => setName(e.target.value)} required />

            <Textarea id="desc" label="업체 소개" placeholder="업체를 소개해주세요" rows={4} value={desc} onChange={(e) => setDesc(e.target.value)} />

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-warm-700">전문 공정 (복수 선택)</label>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => toggleCategory(cat.id)}
                    className={cn(
                      'px-3 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer',
                      selectedCats.includes(cat.id)
                        ? 'bg-primary-500 text-white'
                        : 'bg-warm-100 text-warm-600 hover:bg-warm-200',
                    )}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            <Input id="location" label="위치" placeholder="예: 서울 강남구" value={location} onChange={(e) => setLocation(e.target.value)} />
            <Input id="experience" label="경력" placeholder="예: 15년" value={experience} onChange={(e) => setExperience(e.target.value)} />
            <Input id="employees" label="직원 수" placeholder="예: 10명" value={employees} onChange={(e) => setEmployees(e.target.value)} />
            <Input id="phone" label="전화번호" placeholder="02-XXXX-XXXX" value={phone} onChange={(e) => setPhone(e.target.value)} />
            <Input id="email" label="이메일" placeholder="example@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />

            <FileUpload
              label="사업자등록증 (이미지 또는 PDF, 1개)"
              accept="image/*,.pdf"
              onChange={setLicenseFile}
            />

            <FileUpload
              label={`시공 사례 사진 (최대 ${maxPortfolioImages}장)`}
              accept="image/*"
              multiple
              maxFiles={maxPortfolioImages}
              onChange={setPortfolioFiles}
            />

            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex-1" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    등록 중...
                  </>
                ) : '등록하기'}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate('/companies')} disabled={submitting}>
                취소
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Modal isOpen={showSuccess} onClose={() => { setShowSuccess(false); navigate('/companies'); }} title="등록 완료">
        <p className="text-warm-600 mb-4">업체가 등록되었습니다.</p>
        <Button onClick={() => { setShowSuccess(false); navigate('/companies'); }} className="w-full">
          확인
        </Button>
      </Modal>
    </div>
  );
}
