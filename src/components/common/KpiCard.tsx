import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  changeText?: string;
  icon?: LucideIcon;
  iconBgColor?: string;
  badge?: {
    text: string;
    type: 'critical' | 'warning' | 'info' | 'success';
  };
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  subtitle,
  changeText,
  icon: Icon,
  iconBgColor = 'bg-blue-50 text-blue-600',
  badge,
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded p-4 shadow-2xs flex flex-col justify-between">
      <div className="flex items-start justify-between">
        <div>
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            {title}
          </span>
          <div className="text-2xl font-bold text-slate-900 mt-1 font-mono tracking-tight">
            {value}
          </div>
        </div>

        {Icon && (
          <div className={`p-2 rounded ${iconBgColor}`}>
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-slate-100">
        {subtitle && <span className="text-slate-500 text-[11px]">{subtitle}</span>}
        {changeText && <span className="text-slate-600 font-medium text-[11px]">{changeText}</span>}

        {badge && (
          <span
            className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
              badge.type === 'critical'
                ? 'bg-red-100 text-red-700 border border-red-200'
                : badge.type === 'warning'
                ? 'bg-amber-100 text-amber-800 border border-amber-200'
                : badge.type === 'success'
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                : 'bg-blue-100 text-blue-800 border border-blue-200'
            }`}
          >
            {badge.text}
          </span>
        )}
      </div>
    </div>
  );
};
