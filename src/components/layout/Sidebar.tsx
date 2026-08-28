import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Home,
  LayoutDashboard,
  MapPin,
  FolderKanban,
  AlertTriangle,
  Zap,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  FileSpreadsheet,
} from 'lucide-react';
import { LandXLogo } from '../common/LandXLogo';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, setIsCollapsed }) => {
  const location = useLocation();

  // Grouped Navigation Architecture
  const navGroups = [
    {
      group: 'HOME',
      items: [
        { name: 'Home', path: '/', icon: Home },
      ],
    },
    {
      group: 'OVERVIEW',
      items: [
        { name: 'National Situation', path: '/command-center', icon: LayoutDashboard },
      ],
    },
    {
      group: 'MONITOR',
      items: [
        { name: 'National Map', path: '/national-map', icon: MapPin },
        { name: 'Projects', path: '/projects', icon: FolderKanban },
      ],
    },
    {
      group: 'INTELLIGENCE',
      items: [
        { name: 'Project Intelligence', path: '/projects/LA-1842', icon: FileSpreadsheet },
      ],
    },
    {
      group: 'RESPOND',
      items: [
        { name: 'Early Warnings', path: '/early-warning', icon: AlertTriangle, badge: 'P1', badgeColor: 'bg-red-600 text-white' },
        { name: 'Actions & Interventions', path: '/interventions', icon: Zap },
        { name: 'Governance Audit', path: '/governance', icon: ShieldCheck },
      ],
    },
  ];

  return (
    <aside
      className={`bg-white border-r border-slate-200 flex flex-col justify-between select-none z-30 flex-shrink-0 transition-all duration-300 relative shadow-2xs ${
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

      {/* Top Brand Header */}
      <div>
        <div className={`p-4 border-b border-slate-200 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
          <LandXLogo size="md" showWordmark={!isCollapsed} />
        </div>

        {/* Navigation Rail */}
        <nav className="p-3 space-y-5 overflow-y-auto">
          {navGroups.map((group) => (
            <div key={group.group} className="space-y-1">
              {!isCollapsed && (
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
                    title={isCollapsed ? item.name : undefined}
                    className={`flex items-center ${
                      isCollapsed ? 'justify-center px-2 py-2.5' : 'justify-between px-3 py-2'
                    } rounded-xs text-xs font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-blue-50 text-blue-900 border-l-3 border-blue-700 font-bold shadow-2xs'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-blue-700' : 'text-slate-400'}`} />
                      {!isCollapsed && <span className="truncate">{item.name}</span>}
                    </div>

                    {!isCollapsed && item.badge && (
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
      <div className={`p-3.5 border-t border-slate-200 bg-slate-50 text-[10px] font-mono text-slate-600 ${isCollapsed ? 'text-center' : 'space-y-1'}`}>
        <div className="flex items-center justify-center sm:justify-start space-x-1.5 font-bold">
          <span className="w-2 h-2 rounded-full bg-emerald-600 flex-shrink-0 animate-pulse" />
          {!isCollapsed && <span>SYSTEM OPERATIONAL</span>}
        </div>
        {!isCollapsed && (
          <div className="text-[9px] text-slate-500 block leading-tight">
            Government Operations &bull; SIH26017
          </div>
        )}
      </div>
    </aside>
  );
};
