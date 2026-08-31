import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Cpu,
  Plus,
  AlertTriangle,
  Layers,
  Zap,
  Activity,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { calculateProjectRisk } from '../services/predictionService';
import { AddProjectModal } from '../components/AddProjectModal';

export const PredictiveIntelligencePage: React.FC = () => {
  const navigate = useNavigate();
  const { projects, warnings } = useApp();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Compute live portfolio metrics dynamically from context projects
  const analyzedProjects = projects.map((project) => ({
    project,
    prediction: calculateProjectRisk(project),
  }));

  // Sort by highest delay probability first
  const sortedPredictions = [...analyzedProjects].sort(
    (a, b) => b.prediction.riskScorePercent - a.prediction.riskScorePercent
  );

  const totalAnalyzed = projects.length;
  const highCriticalCount = analyzedProjects.filter(
    (p) => p.prediction.riskScorePercent >= 60
  ).length;

  const avgDelayProbability =
    totalAnalyzed > 0
      ? Math.round(
          analyzedProjects.reduce((sum, p) => sum + p.prediction.riskScorePercent, 0) /
            totalAnalyzed
        )
      : 0;

  const activeWarningsCount = warnings.filter((w) => w.warningState !== 'RESOLVED').length;

  // Portfolio Risk Distribution Counts
  const criticalCount = analyzedProjects.filter((p) => p.prediction.riskCategory === 'Critical').length;
  const highCount = analyzedProjects.filter((p) => p.prediction.riskCategory === 'High').length;
  const mediumCount = analyzedProjects.filter((p) => p.prediction.riskCategory === 'Medium').length;
  const lowCount = analyzedProjects.filter((p) => p.prediction.riskCategory === 'Low').length;

  // Aggregate Key Delay Drivers across portfolio
  const driverTotals: Record<string, number> = {
    Compensation: 0,
    'Legal complexity': 0,
    Approval: 0,
    Documentation: 0,
    'R&R Progress': 0,
  };

  analyzedProjects.forEach((p) => {
    p.prediction.contributors.forEach((c) => {
      if (driverTotals[c.factor] !== undefined) {
        driverTotals[c.factor] += c.percentage;
      }
    });
  });

  const driverSum = Object.values(driverTotals).reduce((a, b) => a + b, 0) || 1;
  const aggregatedDrivers = [
    { name: 'Compensation delays', pct: Math.round((driverTotals['Compensation'] / driverSum) * 100) },
    { name: 'Legal disputes', pct: Math.round((driverTotals['Legal complexity'] / driverSum) * 100) },
    { name: 'Approval delays', pct: Math.round((driverTotals['Approval'] / driverSum) * 100) },
    { name: 'Incomplete documentation', pct: Math.round((driverTotals['Documentation'] / driverSum) * 100) },
    { name: 'R&R progress', pct: Math.round((driverTotals['R&R Progress'] / driverSum) * 100) },
  ].sort((a, b) => b.pct - a.pct);

  // Stage-Level Risk Concentration
  const stageRiskMap: Record<string, string> = {
    Notification: 'LOW',
    Approval: highCount > 0 ? 'MODERATE' : 'LOW',
    Compensation: criticalCount > 0 ? 'HIGH' : 'MODERATE',
    Possession: highCriticalCount > 0 ? 'HIGH' : 'LOW',
    'Rehabilitation & Resettlement': 'MODERATE',
  };

  return (
    <div className="w-full space-y-6 pb-12 font-sans text-slate-900 antialiased select-none">
      {/* 1. PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-300 pb-3 gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <Cpu className="w-5 h-5 text-blue-700" />
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 uppercase font-mono">
              PREDICTIVE INTELLIGENCE
            </h1>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mr-1 animate-pulse" />
              Engine Active
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 font-normal mt-1">
            AI-powered early warning & delay risk probability analysis for land acquisition projects.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xs font-mono font-bold text-xs flex items-center justify-center space-x-1.5 shadow-2xs cursor-pointer transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Project</span>
        </button>
      </div>

      {/* 2. PORTFOLIO TOP SUMMARY METRICS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 font-mono">
        <div className="p-4 bg-white border border-slate-300 rounded-xs shadow-2xs space-y-1">
          <span className="text-[10px] text-slate-500 font-bold uppercase block">PROJECTS ANALYZED</span>
          <span className="text-2xl sm:text-3xl font-black text-slate-900 block">{totalAnalyzed}</span>
          <span className="text-[10px] text-slate-500 block font-sans">Active Monitored Dataset</span>
        </div>

        <div className="p-4 bg-white border border-slate-300 rounded-xs shadow-2xs space-y-1">
          <span className="text-[10px] text-amber-800 font-bold uppercase block">HIGH / CRITICAL RISK</span>
          <span className="text-2xl sm:text-3xl font-black text-amber-800 block">{highCriticalCount}</span>
          <span className="text-[10px] text-slate-500 block font-sans">Requires Priority Action</span>
        </div>

        <div className="p-4 bg-white border border-slate-300 rounded-xs shadow-2xs space-y-1">
          <span className="text-[10px] text-blue-800 font-bold uppercase block">AVG DELAY PROBABILITY</span>
          <span className="text-2xl sm:text-3xl font-black text-blue-900 block">{avgDelayProbability}%</span>
          <span className="text-[10px] text-slate-500 block font-sans">Portfolio Baseline</span>
        </div>

        <div className="p-4 bg-white border border-slate-300 rounded-xs shadow-2xs space-y-1">
          <span className="text-[10px] text-red-700 font-bold uppercase block">EARLY WARNINGS</span>
          <span className="text-2xl sm:text-3xl font-black text-red-700 block">{activeWarningsCount}</span>
          <span className="text-[10px] text-slate-500 block font-sans">Active Queue Alerts</span>
        </div>
      </div>

      {/* 3. MAIN AI PREDICTION TABLE */}
      <div className="bg-white border border-slate-300 rounded-xs shadow-2xs space-y-3 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-2 gap-2">
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-blue-800" />
            <h2 className="font-mono font-bold text-slate-900 uppercase text-xs">
              PROJECT RISK PREDICTIONS (RANKED BY DELAY PROBABILITY)
            </h2>
          </div>
          <span className="text-[11px] font-mono text-slate-500">
            Updated Real-Time via KSHETRA Engine
          </span>
        </div>

        {totalAnalyzed === 0 ? (
          <div className="p-12 text-center space-y-3 font-mono">
            <AlertTriangle className="w-8 h-8 text-slate-400 mx-auto" />
            <h3 className="font-bold text-slate-800 text-sm">NO PROJECT PREDICTIONS YET</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto font-sans">
              Add or import a land acquisition project to run predictive analysis and generate risk predictions.
            </p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 bg-blue-700 text-white text-xs font-bold rounded-xs cursor-pointer"
            >
              + Add Project
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100/90 border-b border-slate-300 text-[11px] font-mono font-bold text-slate-700 uppercase">
                  <th className="py-2.5 px-3">PROJECT</th>
                  <th className="py-2.5 px-3">LOCATION</th>
                  <th className="py-2.5 px-3">CURRENT STAGE</th>
                  <th className="py-2.5 px-3 text-center">DELAY PROBABILITY</th>
                  <th className="py-2.5 px-3 text-center">RISK</th>
                  <th className="py-2.5 px-3">PRIMARY DRIVER</th>
                  <th className="py-2.5 px-3">UPDATED</th>
                  <th className="py-2.5 px-3 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {sortedPredictions.map(({ project, prediction }) => (
                  <tr key={project.id} className="hover:bg-slate-50 transition-colors font-medium">
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900 font-mono text-xs">{project.id}</div>
                      <div className="text-slate-700 text-xs font-sans truncate max-w-xs">{project.name}</div>
                    </td>
                    <td className="py-3 px-3 text-slate-700 font-mono text-[11px]">
                      {project.district}, {project.state}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 bg-slate-100 border border-slate-300 text-slate-800 rounded-xs text-[11px] font-mono font-bold">
                        {project.currentStage}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-bold">
                      <span className="text-sm text-slate-900">{prediction.riskScorePercent}%</span>
                      <span className="text-[10px] text-slate-500 block font-sans">+{prediction.predictedDelayDays}d delay</span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`px-2 py-0.5 rounded-xs text-[10px] font-mono font-bold uppercase ${
                          prediction.riskCategory === 'Critical'
                            ? 'bg-red-700 text-white'
                            : prediction.riskCategory === 'High'
                            ? 'bg-orange-600 text-white'
                            : prediction.riskCategory === 'Medium'
                            ? 'bg-amber-600 text-white'
                            : 'bg-emerald-700 text-white'
                        }`}
                      >
                        {prediction.riskCategory}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-700 text-xs font-mono font-medium">
                      {prediction.contributors[0]?.factor || 'Compensation'}
                    </td>
                    <td className="py-3 px-3 text-slate-500 text-[11px] font-mono">
                      {project.lastUpdated || 'Today'}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => navigate(`/projects/${project.id}`)}
                        className="px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 rounded-xs font-mono font-bold text-[11px] cursor-pointer transition-colors"
                      >
                        INTELLIGENCE &rarr;
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 4. VISUALIZATIONS GRID: RISK DISTRIBUTION & KEY DELAY DRIVERS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* PORTFOLIO RISK DISTRIBUTION */}
        <div className="bg-white border border-slate-300 rounded-xs p-4 shadow-2xs space-y-3 font-mono">
          <div className="border-b border-slate-200 pb-1.5 flex justify-between items-baseline">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              PORTFOLIO RISK DISTRIBUTION
            </h3>
            <span className="text-[10px] text-slate-500">Categorized</span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div>
              <div className="flex justify-between text-[11px] font-bold mb-1">
                <span className="text-emerald-700">LOW (&lt;40%)</span>
                <span className="text-slate-900">{lowCount} projects</span>
              </div>
              <div className="h-2.5 bg-slate-100 rounded-xs overflow-hidden">
                <div
                  className="h-full bg-emerald-600 rounded-xs"
                  style={{ width: `${totalAnalyzed > 0 ? (lowCount / totalAnalyzed) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] font-bold mb-1">
                <span className="text-amber-700">MODERATE (40–59%)</span>
                <span className="text-slate-900">{mediumCount} projects</span>
              </div>
              <div className="h-2.5 bg-slate-100 rounded-xs overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-xs"
                  style={{ width: `${totalAnalyzed > 0 ? (mediumCount / totalAnalyzed) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] font-bold mb-1">
                <span className="text-orange-700">HIGH (60–79%)</span>
                <span className="text-slate-900">{highCount} projects</span>
              </div>
              <div className="h-2.5 bg-slate-100 rounded-xs overflow-hidden">
                <div
                  className="h-full bg-orange-600 rounded-xs"
                  style={{ width: `${totalAnalyzed > 0 ? (highCount / totalAnalyzed) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] font-bold mb-1">
                <span className="text-red-700">CRITICAL (≥80%)</span>
                <span className="text-slate-900">{criticalCount} projects</span>
              </div>
              <div className="h-2.5 bg-slate-100 rounded-xs overflow-hidden">
                <div
                  className="h-full bg-red-700 rounded-xs"
                  style={{ width: `${totalAnalyzed > 0 ? (criticalCount / totalAnalyzed) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* WHY ARE PROJECTS AT RISK? (KEY DELAY DRIVERS) */}
        <div className="bg-white border border-slate-300 rounded-xs p-4 shadow-2xs space-y-3 font-mono">
          <div className="border-b border-slate-200 pb-1.5 flex justify-between items-baseline">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              WHY ARE PROJECTS AT RISK? (KEY DELAY DRIVERS)
            </h3>
            <span className="text-[10px] text-slate-500">Aggregated</span>
          </div>

          <div className="space-y-2 text-xs font-sans">
            {aggregatedDrivers.map((driver) => (
              <div key={driver.name} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-900">{driver.name}</span>
                  <span className="font-mono font-bold text-slate-900">{driver.pct}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-xs overflow-hidden">
                  <div className="h-full bg-blue-700 rounded-xs" style={{ width: `${driver.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. ACQUISITION STAGE RISK & EARLY WARNINGS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* STAGE-LEVEL RISK MATRIX */}
        <div className="bg-white border border-slate-300 rounded-xs p-4 shadow-2xs space-y-3 font-mono lg:col-span-2">
          <div className="border-b border-slate-200 pb-1.5 flex items-center space-x-2">
            <Layers className="w-4 h-4 text-blue-800" />
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              ACQUISITION STAGE RISK CONCENTRATION
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
            {Object.entries(stageRiskMap).map(([stage, risk]) => (
              <div key={stage} className="p-3 bg-slate-50 border border-slate-200 rounded-xs text-center space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase block truncate">{stage}</span>
                <span
                  className={`text-xs font-bold block ${
                    risk === 'CRITICAL' || risk === 'HIGH'
                      ? 'text-red-700'
                      : risk === 'MODERATE'
                      ? 'text-amber-700'
                      : 'text-emerald-700'
                  }`}
                >
                  {risk}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* EARLY WARNINGS QUEUE */}
        <div className="bg-white border border-slate-300 rounded-xs p-4 shadow-2xs space-y-3 font-mono">
          <div className="border-b border-slate-200 pb-1.5 flex justify-between items-center">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              EARLY WARNINGS
            </h3>
            <button
              onClick={() => navigate('/early-warning')}
              className="text-[11px] text-blue-800 hover:underline font-bold cursor-pointer"
            >
              VIEW QUEUE &rarr;
            </button>
          </div>

          <div className="space-y-2 text-xs font-sans">
            <div className="p-2.5 bg-red-50 border border-red-200 rounded-xs space-y-1">
              <span className="font-mono font-bold text-red-800 text-[11px] uppercase block">
                HIGH RISK ESCALATION ({highCriticalCount} PROJECTS)
              </span>
              <p className="text-slate-700 text-xs">
                {highCriticalCount} projects have delay probability exceeding the critical threshold.
              </p>
            </div>

            <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xs space-y-1">
              <span className="font-mono font-bold text-amber-900 text-[11px] uppercase block">
                COMPENSATION BOTTLENECK
              </span>
              <p className="text-slate-700 text-xs">
                Compensation disbursement is the primary driver across 3 major infrastructure corridors.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 6. PRIORITY INTERVENTIONS */}
      <div className="bg-slate-900 text-white rounded-xs p-5 shadow-md space-y-3 font-mono">
        <div className="border-b border-slate-800 pb-2 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              PRIORITY INTERVENTIONS (KSHETRA RECOMMENDED)
            </h3>
          </div>
          <button
            onClick={() => navigate('/interventions')}
            className="text-[11px] text-blue-400 hover:underline font-bold cursor-pointer"
          >
            DISPATCH CENTER &rarr;
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-sans pt-1">
          <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xs space-y-1">
            <span className="font-mono text-[10px] text-amber-400 font-bold uppercase block">1. COMPENSATION RECONCILIATION</span>
            <p className="text-slate-200 text-xs font-medium">
              Deploy beneficiary bank account reconciliation camps at Nashik & Patna Tehsils.
            </p>
            <span className="text-[10px] text-slate-400 font-mono block">Affects 3 High-Risk Projects</span>
          </div>

          <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xs space-y-1">
            <span className="font-mono text-[10px] text-blue-400 font-bold uppercase block">2. FAST-TRACK LEGAL RESOLUTION</span>
            <p className="text-slate-200 text-xs font-medium">
              Convene SLAO Lok Adalat valuation benches for 32 active title dispute cases.
            </p>
            <span className="text-[10px] text-slate-400 font-mono block">Affects 2 High-Risk Projects</span>
          </div>

          <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xs space-y-1">
            <span className="font-mono text-[10px] text-emerald-400 font-bold uppercase block">3. CLEARANCE MILESTONE REVIEW</span>
            <p className="text-slate-200 text-xs font-medium">
              Review inter-departmental gazette clearance delays with State Nodal Officer.
            </p>
            <span className="text-[10px] text-slate-400 font-mono block">Affects 2 High-Risk Projects</span>
          </div>
        </div>
      </div>

      {/* ADD PROJECT PREDICTIVE ANALYTICS MODAL */}
      <AddProjectModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
    </div>
  );
};
