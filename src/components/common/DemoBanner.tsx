import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const DemoBanner: React.FC = () => {
  return (
    <div className="bg-slate-900 border-b border-slate-800 text-slate-300 text-[11px] font-mono px-4 py-1.5 flex items-center justify-between select-none z-30 flex-shrink-0">
      <div className="flex items-center space-x-2">
        <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
        <span className="font-bold text-white tracking-wide">
          SYNTHETIC DEMONSTRATION ENVIRONMENT
        </span>
        <span className="text-slate-400">|</span>
        <span className="text-slate-300">SIH 2026 Problem Statement SIH26017</span>
      </div>

      <div className="flex items-center space-x-3 text-[10px] text-slate-400">
        <span>Deterministic Prototype Engine v2.0</span>
        <span className="text-slate-600">&bull;</span>
        <span className="text-emerald-400 font-bold">100% OPERATIONAL</span>
      </div>
    </div>
  );
};
