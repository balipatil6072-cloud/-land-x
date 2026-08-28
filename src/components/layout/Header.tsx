import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Globe, UserCheck, Search, Menu } from 'lucide-react';
import { LandXLogo } from '../common/LandXLogo';

interface HeaderProps {
  selectedState: string;
  setSelectedState: (s: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onToggleMobileMenu?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  selectedState,
  setSelectedState,
  searchQuery,
  setSearchQuery,
  onToggleMobileMenu,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;

  // Compute Breadcrumb / Page Context Title
  const getBreadcrumbTitle = () => {
    if (path === '/command-center') return { title: 'NATIONAL SITUATION', breadcrumb: 'LAND-X / OVERVIEW' };
    if (path === '/national-map') return { title: 'NATIONAL MAP (GIS)', breadcrumb: 'LAND-X / MONITOR' };
    if (path === '/projects') return { title: 'PROJECTS DIRECTORY', breadcrumb: 'LAND-X / MONITOR' };
    if (path.startsWith('/projects/')) return { title: 'PROJECT INTELLIGENCE BRIEF', breadcrumb: `LAND-X / PROJECTS / ${path.split('/')[2] || 'LA-1842'}` };
    if (path.startsWith('/early-warning')) return { title: 'EARLY WARNINGS QUEUE', breadcrumb: 'LAND-X / RESPOND' };
    if (path === '/interventions') return { title: 'ACTIONS & INTERVENTIONS', breadcrumb: 'LAND-X / RESPOND' };
    if (path === '/governance') return { title: 'GOVERNANCE AUDIT LOG', breadcrumb: 'LAND-X / AUDIT' };
    return { title: 'WORKSPACE', breadcrumb: 'LAND-X' };
  };

  const { title, breadcrumb } = getBreadcrumbTitle();

  return (
    <header className="bg-white border-b border-slate-200 select-none sticky top-0 z-20 shadow-2xs font-sans w-full px-3 sm:px-6 py-2.5 flex items-center justify-between gap-2 sm:gap-4">
      {/* Left: Mobile Drawer Button + Breadcrumb */}
      <div className="flex items-center space-x-2.5">
        <button
          onClick={onToggleMobileMenu}
          className="md:hidden p-1.5 rounded-xs bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 cursor-pointer"
          aria-label="Toggle Navigation Menu"
        >
          <Menu className="w-4 h-4" />
        </button>

        <div className="hidden sm:block">
          <div className="text-[10px] font-mono font-bold text-slate-500 tracking-wider uppercase">
            {breadcrumb}
          </div>
          <h1 className="text-xs sm:text-sm font-bold font-mono text-slate-900 tracking-tight leading-none mt-0.5">
            {title}
          </h1>
        </div>

        {/* Mobile Header Branding */}
        <div className="sm:hidden flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/command-center')}>
          <LandXLogo size="sm" showWordmark={true} />
        </div>
      </div>

      {/* Right Search, Jurisdiction & Officer Controls */}
      <div className="flex items-center space-x-2 sm:space-x-3 text-xs">
        {/* Quick Search */}
        <div className="relative w-36 sm:w-56 hidden lg:block">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
          <input
            type="text"
            placeholder="Search project (e.g. LA-1842)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && searchQuery.trim()) {
                navigate('/projects');
              }
            }}
            className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xs pl-8 pr-2.5 py-1 text-xs placeholder:text-slate-400 focus:outline-hidden focus:border-blue-600 focus:bg-white font-medium"
          />
        </div>

        {/* State Jurisdiction Filter */}
        <div className="flex items-center space-x-1 bg-slate-50 border border-slate-200 rounded-xs px-2 sm:px-2.5 py-1">
          <Globe className="w-3.5 h-3.5 text-slate-500" />
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="bg-transparent border-none text-[11px] sm:text-xs font-mono font-bold text-slate-800 focus:outline-hidden cursor-pointer"
          >
            <option value="All">NATIONAL (4,286)</option>
            <option value="Maharashtra">MAHARASHTRA (801)</option>
            <option value="Bihar">BIHAR (544)</option>
            <option value="Uttar Pradesh">UTTAR PRADESH (690)</option>
            <option value="Odisha">ODISHA (398)</option>
            <option value="Karnataka">KARNATAKA (325)</option>
          </select>
        </div>

        {/* Monitoring Officer Role Badge */}
        <div className="hidden sm:flex items-center space-x-1.5 bg-slate-100 border border-slate-200 rounded-xs px-2.5 py-1 text-[11px] font-mono font-bold text-slate-700">
          <UserCheck className="w-3.5 h-3.5 text-blue-700" />
          <span className="hidden md:inline">MONITORING OFFICER</span>
        </div>
      </div>
    </header>
  );
};
