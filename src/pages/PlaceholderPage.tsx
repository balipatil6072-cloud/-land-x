import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Layers, ArrowLeft, Clock } from 'lucide-react';

interface PlaceholderPageProps {
  title: string;
  description: string;
  moduleVersion?: string;
}

export const PlaceholderPage: React.FC<PlaceholderPageProps> = ({
  title,
  description,
  moduleVersion = 'Phase 2 Architecture Target',
}) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white border border-slate-200 rounded p-12 shadow-2xs text-center max-w-3xl mx-auto my-8 space-y-4">
      <div className="w-14 h-14 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 mx-auto">
        <Layers className="w-7 h-7" />
      </div>

      <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded bg-slate-100 text-slate-700 text-xs font-mono font-semibold">
        <Clock className="w-3.5 h-3.5 text-blue-600" />
        <span>{moduleVersion}</span>
      </div>

      <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{title}</h1>

      <p className="text-sm text-slate-600 leading-relaxed max-w-xl mx-auto">
        {description}
      </p>

      <div className="p-4 bg-slate-50 border border-slate-200 rounded text-xs text-slate-500 text-left max-w-md mx-auto space-y-1">
        <div className="font-bold text-slate-700">Modular Architecture Notice:</div>
        <div>
          This module is designed in the LAND-X schema and will consume the centralized prediction and entity data services.
        </div>
      </div>

      <div className="pt-4">
        <button
          onClick={() => navigate('/command-center')}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-semibold shadow-xs inline-flex items-center space-x-2 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Command Center</span>
        </button>
      </div>
    </div>
  );
};
