import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, ArrowUpDown } from 'lucide-react';

interface ProjectExplorerPageProps {
  selectedState: string;
  setSelectedState: (s: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export const ProjectExplorerPage: React.FC<ProjectExplorerPageProps> = ({
  selectedState,
  setSelectedState,
  searchQuery,
  setSearchQuery,
}) => {
  const navigate = useNavigate();

  // Active View Tab: 'all' | 'at-risk' | 'critical' | 'improving'
  const [activeTab, setActiveTab] = useState<'all' | 'at-risk' | 'critical' | 'improving'>('all');

  // Filter & Sort States
  const [selectedStage, setSelectedStage] = useState<string>('All');
  const [selectedRiskLevel, setSelectedRiskLevel] = useState<string>('All');
  const [selectedTrend, setSelectedTrend] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('highest-risk');

  // Master Project Directory Data
  const projectsData = [
    {
      id: 'LA-1842',
      name: 'Mumbai–Nagpur Infrastructure Corridor',
      district: 'Nashik',
      state: 'Maharashtra',
      stage: 'Compensation',
      riskPercent: 92,
      riskCategory: 'Critical',
      trend: '↑ +21 pts',
      trendType: 'Increasing',
      predictedDelayDays: 74,
      primaryDriver: 'Compensation',
      lastUpdated: '2h ago',
    },
    {
      id: 'LA-1931',
      name: 'Patna–Gaya Expressway Corridor',
      district: 'Gaya',
      state: 'Bihar',
      stage: 'Legal Gazette',
      riskPercent: 87,
      riskCategory: 'Critical',
      trend: '↑ +16 pts',
      trendType: 'Increasing',
      predictedDelayDays: 58,
      primaryDriver: 'Legal dispute',
      lastUpdated: '4h ago',
    },
    {
      id: 'LA-2077',
      name: 'Bundelkhand Industrial Expressway Phase II',
      district: 'Jalaun',
      state: 'Uttar Pradesh',
      stage: 'Possession',
      riskPercent: 84,
      riskCategory: 'Critical',
      trend: '↑ +14 pts',
      trendType: 'Increasing',
      predictedDelayDays: 48,
      primaryDriver: 'Documentation',
      lastUpdated: '5h ago',
    },
    {
      id: 'LA-1555',
      name: 'Delhi–Dehradun Economic Corridor',
      district: 'Saharanpur',
      state: 'Uttar Pradesh',
      stage: 'SIA Clearance',
      riskPercent: 78,
      riskCategory: 'High',
      trend: '↑ +11 pts',
      trendType: 'Increasing',
      predictedDelayDays: 36,
      primaryDriver: 'Approvals',
      lastUpdated: '6h ago',
    },
    {
      id: 'LA-1770',
      name: 'Hyderabad Regional Ring Road',
      district: 'Medak',
      state: 'Telangana',
      stage: 'Rehabilitation',
      riskPercent: 72,
      riskCategory: 'High',
      trend: '↑ +9 pts',
      trendType: 'Increasing',
      predictedDelayDays: 29,
      primaryDriver: 'Compensation',
      lastUpdated: '8h ago',
    },
    {
      id: 'LA-1602',
      name: 'Biju Expressway Corridor Phase II',
      district: 'Rayagada',
      state: 'Odisha',
      stage: 'Gazette Clearance',
      riskPercent: 64,
      riskCategory: 'Moderate',
      trend: '→ 0 pts',
      trendType: 'Stable',
      predictedDelayDays: 18,
      primaryDriver: 'Valuation',
      lastUpdated: '1d ago',
    },
    {
      id: 'LA-1490',
      name: 'Bengaluru Peripheral Ring Road',
      district: 'Kolar',
      state: 'Karnataka',
      stage: 'Possession',
      riskPercent: 45,
      riskCategory: 'Low',
      trend: '↓ -12 pts',
      trendType: 'Improving',
      predictedDelayDays: 8,
      primaryDriver: 'Title Deed',
      lastUpdated: '1d ago',
    },
  ];

  // Filtering Logic
  const filteredProjects = projectsData.filter((item) => {
    // Search Query Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchId = item.id.toLowerCase().includes(q);
      const matchName = item.name.toLowerCase().includes(q);
      const matchState = item.state.toLowerCase().includes(q);
      const matchDistrict = item.district.toLowerCase().includes(q);
      const matchDriver = item.primaryDriver.toLowerCase().includes(q);
      if (!matchId && !matchName && !matchState && !matchDistrict && !matchDriver) return false;
    }

    // View Tab Filter
    if (activeTab === 'at-risk' && item.riskPercent < 60) return false;
    if (activeTab === 'critical' && item.riskCategory !== 'Critical') return false;
    if (activeTab === 'improving' && item.trendType !== 'Improving') return false;

    // Dropdown Filters
    if (selectedState !== 'All' && item.state !== selectedState) return false;
    if (selectedStage !== 'All' && item.stage !== selectedStage) return false;
    if (selectedRiskLevel !== 'All' && item.riskCategory !== selectedRiskLevel) return false;
    if (selectedTrend !== 'All' && item.trendType !== selectedTrend) return false;

    return true;
  });

  // Sorting Logic
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (sortBy === 'highest-risk') return b.riskPercent - a.riskPercent;
    if (sortBy === 'largest-delay') return b.predictedDelayDays - a.predictedDelayDays;
    if (sortBy === 'fastest-deterioration') {
      const numA = parseInt(a.trend.replace(/[^0-9]/g, '')) || 0;
      const numB = parseInt(b.trend.replace(/[^0-9]/g, '')) || 0;
      return numB - numA;
    }
    return 0;
  });

  return (
    <div className="w-full space-y-6 pb-12 font-sans text-slate-900 antialiased">
      {/* 6. PAGE HEADER & SEARCH */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-slate-300 pb-3 gap-2">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 uppercase font-mono">
              PROJECTS
            </h1>
            <p className="text-sm text-slate-600 font-normal mt-1">
              Land acquisition project intelligence registry.
            </p>
          </div>

          {/* Quick Search */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search project, district, state, ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-xs pl-9 pr-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-blue-600 font-medium"
            />
          </div>
        </div>

        {/* COMPACT PROFESSIONAL VIEW TABS */}
        <div className="flex items-center space-x-8 border-b border-slate-200 text-xs font-mono font-bold overflow-x-auto py-1">
          <button
            onClick={() => setActiveTab('all')}
            className={`pb-2.5 transition-all cursor-pointer ${
              activeTab === 'all'
                ? 'text-blue-900 border-b-2 border-blue-800'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            All Projects
          </button>
          <button
            onClick={() => setActiveTab('at-risk')}
            className={`pb-2.5 transition-all cursor-pointer ${
              activeTab === 'at-risk'
                ? 'text-blue-900 border-b-2 border-blue-800'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            At Risk (618)
          </button>
          <button
            onClick={() => setActiveTab('critical')}
            className={`pb-2.5 transition-all cursor-pointer ${
              activeTab === 'critical'
                ? 'text-blue-900 border-b-2 border-blue-800'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Critical (147)
          </button>
          <button
            onClick={() => setActiveTab('improving')}
            className={`pb-2.5 transition-all cursor-pointer ${
              activeTab === 'improving'
                ? 'text-blue-900 border-b-2 border-blue-800'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Improving (89)
          </button>
        </div>
      </div>

      {/* 10. REFINED SUMMARY STATUS STRIP */}
      <div className="bg-white border border-slate-300 rounded-xs p-4 font-mono text-xs shadow-2xs space-y-3">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-slate-200">
          <div className="px-4 py-1 first:pl-0 flex justify-between md:block">
            <span className="text-[11px] text-slate-500 font-bold uppercase block">TOTAL MONITORED</span>
            <span className="text-2xl font-bold text-slate-900 block mt-1">4,286</span>
          </div>
          <div className="px-4 py-1 flex justify-between md:block">
            <span className="text-[11px] text-amber-800 font-bold uppercase block">AT RISK</span>
            <span className="text-2xl font-bold text-amber-700 block mt-1">618</span>
          </div>
          <div className="px-4 py-1 flex justify-between md:block">
            <span className="text-[11px] text-red-800 font-bold uppercase block">CRITICAL</span>
            <span className="text-2xl font-bold text-red-700 block mt-1">147</span>
          </div>
          <div className="px-4 py-1 last:pr-0 flex justify-between md:block">
            <span className="text-[11px] text-emerald-800 font-bold uppercase block">IMPROVING</span>
            <span className="text-2xl font-bold text-emerald-700 block mt-1">89</span>
          </div>
        </div>

        {/* SUPPORTING RISK DISTRIBUTION BAR VISUALIZATION */}
        <div className="border-t border-slate-100 pt-3 space-y-1.5">
          <div className="flex justify-between items-center text-[10px] text-slate-500 font-bold uppercase">
            <span>RISK LEVEL DISTRIBUTION</span>
            <span>4,286 MONITORED CORRIDORS</span>
          </div>
          <div className="h-4 w-full bg-slate-100 rounded-xs overflow-hidden flex font-mono text-[10px] text-white font-bold">
            <div className="h-full bg-emerald-700 flex items-center justify-center" style={{ width: '42%' }}>Low (1,802)</div>
            <div className="h-full bg-amber-500 flex items-center justify-center" style={{ width: '28%' }}>Med (1,200)</div>
            <div className="h-full bg-orange-600 flex items-center justify-center" style={{ width: '18%' }}>High (766)</div>
            <div className="h-full bg-red-700 flex items-center justify-center" style={{ width: '12%' }}>Crit (518)</div>
          </div>
        </div>
      </div>

      {/* COMPACT FILTER & SORT CONTROL BAR */}
      <div className="bg-white border border-slate-300 p-4 rounded-xs space-y-3 shadow-2xs">
        <div className="flex items-center space-x-2 text-[11px] font-mono font-bold text-slate-600 uppercase">
          <Filter className="w-3.5 h-3.5 text-blue-800" />
          <span>Operational Filters</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 text-xs font-sans">
          {/* State Filter */}
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="bg-slate-50 border border-slate-300 text-slate-800 rounded-xs px-3 py-2 focus:outline-hidden font-medium"
          >
            <option value="All">All States</option>
            <option value="Maharashtra">Maharashtra</option>
            <option value="Bihar">Bihar</option>
            <option value="Uttar Pradesh">Uttar Pradesh</option>
            <option value="Odisha">Odisha</option>
            <option value="Telangana">Telangana</option>
            <option value="Karnataka">Karnataka</option>
          </select>

          {/* Stage Filter */}
          <select
            value={selectedStage}
            onChange={(e) => setSelectedStage(e.target.value)}
            className="bg-slate-50 border border-slate-300 text-slate-800 rounded-xs px-3 py-2 focus:outline-hidden font-medium"
          >
            <option value="All">All Stages</option>
            <option value="SIA Clearance">SIA Clearance</option>
            <option value="Legal Gazette">Legal Gazette</option>
            <option value="Compensation">Compensation</option>
            <option value="Possession">Possession</option>
            <option value="Rehabilitation">Rehabilitation</option>
          </select>

          {/* Risk Level Filter */}
          <select
            value={selectedRiskLevel}
            onChange={(e) => setSelectedRiskLevel(e.target.value)}
            className="bg-slate-50 border border-slate-300 text-slate-800 rounded-xs px-3 py-2 focus:outline-hidden font-medium"
          >
            <option value="All">All Risk Levels</option>
            <option value="Critical">Critical (≥80%)</option>
            <option value="High">High (60–79%)</option>
            <option value="Moderate">Moderate (40–59%)</option>
            <option value="Low">Low (&lt;40%)</option>
          </select>

          {/* Risk Trend Filter */}
          <select
            value={selectedTrend}
            onChange={(e) => setSelectedTrend(e.target.value)}
            className="bg-slate-50 border border-slate-300 text-slate-800 rounded-xs px-3 py-2 focus:outline-hidden font-medium"
          >
            <option value="All">All Trends</option>
            <option value="Increasing">Increasing (↑)</option>
            <option value="Stable">Stable (→)</option>
            <option value="Improving">Improving (↓)</option>
          </select>

          {/* Sort By Dropdown */}
          <div className="flex items-center space-x-1 bg-slate-50 border border-slate-300 rounded-xs px-2.5 py-1.5">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent border-none text-xs font-semibold text-slate-900 focus:outline-hidden cursor-pointer w-full"
            >
              <option value="highest-risk">Highest Risk</option>
              <option value="fastest-deterioration">Fastest Deterioration</option>
              <option value="largest-delay">Largest Delay</option>
            </select>
          </div>
        </div>
      </div>

      {/* 18. HIGH DENSITY OPERATIONAL PROJECT TABLE */}
      <div className="bg-white border border-slate-300 rounded-xs shadow-2xs overflow-hidden w-full">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100/90 border-b border-slate-300 text-[11px] font-mono font-bold text-slate-700 uppercase">
                <th className="py-3 px-4">PROJECT</th>
                <th className="py-3 px-4">LOCATION</th>
                <th className="py-3 px-4">ACQUISITION STAGE</th>
                <th className="py-3 px-4 text-center">DELAY PROBABILITY</th>
                <th className="py-3 px-4 text-center">RISK TREND</th>
                <th className="py-3 px-4 text-center">PREDICTED DELAY</th>
                <th className="py-3 px-4">PRIMARY DRIVER</th>
                <th className="py-3 px-4 text-right">LAST UPDATED</th>
                <th className="py-3 px-4 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-sans">
              {sortedProjects.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-500 font-mono">
                    No projects match the selected filters.
                  </td>
                </tr>
              ) : (
                sortedProjects.map((row) => (
                  <tr
                    key={row.id}
                    onClick={() => navigate(`/projects/${row.id}`)}
                    className="hover:bg-slate-100/80 cursor-pointer transition-colors"
                  >
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-blue-800 block text-xs">{row.id}</span>
                      <span className="font-semibold text-slate-900 block text-xs leading-tight mt-0.5">
                        {row.name}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-700 text-xs">
                      {row.district}, {row.state}
                    </td>

                    <td className="py-3.5 px-4 text-slate-700 text-xs font-medium">
                      {row.stage}
                    </td>

                    <td className="py-3.5 px-4 text-center font-mono font-bold text-sm">
                      <span
                        className={
                          row.riskCategory === 'Critical'
                            ? 'text-red-700 font-black'
                            : row.riskCategory === 'High'
                            ? 'text-amber-700 font-bold'
                            : row.riskCategory === 'Moderate'
                            ? 'text-slate-700'
                            : 'text-emerald-700 font-bold'
                        }
                      >
                        {row.riskPercent}%
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center font-mono text-xs font-bold">
                      <span
                        className={
                          row.trendType === 'Increasing'
                            ? 'text-red-700'
                            : row.trendType === 'Improving'
                            ? 'text-emerald-700'
                            : 'text-slate-600'
                        }
                      >
                        {row.trend}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center font-mono text-xs font-semibold text-slate-900">
                      +{row.predictedDelayDays} days
                    </td>

                    <td className="py-3.5 px-4 font-medium text-slate-800 text-xs">
                      {row.primaryDriver}
                    </td>

                    <td className="py-3.5 px-4 text-right text-slate-500 font-mono text-xs">
                      {row.lastUpdated}
                    </td>

                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => navigate(`/projects/${row.id}`)}
                        className="text-xs font-mono font-bold text-blue-800 hover:text-blue-950 hover:underline cursor-pointer"
                      >
                        View &rarr;
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
