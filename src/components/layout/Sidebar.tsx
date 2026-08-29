import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Home,
  MapPin,
  FolderKanban,
  ChevronLeft,
  ChevronRight,
  Cpu,
  X,
} from 'lucide-react';
import { LandXLogo } from '../common/LandXLogo';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  isMobileOpen?: boolean;
  setIsMobileOpen?: (open: boolean) => void;
}

interface NavItem {
  name: string;
  path: string;
  icon: any;
  badge?: string;
  badgeColor?: string;
}

interface NavGroup {
  group: string;
  items: NavItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  setIsCollapsed,
  isMobileOpen = false,
  setIsMobileOpen,
}) => {
  const location = useLocation();

  // Simplified Focused Navigation Hierarchy
  const navGroups: NavGroup[] = [
    {
      group: 'HOME',
      items: [{ name: 'Home', path: '/', icon: Home }],
    },
    {
      group: 'PREDICT',
      items: [
        {
          name: 'Predictive Intelligence',
          path: '/predictive-intelligence',
          icon: Cpu,
          badge: 'AI',
          badgeColor: 'bg-blue-700 text-white',
        },
      ],
    },
    {
      group: 'MONITOR',
      items: [
        { name: 'Projects', path: '/projects', icon: FolderKanban },
        { name: 'National Map', path: '/national-map', icon: MapPin },
      ],
    },
  ];

  const renderNavContent = (isMobile: boolean = false) => (
    <div className="flex flex-col justify-between h-full select-none">
      <div>
        {/* Brand Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <LandXLogo size="md" showWordmark={isMobile ? true : !isCollapsed} />
          {isMobile && setIsMobileOpen && (
            <button
              onClick={() => setIsMobileOpen(false)}
              className="p-1 rounded-xs bg-slate-100 text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation Groups */}
        <nav className="p-3 space-y-5 overflow-y-auto">
          {navGroups.map((group) => (
            <div key={group.group} className="space-y-1">
              {(!isCollapsed || isMobile) && (
                <div className="px-3 py-1 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                  {group.group}
                </div>
              )}

              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive =
                  location.pathname === item.path ||
                  (item.path !== '/' && location.pathname.startsWith(item.path));

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => {
                      if (isMobile && setIsMobileOpen) {
                        setIsMobileOpen(false);
                      }
                    }}
                    title={!isMobile && isCollapsed ? item.name : undefined}
                    className={`flex items-center ${
                      !isMobile && isCollapsed ? 'justify-center px-2 py-2.5' : 'justify-between px-3 py-2.5'
                    } rounded-xs text-xs font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-blue-50 text-blue-900 border-l-3 border-blue-700 font-bold shadow-2xs'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-blue-700' : 'text-slate-400'}`} />
                      {(isMobile || !isCollapsed) && <span className="truncate">{item.name}</span>}
                    </div>

                    {(isMobile || !isCollapsed) && item.badge && (
                      <span
                        className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-xs ${
                          item.badgeColor || (isActive ? 'bg-blue-700 text-white' : 'bg-slate-200 text-slate-700')
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </div>
          ))}
        </nav>
      </div>

      {/* Footer System Status */}
      <div className="p-3.5 border-t border-slate-200 bg-slate-50 text-[10px] font-mono text-slate-600 space-y-1">
        <div className="flex items-center space-x-1.5 font-bold">
          <span className="w-2 h-2 rounded-full bg-emerald-600 flex-shrink-0 animate-pulse" />
          <span>SYSTEM OPERATIONAL</span>
        </div>
        <div className="text-[9px] text-slate-500 block leading-tight">
          Government Operations &bull; SIH26017
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* DESKTOP PERMANENT SIDEBAR RAIL (HIDDEN ON MOBILE) */}
      <aside
        className={`hidden md:flex bg-white border-r border-slate-200 flex-col justify-between select-none z-30 flex-shrink-0 transition-all duration-300 relative shadow-2xs ${
          isCollapsed ? 'w-16' : 'w-64'
        }`}
      >
        {/* Collapse Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-5 bg-white border border-slate-300 text-slate-600 hover:text-slate-900 rounded-full p-1 z-40 shadow-xs cursor-pointer"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
        </button>

        {renderNavContent(false)}
      </aside>

      {/* MOBILE SLIDE-OVER NAVIGATION DRAWER (VISIBLE ON MOBILE WHEN OPEN) */}
      {isMobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            onClick={() => setIsMobileOpen?.(false)}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
          />

          {/* Drawer Sheet */}
          <div className="relative z-10 w-72 max-w-[82vw] h-full bg-white border-r border-slate-200 shadow-2xl overflow-hidden animate-fadeIn">
            {renderNavContent(true)}
          </div>
        </div>
      )}
    </>
  );
};
