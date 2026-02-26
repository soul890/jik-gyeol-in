import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, Eye, Phone, User } from 'lucide-react';
import { jobs } from '@/data/jobs';
import { categories } from '@/data/categories';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { formatDate } from '@/utils/format';

export function JobDetailPage() {
  const { id } = useParams();
  const job = jobs.find((j) => j.id === id);

  if (!job) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center">
        <h2 className="text-xl font-semibold text-warm-700 mb-4">게시글을 찾을 수 없습니다</h2>
        <Link to="/jobs">
          <Button variant="outline">목록으로 돌아가기</Button>
        </Link>
      </div>
    );
  }

  const category = categories.find((c) => c.id === job.categoryId);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <Link to="/jobs" className="inline-flex items-center gap-1 text-sm text-warm-500 hover:text-warm-700 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        목록으로
      </Link>

      <Card>
        <CardContent className="py-6">
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <Badge variant={job.type === '구인' ? 'primary' : 'accent'}>{job.type}</Badge>
            {job.isUrgent && <Badge variant="warning">급구</Badge>}
            {category && <Badge>{category.name}</Badge>}
          </div>

          <h1 className="text-2xl font-bold text-warm-800 mb-4">{job.title}</h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-warm-500 mb-6 pb-6 border-b border-warm-200">
            <span className="flex items-center gap-1">
              <User className="w-4 h-4" />
              {job.author}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {job.location}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {formatDate(job.createdAt)}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              조회 {job.views}
            </span>
          </div>

          <div className="mb-6">
            <div className="inline-block px-4 py-2 bg-primary-50 rounded-lg mb-6">
              <span className="text-sm text-warm-500">급여/단가</span>
              <p className="text-lg font-bold text-primary-700">{job.pay}</p>
            </div>

            <div className="prose prose-warm max-w-none">
              {job.description.split('\n').map((line, i) => (
                <p key={i} className="text-warm-700 leading-relaxed mb-1">
                  {line || <br />}
                </p>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 pt-6 border-t border-warm-200">
            <Phone className="w-5 h-5 text-primary-500" />
            <div>
              <p className="text-sm text-warm-500">연락처</p>
              <p className="font-semibold text-warm-800">{job.contact}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
