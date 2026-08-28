import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface AppShellProps {
  children: React.ReactNode;
  selectedState: string;
  setSelectedState: (s: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export const AppShell: React.FC<AppShellProps> = ({
  children,
  selectedState,
  setSelectedState,
  searchQuery,
  setSearchQuery,
}) => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const isMapPage = location.pathname === '/national-map';

  return (
    <div className="h-screen w-screen flex bg-slate-50 overflow-hidden font-sans text-slate-900 antialiased select-none">
      {/* Sidebar Rail (Desktop Permanent / Mobile Slide-Over Drawer) */}
      <Sidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* Main Working Canvas Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Application Toolbar Header */}
        <Header
          selectedState={selectedState}
          setSelectedState={setSelectedState}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onToggleMobileMenu={() => setIsMobileOpen(!isMobileOpen)}
        />

        {/* Scrollable Content Workspace (Edge-to-edge for GIS Map, Padded for Reports) */}
        <main className={`flex-1 overflow-y-auto ${isMapPage ? 'p-0 overflow-hidden' : 'p-4 sm:p-6 md:p-8'}`}>
          {children}
        </main>
      </div>
    </div>
  );
};
