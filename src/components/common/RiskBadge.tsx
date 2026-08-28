import React from 'react';
import type { RiskCategory } from '../../types';

interface RiskBadgeProps {
  category: RiskCategory;
  scorePercent?: number;
  size?: 'sm' | 'md' | 'lg';
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ category, scorePercent, size = 'md' }) => {
  const getBadgeStyle = () => {
    switch (category) {
      case 'Critical':
        return 'bg-red-50 text-red-700 border-red-200 font-semibold';
      case 'High':
        return 'bg-orange-50 text-orange-700 border-orange-200 font-semibold';
      case 'Medium':
        return 'bg-amber-50 text-amber-700 border-amber-200 font-medium';
      case 'Low':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 font-medium';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getSizeStyle = () => {
    switch (size) {
      case 'sm':
        return 'text-[11px] px-1.5 py-0.5 border';
      case 'lg':
        return 'text-sm px-3 py-1 border font-bold';
      case 'md':
      default:
        return 'text-xs px-2 py-0.5 border';
    }
  };

  return (
    <span
      className={`inline-flex items-center space-x-1.5 rounded-sm ${getBadgeStyle()} ${getSizeStyle()}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          category === 'Critical'
            ? 'bg-red-600'
            : category === 'High'
            ? 'bg-orange-500'
            : category === 'Medium'
            ? 'bg-amber-500'
            : 'bg-emerald-500'
        }`}
      />
      <span>{category}</span>
      {scorePercent !== undefined && (
        <span className="font-mono opacity-90">({scorePercent}%)</span>
      )}
    </span>
  );
};
