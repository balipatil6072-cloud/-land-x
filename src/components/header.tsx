import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, Globe, ChevronRight } from 'lucide-react';

interface HeaderProps {
  selectedState: string;
  setSelectedState: (s: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  selectedState,
  setSelectedState,
  searchQuery,
  setSearchQuery,
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const getBreadcrumbs = () => {
    const path = location.pathname;
    if (path.startsWith('/command-center')) return ['Situation Room', 'National Acquisition Situation'];
    if (path.startsWith('/national-map')) return ['Geospatial Intelligence', 'National Map'];
    if (path.startsWith('/projects/')) return ['Projects Directory', 'Executive Decision Brief'];
    if (path.startsWith('/projects')) return ['Projects Directory', 'Monitored Portfolio'];
    if (path.startsWith('/early-warning')) return ['Anomaly Engine', 'Early Warning Alerts'];
    if (path.startsWith('/prediction-lab')) return ['Simulations', 'Prediction Lab'];
    if (path.startsWith('/interventions')) return ['Case Management', 'Actions & Verification'];
    if (path.startsWith('/governance')) return ['System Audit', 'Governance Timeline'];
    return ['Platform', 'Situation'];
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className="h-12 bg-white border-b border-slate-200 px-5 flex items-center justify-between select-none z-20 flex-shrink-0 text-xs">
      {/* Title & Breadcrumb Trail */}
      <div className="flex items-center space-x-2">
        <span className="font-mono font-black text-slate-900 tracking-wider">KSHETRA</span>
        <span className="text-slate-400">|</span>
        <span className="text-slate-500 font-medium">{breadcrumbs[0]}</span>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="font-bold text-slate-900">{breadcrumbs[1]}</span>
      </div>

      {/* Center Global Search */}
      <div className="relative w-64 md:w-80">
        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
        <input
          type="text"
          placeholder="Search project ID (e.g. LA-1842)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && searchQuery.trim()) {
              navigate('/projects');
            }
          }}
          className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded pl-8 pr-3 py-1 text-xs placeholder:text-slate-400 focus:outline-hidden focus:border-blue-600 focus:bg-white transition-all font-medium"
        />
      </div>

      {/* Right State Selector */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-1.5 bg-slate-50 border border-slate-200 rounded px-2.5 py-1">
          <Globe className="w-3.5 h-3.5 text-slate-500" />
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="bg-transparent border-none text-[11px] font-bold text-slate-800 focus:outline-hidden cursor-pointer"
          >
            <option value="All">All States (4,286)</option>
            <option value="Maharashtra">Maharashtra (801)</option>
            <option value="Bihar">Bihar (544)</option>
            <option value="Uttar Pradesh">Uttar Pradesh (690)</option>
            <option value="Odisha">Odisha (398)</option>
            <option value="Karnataka">Karnataka (325)</option>
          </select>
        </div>

        <div className="hidden lg:flex items-center space-x-1.5 font-mono text-[10px] text-slate-500 border-l border-slate-200 pl-3">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>SIH26017</span>
        </div>
      </div>
    </header>
  );
};
