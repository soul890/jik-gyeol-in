import { cn } from '@/utils/cn';

interface Tab {
  id: string;
  label: string;
  count?: number;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}

export function Tabs({ tabs, activeTab, onChange, className }: TabsProps) {
  return (
    <div className={cn('flex gap-1 p-1 bg-warm-100 rounded-lg', className)}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            'flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors cursor-pointer',
            activeTab === tab.id
              ? 'bg-white text-warm-800 shadow-sm'
              : 'text-warm-500 hover:text-warm-700',
          )}
        >
          {tab.label}
          {tab.count !== undefined && (
            <span className="ml-1.5 text-xs text-warm-400">({tab.count})</span>
          )}
        </button>
      ))}
    </div>
  );
}
