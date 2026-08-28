import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export const CommandCenterPage: React.FC = () => {
  const navigate = useNavigate();

  // Secondary Contextual View Navigation State: 'overview' | 'trends' | 'drivers' | 'summary'
  const [currentView, setCurrentView] = useState<'overview' | 'trends' | 'drivers' | 'summary'>('overview');

  // Priority Actions Data
  const priorityActions = [
    {
      id: 'LA-1842',
      name: 'Mumbai–Nagpur Infrastructure Corridor',
      location: 'Nashik, Maharashtra',
      currentRisk: 92,
      riskMovement: '71% → 92% in 7 days (↑ +21 points)',
      expectedImpact: '+74 days predicted delay',
      primaryDriver: 'Compensation (38% beneficiary records unresolved)',
      recommendedStep: 'Review recommended intervention',
    },
    {
      id: 'LA-1931',
      name: 'Patna–Gaya Expressway Corridor',
      location: 'Gaya, Bihar',
      currentRisk: 87,
      riskMovement: '71% → 87% in 7 days (↑ +16 points)',
      expectedImpact: '+58 days predicted delay',
      primaryDriver: 'Legal dispute (17 pending heirship claims)',
      recommendedStep: 'Review recommended intervention',
    },
    {
      id: 'LA-2077',
      name: 'Bundelkhand Industrial Expressway Phase II',
      location: 'Jalaun, Uttar Pradesh',
      currentRisk: 84,
      riskMovement: '70% → 84% in 7 days (↑ +14 points)',
      expectedImpact: '+48 days predicted delay',
      primaryDriver: 'Documentation (23 unverified land titles)',
      recommendedStep: 'Review recommended intervention',
    },
  ];

  // Delay Drivers Breakdown
  const delayDrivers = [
    { driver: 'Compensation', pct: 38, count: 142 },
    { driver: 'Legal disputes', pct: 24, count: 108 },
    { driver: 'Documentation', pct: 19, count: 76 },
    { driver: 'Approvals', pct: 11, count: 58 },
    { driver: 'Rehabilitation & Resettlement (R&R)', pct: 8, count: 34 },
  ];

  // State Summary Data
  const stateSummaries = [
    { state: 'MAHARASHTRA', projects: 801, critical: 142, leadDriver: 'Compensation Disbursement (34%)' },
    { state: 'UTTAR PRADESH', projects: 690, critical: 116, leadDriver: 'Gazette Clearance (28%)' },
    { state: 'BIHAR', projects: 544, critical: 98, leadDriver: 'Title & Heirship Disputes (41%)' },
    { state: 'ODISHA', projects: 398, critical: 64, leadDriver: 'SIA Survey Approvals (22%)' },
    { state: 'KARNATAKA', projects: 325, critical: 51, leadDriver: 'Land Valuation Differences (31%)' },
  ];

  return (
    <div className="w-full space-y-6 pb-12 font-sans text-slate-900 antialiased">
      {/* 6. PAGE HEADER & SECONDARY VIEW TABS */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-slate-300 pb-3 gap-2">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 font-mono">
              NATIONAL SITUATION
            </h1>
            <p className="text-sm text-slate-600 mt-1 font-sans">
              National overview of land-acquisition risk and project progress monitoring.
            </p>
          </div>

          <div className="text-right font-mono text-xs text-slate-600 font-bold">
            <span>28 AUG 2026</span>
            <span className="mx-2 text-slate-300">|</span>
            <span>Last updated 12:42</span>
          </div>
        </div>

        {/* Secondary Contextual View Navigation Bar */}
        <div className="flex items-center space-x-8 border-b border-slate-200 text-xs font-mono font-bold overflow-x-auto py-1">
          <button
            onClick={() => setCurrentView('overview')}
            className={`pb-2.5 transition-all cursor-pointer ${
              currentView === 'overview'
                ? 'text-blue-900 border-b-2 border-blue-800'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setCurrentView('trends')}
            className={`pb-2.5 transition-all cursor-pointer ${
              currentView === 'trends'
                ? 'text-blue-900 border-b-2 border-blue-800'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Risk Trends
          </button>
          <button
            onClick={() => setCurrentView('drivers')}
            className={`pb-2.5 transition-all cursor-pointer ${
              currentView === 'drivers'
                ? 'text-blue-900 border-b-2 border-blue-800'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Delay Drivers
          </button>
          <button
            onClick={() => setCurrentView('summary')}
            className={`pb-2.5 transition-all cursor-pointer ${
              currentView === 'summary'
                ? 'text-blue-900 border-b-2 border-blue-800'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            State Summary
          </button>
        </div>
      </div>

      {/* VIEW 1: OVERVIEW (DEFAULT VIEW) */}
      {currentView === 'overview' && (
        <div className="space-y-8">
          {/* 10. REFINED NATIONAL SUMMARY STATUS STRIP */}
          <div className="bg-white border border-slate-300 rounded-xs p-5 shadow-2xs">
            <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-slate-200 font-mono">
              <div className="px-4 py-2 first:pl-0">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  PROJECTS MONITORED
                </span>
                <span className="text-3xl font-bold text-slate-900 block mt-1">
                  4,286
                </span>
                <span className="text-xs text-slate-500 font-sans block mt-1">Active National Corridors</span>
              </div>

              <div className="px-4 py-2">
                <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block">
                  AT RISK
                </span>
                <span className="text-3xl font-bold text-amber-700 block mt-1">
                  618
                </span>
                <span className="text-xs text-slate-500 font-sans block mt-1">Elevated Probability</span>
              </div>

              <div className="px-4 py-2">
                <span className="text-[11px] font-bold text-red-800 uppercase tracking-wider block">
                  CRITICAL
                </span>
                <span className="text-3xl font-bold text-red-700 block mt-1">
                  147
                </span>
                <span className="text-xs text-slate-500 font-sans block mt-1">Urgent SLA Action Needed</span>
              </div>

              <div className="px-4 py-2 last:pr-0">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  PREDICTED DELAY EXPOSURE
                </span>
                <span className="text-3xl font-bold text-slate-900 block mt-1">
                  +18,420 DAYS
                </span>
                <span className="text-xs text-slate-500 font-sans block mt-1">Cumulative Risk Exposure</span>
              </div>
            </div>
          </div>

          {/* Priority Actions */}
          <div className="space-y-4">
            <div className="flex justify-between items-baseline border-b border-slate-300 pb-2">
              <h2 className="text-base font-mono font-bold text-slate-900 uppercase tracking-wider">
                PRIORITY ACTIONS
              </h2>
              <span className="text-xs text-slate-500 font-sans">
                Ranked by predictive delay velocity &amp; impact
              </span>
            </div>

            <div className="space-y-4">
              {priorityActions.map((item) => (
                <div
                  key={item.id}
                  onClick={() => navigate(`/projects/${item.id}`)}
                  className="p-5 bg-white border border-slate-300 rounded-xs hover:border-slate-500 transition-colors cursor-pointer space-y-4 shadow-2xs"
                >
                  <div className="flex flex-wrap items-baseline justify-between border-b border-slate-200 pb-3 gap-2">
                    <div className="flex items-center space-x-3 text-base font-bold">
                      <span className="text-blue-800 font-mono text-lg">{item.id}</span>
                      <span className="text-slate-900 font-sans">{item.name}</span>
                      <span className="text-xs font-mono text-slate-500">({item.location})</span>
                    </div>

                    <div className="text-xs font-mono text-red-700 font-bold">
                      {item.riskMovement}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-sans">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-slate-500 uppercase block">CURRENT RISK:</span>
                      <span className="text-xl font-bold text-red-700 font-mono">{item.currentRisk}% DELAY PROBABILITY</span>
                    </div>

                    <div>
                      <span className="text-[10px] font-mono font-bold text-slate-500 uppercase block">EXPECTED IMPACT:</span>
                      <span className="text-sm font-bold text-slate-900 font-mono">{item.expectedImpact}</span>
                    </div>

                    <div>
                      <span className="text-[10px] font-mono font-bold text-slate-500 uppercase block">PRIMARY DELAY DRIVER:</span>
                      <span className="font-semibold text-slate-900">{item.primaryDriver}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-500">
                      Officer action required to prevent downstream corridor stoppage.
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/projects/${item.id}`);
                      }}
                      className="px-4 py-2 bg-blue-800 hover:bg-blue-900 text-white font-mono font-bold text-xs rounded-xs flex items-center space-x-1.5 transition-colors cursor-pointer"
                    >
                      <span>{item.recommendedStep}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: RISK TRENDS */}
      {currentView === 'trends' && (
        <div className="space-y-6">
          <div className="border-b border-slate-300 pb-2 flex justify-between items-baseline">
            <h2 className="text-base font-mono font-bold text-slate-900 uppercase tracking-wider">
              RISK TRAJECTORY &amp; MOVEMENT ANALYSIS
            </h2>
            <span className="text-xs text-slate-500 font-mono">30-Day Predictive Shift</span>
          </div>

          <div className="bg-white border border-slate-300 p-6 rounded-xs space-y-4 shadow-2xs">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="font-bold text-slate-900">National Delay Probability Curve</span>
              <span className="text-red-700 font-bold">+8.4% Acceleration</span>
            </div>

            <div className="h-52 w-full pt-2">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 400 90" preserveAspectRatio="none">
                <path
                  d="M0,75 Q80,70 160,50 T320,25 T400,10"
                  fill="none"
                  stroke="#dc2626"
                  strokeWidth="3"
                />
                <path
                  d="M0,75 Q80,70 160,50 T320,25 T400,10 L400,90 L0,90 Z"
                  fill="rgba(220, 38, 38, 0.08)"
                />
                <circle cx="160" cy="50" r="4" fill="#ea580c" />
                <circle cx="400" cy="10" r="5" fill="#dc2626" />
              </svg>
            </div>

            <div className="flex justify-between text-[11px] font-mono font-bold text-slate-500 pt-2 border-t border-slate-100">
              <span>Jan (320)</span>
              <span>Feb (345)</span>
              <span>Mar (390)</span>
              <span>Apr (410)</span>
              <span>May (480)</span>
              <span>Jun (520)</span>
              <span>Jul (570)</span>
              <span className="text-red-700">Aug (618)</span>
            </div>

            <p className="text-xs text-slate-800 font-sans font-medium border-t border-slate-200 pt-3">
              Risk is accelerating across compensation and legal stages. 147 projects have entered critical-risk trajectory over the past 30 days.
            </p>
          </div>
        </div>
      )}

      {/* VIEW 3: DELAY DRIVERS */}
      {currentView === 'drivers' && (
        <div className="space-y-6">
          <div className="border-b border-slate-300 pb-2">
            <h2 className="text-base font-mono font-bold text-slate-900 uppercase tracking-wider">
              WHY PROJECTS ARE AT RISK (PRIMARY DELAY DRIVERS)
            </h2>
          </div>

          <div className="bg-white border border-slate-300 rounded-xs divide-y divide-slate-200 text-xs px-5 py-2 shadow-2xs">
            {delayDrivers.map((item) => (
              <div key={item.driver} className="py-4 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 font-sans text-sm block">{item.driver}</span>
                  <span className="text-slate-500 font-mono text-xs mt-0.5 block">{item.count} projects affected nationwide</span>
                </div>
                <div className="font-bold text-slate-900 font-mono text-lg">{item.pct}%</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 4: STATE SUMMARY */}
      {currentView === 'summary' && (
        <div className="space-y-6">
          <div className="border-b border-slate-300 pb-2">
            <h2 className="text-base font-mono font-bold text-slate-900 uppercase tracking-wider">
              STATE ACQUISITION DELAY SUMMARY
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {stateSummaries.map((s) => (
              <div key={s.state} className="p-5 bg-white border border-slate-300 rounded-xs space-y-3 shadow-2xs">
                <div className="flex justify-between items-baseline font-mono border-b border-slate-200 pb-2">
                  <span className="font-bold text-slate-900 text-sm">{s.state}</span>
                  <span className="text-red-700 font-bold text-xs">{s.critical} CRITICAL</span>
                </div>

                <div className="text-xs font-mono text-slate-700">
                  Total Monitored: <strong className="text-slate-900">{s.projects}</strong>
                </div>

                <div className="text-xs text-slate-600 font-sans pt-1">
                  <strong className="text-slate-800 uppercase font-mono text-[10px] block">LEAD BOTTLENECK:</strong>
                  <span>{s.leadDriver}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
