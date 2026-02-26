import { Link } from 'react-router-dom';
import {
  Hammer, TreePine, Grid3x3, Wallpaper, Paintbrush, Zap,
  Pipette, Square, DoorOpen, Armchair, Lightbulb, Droplets, Film,
} from 'lucide-react';
import { categories } from '@/data/categories';
import { SectionHeader } from '@/components/common/SectionHeader';

const iconMap: Record<string, React.ElementType> = {
  Hammer, TreePine, Grid3x3, Wallpaper, Paintbrush, Zap,
  Pipette, Square, DoorOpen, Armchair, Lightbulb, Droplets, Film,
};

export function QuickCategorySearch() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <SectionHeader title="공정별 찾기" subtitle="필요한 공정을 선택하세요" />
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-4">
        {categories.map((cat) => {
          const Icon = iconMap[cat.icon] || Hammer;
          return (
            <Link
              key={cat.id}
              to={`/jobs?category=${cat.id}`}
              className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white border border-warm-200 hover:border-primary-300 hover:shadow-sm transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center group-hover:bg-primary-100 transition-colors">
                <Icon className="w-6 h-6 text-primary-500" />
              </div>
              <span className="text-sm font-medium text-warm-700">{cat.name}</span>
              <span className="text-xs text-warm-400">{cat.jobCount}건</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
