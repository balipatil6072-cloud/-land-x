import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Globe, Search, Menu, LogOut, ShieldCheck, ChevronDown } from 'lucide-react';
import { LandXLogo } from '../common/LandXLogo';
import { useAuth } from '../../context/AuthContext';

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
  const { user, logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = () => {
    setShowProfileMenu(false);
    logout();
    navigate('/login', { replace: true });
  };

  // Compute Breadcrumb / Page Context Title
  const getBreadcrumbTitle = () => {
    if (path === '/predictive-intelligence') return { title: 'PREDICTIVE INTELLIGENCE', breadcrumb: 'KSHETRA / PREDICT' };
    if (path === '/command-center') return { title: 'NATIONAL SITUATION', breadcrumb: 'KSHETRA / OVERVIEW' };
    if (path === '/national-map') return { title: 'NATIONAL MAP (GIS)', breadcrumb: 'KSHETRA / MONITOR' };
    if (path === '/projects') return { title: 'PROJECTS DIRECTORY', breadcrumb: 'KSHETRA / MONITOR' };
    if (path.startsWith('/projects/')) return { title: 'PROJECT INTELLIGENCE BRIEF', breadcrumb: `KSHETRA / PROJECTS / ${path.split('/')[2] || 'LA-1842'}` };
    if (path.startsWith('/early-warning')) return { title: 'EARLY WARNINGS QUEUE', breadcrumb: 'KSHETRA / RESPOND' };
    if (path === '/interventions') return { title: 'ACTIONS & INTERVENTIONS', breadcrumb: 'KSHETRA / RESPOND' };
    if (path === '/governance') return { title: 'GOVERNANCE AUDIT LOG', breadcrumb: 'KSHETRA / AUDIT' };
    return { title: 'WORKSPACE', breadcrumb: 'KSHETRA' };
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

        {/* OFFICER PROFILE MENU TOGGLE */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center space-x-2 bg-slate-900 hover:bg-slate-800 text-white border border-slate-800 rounded-xs px-2.5 py-1 text-[11px] font-mono cursor-pointer transition-colors shadow-2xs"
          >
            <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center font-bold text-[10px] text-white flex-shrink-0">
              {user?.avatarInitials || 'GO'}
            </div>
            <div className="hidden sm:flex flex-col items-start leading-tight text-left">
              <span className="font-bold text-[10px] uppercase truncate max-w-[120px]">
                {user?.roleTitle || 'MONITORING OFFICER'}
              </span>
              <span className="text-[8px] text-slate-300 block truncate max-w-[120px]">
                {user?.name || 'Government Operations'}
              </span>
            </div>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {/* OFFICER PROFILE DROPDOWN CARD */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-72 bg-white border border-slate-300 rounded-xs shadow-xl z-50 overflow-hidden font-sans animate-fadeIn">
              {/* Profile Header */}
              <div className="p-3.5 bg-slate-900 text-white space-y-1 font-mono">
                <div className="flex justify-between items-start">
                  <div className="space-y-0.5">
                    <div className="font-bold text-xs">{user?.name}</div>
                    <div className="text-[10px] text-blue-300">{user?.email}</div>
                  </div>
                  <span className="px-1.5 py-0.5 bg-blue-800 text-[9px] font-bold rounded-xs uppercase">
                    {user?.jurisdictionScope || 'INDIA'}
                  </span>
                </div>
                <div className="text-[9px] text-slate-400 border-t border-slate-800 pt-1 mt-1 flex justify-between">
                  <span>Badge: {user?.badgeId || 'GOV-IN-8842'}</span>
                  <span className="text-emerald-400 font-bold">Session Active</span>
                </div>
              </div>

              {/* Department & Role Info */}
              <div className="p-3 space-y-2 text-xs border-b border-slate-200 bg-slate-50 text-slate-700 font-mono">
                <div>
                  <span className="text-[9px] font-bold text-slate-500 uppercase block">Department / Cell</span>
                  <span className="text-[11px] font-bold text-slate-900">{user?.department}</span>
                </div>
                {user?.state && (
                  <div>
                    <span className="text-[9px] font-bold text-slate-500 uppercase block">State Jurisdiction</span>
                    <span className="text-[11px] font-bold text-slate-900">{user.state} {user.district ? `(${user.district} District)` : ''}</span>
                  </div>
                )}
              </div>

              {/* Security Indicator */}
              <div className="p-2.5 px-3 flex items-center space-x-1.5 text-[10px] font-mono text-slate-500 bg-white">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                <span>SIH2026 Prototype Authentication</span>
              </div>

              {/* Sign Out Button */}
              <div className="p-2 bg-slate-100 border-t border-slate-200">
                <button
                  onClick={handleSignOut}
                  className="w-full px-3 py-2 bg-red-50 hover:bg-red-100 text-red-800 border border-red-200 rounded-xs text-xs font-mono font-bold flex items-center justify-center space-x-2 cursor-pointer transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5 text-red-700" />
                  <span>SIGN OUT OFFICER</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

