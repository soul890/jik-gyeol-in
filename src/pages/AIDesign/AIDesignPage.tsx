import { useState } from 'react';
import {
  X,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Download,
  RefreshCw,
  ImageIcon,
  CheckCircle,
  Paintbrush,
  Sofa,
} from 'lucide-react';
import { doc, updateDoc, increment } from 'firebase/firestore';
import { Button } from '@/components/ui/Button';
import { FileUpload } from '@/components/ui/FileUpload';
import { cn } from '@/utils/cn';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/hooks/useSubscription';
import { SubscriptionModal } from '@/components/SubscriptionModal';
import { LoginPromptModal } from '@/components/LoginPromptModal';
import { db } from '@/lib/firebase';

// ── Constants ───────────────────────────────────────────────────────

const STYLE_PRESETS = [
  '모던', '미니멀', '내추럴', '빈티지', '북유럽',
  '한국 전통', '인더스트리얼', '클래식', '보헤미안', '재패니즈',
] as const;

const ROOM_TYPES = [
  '거실', '침실', '주방', '욕실', '사무실',
  '서재', '아이방', '현관', '다용도실',
] as const;

// ── Types ───────────────────────────────────────────────────────────

interface AnalysisResult {
  changes: string[];
  style: string;
  estimatedMaterials: string[];
}

// ── Component ───────────────────────────────────────────────────────

export function AIDesignPage() {
  const { user, profile, refreshProfile } = useAuth();
  const { isLoggedIn, canUseAIDesign, aiDesignUsed, aiDesignLimit } = useSubscription();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSubModal, setShowSubModal] = useState(false);

  const [step, setStep] = useState(1);

  // Step 1 — room photo
  const [roomImage, setRoomImage] = useState<File | null>(null);
  const [roomPreview, setRoomPreview] = useState<string>('');

  // Step 2 — style options
  const [selectedStyle, setSelectedStyle] = useState('모던');
  const [roomType, setRoomType] = useState('거실');
  const [description, setDescription] = useState('');
  const [materialFiles, setMaterialFiles] = useState<File[]>([]);

  // Step 3 — results
  const [loading, setLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string>('');
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState('');
  const [showBefore, setShowBefore] = useState(false);

  // ── Handlers ────────────────────────────────────────────────────

  const handleRoomImageSelect = (files: File[]) => {
    if (files.length > 0) {
      const file = files[0];
      setRoomImage(file);
      setRoomPreview(URL.createObjectURL(file));
    } else {
      setRoomImage(null);
      setRoomPreview('');
    }
  };

  const removeRoomImage = () => {
    setRoomImage(null);
    setRoomPreview('');
  };

  const handleGenerate = async () => {
    if (!roomImage) return;

    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }

    if (!canUseAIDesign) {
      setShowSubModal(true);
      return;
    }

    setLoading(true);
    setError('');
    setGeneratedImage('');
    setAnalysis(null);
    setStep(3);

    try {
      const formData = new FormData();
      formData.append('image', roomImage);
      formData.append('style', selectedStyle);
      formData.append('roomType', roomType);
      formData.append('description', description);

      for (const file of materialFiles) {
        formData.append('materialImages', file);
      }

      const idToken = await user!.getIdToken();
      const res = await fetch('/api/interior-design', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'AI 처리 중 오류가 발생했습니다.');
      }

      setGeneratedImage(data.generatedImage);
      setAnalysis(data.analysis);

      // Increment usage count + 월 리셋 처리
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        const now = new Date();
        const lastReset = profile?.usage?.lastResetDate;
        const isSameMonth = lastReset
          && new Date(lastReset).getFullYear() === now.getFullYear()
          && new Date(lastReset).getMonth() === now.getMonth();

        if (isSameMonth) {
          await updateDoc(userRef, {
            'usage.aiDesignCount': increment(1),
          }).catch(() => {});
        } else {
          // 새 달이면 카운트를 1로 리셋
          await updateDoc(userRef, {
            'usage.aiDesignCount': 1,
            'usage.lastResetDate': now.toISOString(),
          }).catch(() => {});
        }
        refreshProfile();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!generatedImage) return;
    const link = document.createElement('a');
    link.href = `data:image/png;base64,${generatedImage}`;
    link.download = `ai-interior-${selectedStyle}-${roomType}.png`;
    link.click();
  };

  const handleRetry = () => {
    setStep(2);
    setGeneratedImage('');
    setAnalysis(null);
    setError('');
  };

  const handleReset = () => {
    setStep(1);
    setRoomImage(null);
    setRoomPreview('');
    setSelectedStyle('모던');
    setRoomType('거실');
    setDescription('');
    setMaterialFiles([]);
    setGeneratedImage('');
    setAnalysis(null);
    setError('');
  };

  // ── Render ──────────────────────────────────────────────────────

  return (
    <div className="min-h-[80vh]">
      {/* Header */}
      <section className="bg-gradient-to-br from-primary-50 via-white to-primary-100 border-b border-warm-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-accent" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-warm-900">
              AI 인테리어 디자인
            </h1>
          </div>
          <p className="text-warm-500 max-w-xl">
            현재 방 사진을 업로드하고 원하는 스타일을 선택하면,
            AI가 구조를 유지한 채 실사 수준의 인테리어 변환 이미지를 생성합니다.
          </p>
          {isLoggedIn && (
            <p className="text-sm text-warm-400 mt-2">
              이번 달 사용: <span className="font-semibold text-warm-600">{aiDesignUsed}</span> / {aiDesignLimit}회
            </p>
          )}

          {/* Stepper */}
          <div className="flex items-center gap-2 mt-8">
            {[
              { num: 1, label: '사진 업로드', icon: ImageIcon },
              { num: 2, label: '스타일 선택', icon: Paintbrush },
              { num: 3, label: 'AI 생성 결과', icon: Sparkles },
            ].map(({ num, label, icon: Icon }, idx) => (
              <div key={num} className="flex items-center gap-2">
                {idx > 0 && (
                  <div
                    className={cn(
                      'w-8 sm:w-12 h-0.5',
                      step >= num ? 'bg-primary-500' : 'bg-warm-200',
                    )}
                  />
                )}
                <div className="flex items-center gap-1.5">
                  <div
                    className={cn(
                      'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors',
                      step > num
                        ? 'bg-primary-500 text-white'
                        : step === num
                          ? 'bg-primary-500 text-white'
                          : 'bg-warm-200 text-warm-500',
                    )}
                  >
                    {step > num ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <Icon className="w-3.5 h-3.5" />
                    )}
                  </div>
                  <span
                    className={cn(
                      'text-xs sm:text-sm font-medium hidden sm:block',
                      step >= num ? 'text-primary-700' : 'text-warm-400',
                    )}
                  >
                    {label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* ── Step 1: Upload Room Photo ───────────────────────── */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-warm-800 mb-1">
                현재 방 사진을 업로드하세요
              </h2>
              <p className="text-sm text-warm-500">
                AI가 분석할 수 있도록 방 전체가 잘 보이는 사진을 선택해주세요.
              </p>
            </div>

            {!roomPreview ? (
              <FileUpload
                label=""
                accept="image/*"
                onChange={handleRoomImageSelect}
              />
            ) : (
              <div className="relative rounded-xl overflow-hidden border border-warm-200">
                <img
                  src={roomPreview}
                  alt="업로드한 방 사진"
                  className="w-full max-h-[400px] object-contain bg-warm-50"
                />
                <button
                  type="button"
                  onClick={removeRoomImage}
                  className="absolute top-3 right-3 w-8 h-8 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            <div className="flex justify-end">
              <Button
                disabled={!roomImage}
                onClick={() => setStep(2)}
              >
                다음: 스타일 선택
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* ── Step 2: Style Selection ────────────────────────── */}
        {step === 2 && (
          <div className="space-y-8">
            {/* Room photo preview */}
            {roomPreview && (
              <div className="rounded-xl overflow-hidden border border-warm-200">
                <img
                  src={roomPreview}
                  alt="업로드한 방 사진"
                  className="w-full max-h-[250px] object-contain bg-warm-50"
                />
              </div>
            )}

            {/* Style presets */}
            <div>
              <h2 className="text-lg font-semibold text-warm-800 mb-3">
                인테리어 스타일
              </h2>
              <div className="flex flex-wrap gap-2">
                {STYLE_PRESETS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSelectedStyle(s)}
                    className={cn(
                      'px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer',
                      selectedStyle === s
                        ? 'bg-primary-500 text-white'
                        : 'bg-warm-100 text-warm-600 hover:bg-warm-200',
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Room type */}
            <div>
              <h2 className="text-lg font-semibold text-warm-800 mb-3">
                공간 유형
              </h2>
              <div className="flex flex-wrap gap-2">
                {ROOM_TYPES.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRoomType(r)}
                    className={cn(
                      'px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer',
                      roomType === r
                        ? 'bg-primary-500 text-white'
                        : 'bg-warm-100 text-warm-600 hover:bg-warm-200',
                    )}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Free text description */}
            <div>
              <h2 className="text-lg font-semibold text-warm-800 mb-3">
                추가 요청사항
              </h2>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="예: 밝은 원목 바닥 + 화이트 벽 + 간접조명, 따뜻한 분위기로..."
                rows={3}
                className="w-full rounded-lg border border-warm-300 px-4 py-3 text-sm text-warm-800 placeholder:text-warm-400 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-300 resize-y"
              />
            </div>

            {/* Material images */}
            <div>
              <h2 className="text-lg font-semibold text-warm-800 mb-1">
                마감재 사진
                <span className="text-sm font-normal text-warm-400 ml-2">선택</span>
              </h2>
              <p className="text-sm text-warm-500 mb-3">
                적용하고 싶은 바닥재, 벽지, 타일 등의 사진을 업로드하세요.
              </p>
              <FileUpload
                accept="image/*"
                multiple
                maxFiles={3}
                onChange={setMaterialFiles}
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-warm-200">
              <Button variant="ghost" onClick={() => setStep(1)}>
                <ArrowLeft className="w-4 h-4" />
                이전
              </Button>
              <Button onClick={handleGenerate}>
                <Sparkles className="w-4 h-4" />
                AI 디자인 생성
              </Button>
            </div>
          </div>
        )}

        {/* ── Step 3: Results ────────────────────────────────── */}
        {step === 3 && (
          <div className="space-y-8">
            {/* Loading state */}
            {loading && (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full border-4 border-primary-100 border-t-primary-500 animate-spin" />
                  <Sparkles className="w-6 h-6 text-primary-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>
                <p className="text-warm-700 font-medium mt-6">AI가 인테리어를 디자인하고 있습니다...</p>
                <p className="text-sm text-warm-400 mt-1">약 30초~1분 정도 소요됩니다</p>
              </div>
            )}

            {/* Error state */}
            {error && !loading && (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <X className="w-8 h-8 text-red-400" />
                </div>
                <p className="text-warm-800 font-medium mb-2">오류가 발생했습니다</p>
                <p className="text-sm text-warm-500 mb-6">{error}</p>
                <div className="flex items-center justify-center gap-3">
                  <Button variant="outline" onClick={handleRetry}>
                    <RefreshCw className="w-4 h-4" />
                    다시 시도
                  </Button>
                  <Button variant="ghost" onClick={handleReset}>
                    처음부터
                  </Button>
                </div>
              </div>
            )}

            {/* Success state */}
            {generatedImage && !loading && (
              <>
                {/* Before / After Toggle */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-warm-800">
                      변환 전 / 후 비교
                    </h2>
                    <div className="flex items-center bg-warm-100 rounded-lg p-0.5">
                      <button
                        type="button"
                        onClick={() => setShowBefore(false)}
                        className={cn(
                          'px-3 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer',
                          !showBefore
                            ? 'bg-white text-warm-800 shadow-sm'
                            : 'text-warm-500',
                        )}
                      >
                        변환 후
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowBefore(true)}
                        className={cn(
                          'px-3 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer',
                          showBefore
                            ? 'bg-white text-warm-800 shadow-sm'
                            : 'text-warm-500',
                        )}
                      >
                        변환 전
                      </button>
                    </div>
                  </div>

                  <div className="rounded-xl overflow-hidden border border-warm-200 bg-warm-50">
                    {showBefore ? (
                      <img
                        src={roomPreview}
                        alt="원본 사진"
                        className="w-full max-h-[500px] object-contain"
                      />
                    ) : (
                      <img
                        src={`data:image/png;base64,${generatedImage}`}
                        alt="AI 생성 이미지"
                        className="w-full max-h-[500px] object-contain"
                      />
                    )}
                  </div>
                </div>

                {/* Analysis */}
                {analysis && (
                  <div className="bg-warm-50 rounded-xl p-6 border border-warm-200">
                    <h3 className="font-semibold text-warm-800 mb-3 flex items-center gap-2">
                      <Sofa className="w-5 h-5 text-primary-500" />
                      AI 분석 코멘트
                    </h3>
                    <div className="space-y-3">
                      {analysis.changes?.length > 0 && (
                        <div>
                          <p className="text-sm font-medium text-warm-600 mb-1">적용된 변경 사항</p>
                          <ul className="space-y-1">
                            {analysis.changes.map((c, i) => (
                              <li key={i} className="text-sm text-warm-700 flex items-start gap-2">
                                <CheckCircle className="w-4 h-4 text-primary-500 shrink-0 mt-0.5" />
                                {c}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {analysis.style && (
                        <p className="text-sm text-warm-600">
                          <span className="font-medium">적용 스타일:</span>{' '}
                          <span className="text-warm-800">{analysis.style}</span>
                        </p>
                      )}
                      {analysis.estimatedMaterials?.length > 0 && (
                        <div>
                          <p className="text-sm font-medium text-warm-600 mb-1">추천 자재</p>
                          <div className="flex flex-wrap gap-2">
                            {analysis.estimatedMaterials.map((m, i) => (
                              <span
                                key={i}
                                className="px-2.5 py-1 bg-primary-50 text-primary-700 text-xs font-medium rounded-full"
                              >
                                {m}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
                  <Button onClick={handleDownload}>
                    <Download className="w-4 h-4" />
                    이미지 다운로드
                  </Button>
                  <Button variant="outline" onClick={handleRetry}>
                    <RefreshCw className="w-4 h-4" />
                    다시 시도
                  </Button>
                  <Button variant="ghost" onClick={handleReset}>
                    새로운 사진으로
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      <LoginPromptModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
      <SubscriptionModal isOpen={showSubModal} onClose={() => setShowSubModal(false)} trigger="ai-design" />
    </div>
  );
}
