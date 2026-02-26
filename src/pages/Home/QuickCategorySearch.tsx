import { Link } from 'react-router-dom';
import {
  Hammer, TreePine, Grid3x3, Wallpaper, Paintbrush, Zap,
  Pipette, Square, DoorOpen, Armchair, Lightbulb, Droplets, Film,
} from 'lucide-react';
import { categories } from '@/data/categories';

const iconMap: Record<string, React.ElementType> = {
  Hammer, TreePine, Grid3x3, Wallpaper, Paintbrush, Zap,
  Pipette, Square, DoorOpen, Armchair, Lightbulb, Droplets, Film,
};

export function QuickCategorySearch() {
  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 py-14">
      <h2 className="text-2xl font-bold text-warm-800 mb-8">공정별 찾기</h2>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-6">
        {categories.map((cat) => {
          const Icon = iconMap[cat.icon] || Hammer;
          return (
            <Link
              key={cat.id}
              to={`/jobs?category=${cat.id}`}
              className="flex flex-col items-center gap-2.5 group"
            >
              <div className="w-16 h-16 rounded-2xl border border-warm-200 bg-white flex items-center justify-center group-hover:border-primary-300 group-hover:shadow-sm transition-all">
                <Icon className="w-7 h-7 text-warm-500 group-hover:text-primary-500 transition-colors" />
              </div>
              <span className="text-sm text-warm-700 font-medium">{cat.name}</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
