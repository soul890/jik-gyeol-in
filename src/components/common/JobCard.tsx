import { Link } from 'react-router-dom';
import { MapPin, Clock, Eye } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { categories } from '@/data/categories';
import { formatDate } from '@/utils/format';
import type { Job } from '@/types';

interface JobCardProps {
  job: Job;
}

export function JobCard({ job }: JobCardProps) {
  const category = categories.find((c) => c.id === job.categoryId);

  return (
    <Link to={`/jobs/${job.id}`}>
      <Card hover>
        <CardContent>
          <div className="flex items-start justify-between gap-2 mb-3">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant={job.type === '구인' ? 'primary' : 'accent'}>
                {job.type}
              </Badge>
              {job.isUrgent && <Badge variant="warning">급구</Badge>}
              {category && <Badge>{category.name}</Badge>}
            </div>
          </div>

          <h3 className="font-semibold text-warm-800 mb-2 line-clamp-2 leading-snug">
            {job.title}
          </h3>

          <div className="space-y-1.5 text-sm text-warm-500">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              <span>{job.location}</span>
              <span className="mx-1">·</span>
              <span className="font-medium text-primary-600">{job.pay}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {formatDate(job.createdAt)}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" />
                {job.views}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
