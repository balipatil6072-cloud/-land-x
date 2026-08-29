import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, ArrowUpDown, Plus } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { calculateProjectRisk } from '../services/predictionService';
import { AddProjectModal } from '../components/AddProjectModal';

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
  const { projects } = useApp();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Active View Tab: 'all' | 'at-risk' | 'critical' | 'improving'
  const [activeTab, setActiveTab] = useState<'all' | 'at-risk' | 'critical' | 'improving'>('all');

  // Filter & Sort States
  const [selectedStage, setSelectedStage] = useState<string>('All');
  const [selectedRiskLevel, setSelectedRiskLevel] = useState<string>('All');
  const [selectedTrend, setSelectedTrend] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('highest-risk');

  // Static Mock Directory fallback items
  const staticProjectsData = [
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
      lastUpdated: '1d ago',
    },
    {
      id: 'LA-2104',
      name: 'Coastal Economic Zone Industrial Land Acquisition',
      district: 'Khurda',
      state: 'Odisha',
      stage: 'R&R Package',
      riskPercent: 78,
      riskCategory: 'High',
      trend: '↑ +11 pts',
      trendType: 'Increasing',
      predictedDelayDays: 36,
      primaryDriver: 'Rehabilitation',
      lastUpdated: '1d ago',
    },
    {
      id: 'LA-2219',
      name: 'Bengaluru Suburban Railway Corridor 3',
      district: 'Bengaluru Urban',
      state: 'Karnataka',
      stage: 'Survey',
      riskPercent: 62,
      riskCategory: 'High',
      trend: '↑ +8 pts',
      trendType: 'Increasing',
      predictedDelayDays: 24,
      primaryDriver: 'Approval',
      lastUpdated: '3d ago',
    },
  ];

  // Dynamic combination of AppContext projects + fallback static list
  const combinedProjects = [
    ...projects.map((p) => {
      const pred = calculateProjectRisk(p);
      return {
        id: p.id,
        name: p.name,
        district: p.district,
        state: p.state,
        stage: p.currentStage,
        riskPercent: pred.riskScorePercent,
        riskCategory: pred.riskCategory,
        trend: '↑ +18 pts',
        trendType: 'Increasing',
        predictedDelayDays: pred.predictedDelayDays,
        primaryDriver: p.recommendedIntervention.primaryDriver,
        lastUpdated: p.lastUpdated || 'Just Now',
      };
    }),
    ...staticProjectsData.filter((d) => !projects.some((p) => p.id === d.id)),
  ];

  // Filter Logic
  const filteredProjects = combinedProjects.filter((item) => {
    if (selectedState !== 'All' && item.state !== selectedState) return false;
    if (selectedStage !== 'All' && item.stage !== selectedStage) return false;
    if (selectedRiskLevel !== 'All' && item.riskCategory !== selectedRiskLevel) return false;
    if (selectedTrend !== 'All' && item.trendType !== selectedTrend) return false;

    if (activeTab === 'at-risk' && item.riskPercent < 60) return false;
    if (activeTab === 'critical' && item.riskCategory !== 'Critical') return false;
    if (activeTab === 'improving' && item.trendType !== 'Decreasing') return false;

    if (
      searchQuery.trim() &&
      !item.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !item.id.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !item.district.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !item.state.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    return true;
  });

  // Sort Logic
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-300 pb-3 gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 uppercase font-mono">
              PROJECTS
            </h1>
            <p className="text-sm text-slate-600 font-normal mt-1">
              Land acquisition project intelligence registry.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xs font-mono font-bold text-xs flex items-center justify-center space-x-1.5 shadow-2xs cursor-pointer transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add Project</span>
            </button>

            {/* Quick Search */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search project, district, state, ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xs pl-9 pr-3 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-blue-600 font-medium"
              />
            </div>
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
            All Projects ({combinedProjects.length})
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
            <span className="text-2xl font-bold text-amber-800 block mt-1">618</span>
          </div>
          <div className="px-4 py-1 flex justify-between md:block">
            <span className="text-[11px] text-red-700 font-bold uppercase block">CRITICAL</span>
            <span className="text-2xl font-bold text-red-700 block mt-1">147</span>
          </div>
          <div className="px-4 py-1 flex justify-between md:block">
            <span className="text-[11px] text-emerald-800 font-bold uppercase block">IMPROVING</span>
            <span className="text-2xl font-bold text-emerald-800 block mt-1">89</span>
          </div>
        </div>

        {/* RISK DISTRIBUTION BAR */}
        <div className="pt-3 border-t border-slate-200 space-y-1.5">
          <div className="flex justify-between text-[11px] font-mono text-slate-600 uppercase font-bold">
            <span>RISK DISTRIBUTION</span>
            <span>42% LOW &bull; 28% MED &bull; 18% HIGH &bull; 12% CRIT</span>
          </div>
          <div className="h-3.5 bg-slate-100 rounded-xs overflow-hidden flex font-mono text-[9px] font-bold text-white leading-none">
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
            className="bg-slate-50 border border-slate-300 text-slate-800 rounded-xs px-3 py-2 focus:outline-hidden font-medium cursor-pointer"
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
            className="bg-slate-50 border border-slate-300 text-slate-800 rounded-xs px-3 py-2 focus:outline-hidden font-medium cursor-pointer"
          >
            <option value="All">All Stages</option>
            <option value="Notification">Notification</option>
            <option value="SIA">SIA</option>
            <option value="Declaration">Declaration</option>
            <option value="Compensation">Compensation</option>
            <option value="Legal Gazette">Legal Gazette</option>
            <option value="Possession">Possession</option>
            <option value="R&R Package">R&R Package</option>
          </select>

          {/* Risk Level Filter */}
          <select
            value={selectedRiskLevel}
            onChange={(e) => setSelectedRiskLevel(e.target.value)}
            className="bg-slate-50 border border-slate-300 text-slate-800 rounded-xs px-3 py-2 focus:outline-hidden font-medium cursor-pointer"
          >
            <option value="All">All Risk Levels</option>
            <option value="Critical">Critical (≥80%)</option>
            <option value="High">High (60-79%)</option>
            <option value="Medium">Medium (40-59%)</option>
            <option value="Low">Low (&lt;40%)</option>
          </select>

          {/* Trend Filter */}
          <select
            value={selectedTrend}
            onChange={(e) => setSelectedTrend(e.target.value)}
            className="bg-slate-50 border border-slate-300 text-slate-800 rounded-xs px-3 py-2 focus:outline-hidden font-medium cursor-pointer"
          >
            <option value="All">All Trends</option>
            <option value="Increasing">Increasing Risk (Deteriorating)</option>
            <option value="Stable">Stable Risk</option>
            <option value="Decreasing">Decreasing Risk (Improving)</option>
          </select>

          {/* Sort By */}
          <div className="flex items-center space-x-1.5 bg-slate-50 border border-slate-300 rounded-xs px-3 py-1.5">
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

      {/* HIGH DENSITY OPERATIONAL PROJECT TABLE */}
      <div className="bg-white border border-slate-300 rounded-xs shadow-2xs overflow-hidden w-full">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100/90 border-b border-slate-300 text-[11px] font-mono font-bold text-slate-700 uppercase">
                <th className="py-3 px-4">PROJECT</th>
                <th className="py-3 px-4">LOCATION</th>
                <th className="py-3 px-4">ACQUISITION STAGE</th>
                <th className="py-3 px-4 text-center">DELAY PROBABILITY</th>
                <th className="py-3 px-4 text-center">PREDICTED DELAY</th>
                <th className="py-3 px-4">PRIMARY DRIVER</th>
                <th className="py-3 px-4 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {sortedProjects.map((project) => (
                <tr key={project.id} className="hover:bg-slate-50 transition-colors font-medium">
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900 font-mono text-xs">{project.id}</div>
                    <div className="text-slate-700 text-xs font-sans truncate max-w-xs">{project.name}</div>
                  </td>
                  <td className="py-3 px-4 text-slate-700 font-mono text-[11px]">
                    {project.district}, {project.state}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 bg-slate-100 border border-slate-300 text-slate-800 rounded-xs text-[11px] font-mono font-bold">
                      {project.stage}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center space-x-1.5 font-mono font-bold">
                      <span
                        className={`px-2 py-0.5 rounded-xs text-xs ${
                          project.riskCategory === 'Critical'
                            ? 'bg-red-100 text-red-800 border border-red-300'
                            : project.riskCategory === 'High'
                            ? 'bg-orange-100 text-orange-800 border border-orange-300'
                            : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        }`}
                      >
                        {project.riskPercent}%
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center font-mono font-bold text-slate-900">
                    +{project.predictedDelayDays}d
                  </td>
                  <td className="py-3 px-4 text-slate-700 text-xs font-mono font-medium">
                    {project.primaryDriver}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => navigate(`/projects/${project.id}`)}
                      className="px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 rounded-xs font-mono font-bold text-[11px] cursor-pointer transition-colors"
                    >
                      VIEW INTELLIGENCE &rarr;
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD PROJECT PREDICTIVE ANALYTICS MODAL */}
      <AddProjectModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
    </div>
  );
};
