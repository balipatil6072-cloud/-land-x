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
            className="flex items-center space-x-2.5 bg-slate-900 hover:bg-slate-800 text-white border border-slate-800 rounded-xs px-3 py-1.5 text-xs font-mono cursor-pointer transition-colors shadow-2xs"
          >
            <div className="w-6 h-6 rounded-full bg-blue-700 flex items-center justify-center font-bold text-[11px] text-white flex-shrink-0 border border-blue-400/40">
              {user?.avatarInitials || 'GO'}
            </div>
            <div className="hidden sm:flex flex-col items-start leading-tight text-left">
              <div className="flex items-center space-x-1.5">
                <span className="font-bold text-[9px] uppercase tracking-wider text-slate-300">
                  OFFICER WORKSPACE
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" title="AUTHENTICATED" />
              </div>
              <span className="font-bold text-[11px] text-white block truncate max-w-[140px]">
                {user?.name || 'Rajesh V. Sharma'}
              </span>
              <span className="text-[9px] text-blue-300 block truncate max-w-[140px]">
                {user?.roleTitle || 'National Administrator'}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
          </button>

          {/* OFFICER PROFILE DROPDOWN CARD */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-300 rounded-xs shadow-xl z-50 overflow-hidden font-sans animate-fadeIn">
              {/* Profile Header */}
              <div className="p-4 bg-slate-900 text-white space-y-2 font-mono">
                <div className="flex justify-between items-start">
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-bold text-blue-400 uppercase tracking-widest block">OFFICER PROFILE</span>
                    <div className="font-bold text-sm text-white">{user?.name}</div>
                    <div className="text-[10px] text-slate-300">{user?.roleTitle}</div>
                  </div>
                  <span className="px-2 py-0.5 bg-blue-800 text-[9px] font-bold rounded-xs uppercase border border-blue-600">
                    {user?.jurisdictionScope || 'INDIA'}
                  </span>
                </div>

                <div className="text-[9px] text-slate-400 border-t border-slate-800 pt-2 flex justify-between items-center">
                  <span>Badge ID: <strong className="text-slate-200">{user?.badgeId || 'GOV-IN-8842'}</strong></span>
                  <span className="text-emerald-400 font-bold flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>AUTHENTICATED</span>
                  </span>
                </div>
              </div>

              {/* Department & Role Info */}
              <div className="p-3.5 space-y-2.5 text-xs border-b border-slate-200 bg-slate-50 text-slate-700 font-mono">
                <div>
                  <span className="text-[9px] font-bold text-slate-500 uppercase block">Department / Ministry</span>
                  <span className="text-xs font-bold text-slate-900">{user?.department}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-200">
                  <div>
                    <span className="text-[9px] font-bold text-slate-500 uppercase block">Jurisdiction Scope</span>
                    <span className="text-xs font-bold text-slate-900">
                      {user?.state ? `${user.state} ${user.district ? `(${user.district})` : ''}` : (user?.jurisdictionScope || 'INDIA')}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-slate-500 uppercase block">Access Level</span>
                    <span className="text-xs font-bold text-blue-800">{user?.role}</span>
                  </div>
                </div>

                {user?.assignedProjects && user.assignedProjects.length > 0 && (
                  <div className="pt-1 border-t border-slate-200">
                    <span className="text-[9px] font-bold text-slate-500 uppercase block">Assigned Project Corridors</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {user.assignedProjects.map((p) => (
                        <span key={p} className="px-1.5 py-0.5 bg-blue-100 text-blue-900 text-[10px] font-bold rounded-xs border border-blue-200">
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Security Indicator */}
              <div className="p-2.5 px-3.5 flex items-center justify-between text-[10px] font-mono text-slate-600 bg-white border-b border-slate-200">
                <div className="flex items-center space-x-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span className="font-bold text-slate-700">● SECURE SESSION ACTIVE</span>
                </div>
                <span className="text-slate-400">SIH 2026</span>
              </div>

              {/* Sign Out Button */}
              <div className="p-2.5 bg-slate-100">
                <button
                  onClick={handleSignOut}
                  className="w-full py-2 bg-red-700 hover:bg-red-800 text-white rounded-xs text-xs font-mono font-bold flex items-center justify-center space-x-2 cursor-pointer transition-colors shadow-2xs"
                >
                  <LogOut className="w-3.5 h-3.5" />
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

