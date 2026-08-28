import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import type { EarlyWarningItem } from '../types';
import {
  SlidersHorizontal,
  Zap,
  ChevronRight,
  X,
} from 'lucide-react';

export const EarlyWarningPage: React.FC = () => {
  const navigate = useNavigate();
  const { warnings, updateWarningState, dispatchIntervention } = useApp();

  const [selectedWarningDetail, setSelectedWarningDetail] = useState<EarlyWarningItem | null>(null);

  // Exact Rows matching Reference Tile 8
  const warningRows = [
    { id: 'LA-1842', riskChange: '+12%', velocity: 'Rising Rapidly', cause: 'Compensation delays increasing', priority: 'Critical', color: 'text-red-700 bg-red-50 border-red-200' },
    { id: 'LA-1931', riskChange: '+9%', velocity: 'Rising', cause: 'New legal case filed', priority: 'Critical', color: 'text-red-700 bg-red-50 border-red-200' },
    { id: 'LA-2077', riskChange: '+8%', velocity: 'Rising', cause: 'Documentation stuck', priority: 'High', color: 'text-orange-700 bg-orange-50 border-orange-200' },
    { id: 'LA-1555', riskChange: '+6%', velocity: 'Rising', cause: 'Approval pending', priority: 'High', color: 'text-orange-700 bg-orange-50 border-orange-200' },
    { id: 'LA-1770', riskChange: '+5%', velocity: 'Stable', cause: 'Compensation rate slow', priority: 'Medium', color: 'text-amber-700 bg-amber-50 border-amber-200' },
    { id: 'LA-1668', riskChange: '+4%', velocity: 'Stable', cause: 'Legal hearing delayed', priority: 'Medium', color: 'text-amber-700 bg-amber-50 border-amber-200' },
  ];

  const handleDispatchFromWarning = (w: EarlyWarningItem) => {
    dispatchIntervention({
      projectId: w.projectId,
      projectName: w.projectName,
      state: w.state,
      district: w.district,
      actionName: `Early Warning Dispatch: ${w.primaryDriver} Intervention`,
      recommendedAction: w.recommendedAction,
      primaryDriver: w.primaryDriver,
      owner: 'District Land Acquisition Cell',
      priority: w.priorityLevel,
      dueDays: w.priorityLevel === 'P1' ? 3 : 7,
      beforeRiskPercent: w.currentRiskScore,
      targetFeatureChanges: {
        compensationPaidPercent: 89,
        unpaidBeneficiariesPercent: 11,
        daysPaymentStageVsMedian: 5,
        legalCasesCount: 6,
      },
    });

    updateWarningState(w.id, 'UNDER ACTION');
  };

  return (
    <div className="w-full space-y-6 pb-12 font-sans text-slate-900 antialiased">
      {/* 6. PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-slate-300 pb-3 gap-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 uppercase font-mono">
            WARNINGS
          </h1>
          <p className="text-sm text-slate-600 font-normal mt-1">
            Projects where risk has recently increased or crossed a defined operational threshold.
          </p>
        </div>

        <button className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-mono font-bold text-xs rounded-xs border border-slate-300 transition-colors cursor-pointer">
          View All Alerts
        </button>
      </div>

      {/* OPERATIONAL ESCALATION SUMMARY STRIP */}
      <div className="p-4 bg-white border border-slate-300 rounded-xs font-mono text-xs shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-6">
          <div>
            <span className="text-[10px] text-slate-500 font-bold uppercase block">RISK ESCALATIONS THIS WEEK</span>
            <strong className="text-xl font-bold text-red-700 block mt-0.5">24 PROJECTS</strong>
          </div>
          <div className="h-8 w-px bg-slate-200" />
          <div>
            <span className="text-[10px] text-slate-500 font-bold uppercase block">LAST WEEK COMPARISON</span>
            <strong className="text-sm font-bold text-slate-800 block mt-0.5">16 Projects (↑ +8 increase)</strong>
          </div>
        </div>

        <span className="text-xs text-slate-500 font-sans">
          Primary Acceleration: <strong className="text-slate-900 font-mono">Compensation Mismatches &amp; Legal Notices</strong>
        </span>
      </div>

      {/* 18. WARNINGS TABLE */}
      <div className="bg-white border border-slate-300 rounded-xs shadow-2xs overflow-hidden w-full">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100/90 border-b border-slate-300 text-[11px] font-mono font-bold text-slate-700 uppercase">
                <th className="py-3 px-4">PROJECT</th>
                <th className="py-3 px-4 text-center">RISK CHANGE</th>
                <th className="py-3 px-4">VELOCITY</th>
                <th className="py-3 px-4">CAUSE</th>
                <th className="py-3 px-4 text-center">PRIORITY</th>
                <th className="py-3 px-4 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-sans">
              {warningRows.map((row) => {
                const targetWarning = warnings.find((w) => w.projectId === row.id) || warnings[0];

                return (
                  <tr
                    key={row.id}
                    onClick={() => setSelectedWarningDetail(targetWarning)}
                    className="hover:bg-slate-100/80 cursor-pointer transition-colors"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-800 text-xs">
                      {row.id}
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono font-black text-red-700 text-sm">
                      {row.riskChange}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-700 text-xs">
                      {row.velocity}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900 text-xs">
                      {row.cause}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`px-2 py-0.5 rounded-xs font-mono font-bold text-[10px] uppercase border ${row.color}`}>
                        {row.priority}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setSelectedWarningDetail(targetWarning)}
                        className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-mono font-bold rounded-xs text-[11px] border border-slate-300 transition-colors cursor-pointer inline-flex items-center space-x-1"
                      >
                        <span>Review</span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAIL MODAL DRAWER IF OPENED */}
      {selectedWarningDetail && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-slate-300 rounded-xs max-w-xl w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto text-xs font-sans">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="font-mono text-xs font-bold text-blue-800 uppercase">
                  {selectedWarningDetail.projectId} &bull; {selectedWarningDetail.priorityLevel} ALERT
                </span>
                <h2 className="text-lg font-bold text-slate-900 mt-0.5">
                  {selectedWarningDetail.projectName}
                </h2>
              </div>

              <button
                onClick={() => setSelectedWarningDetail(null)}
                className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xs space-y-1.5 font-mono">
              <span className="text-[10px] text-slate-500 font-bold uppercase block">PRIMARY CAUSE</span>
              <div className="font-bold text-slate-900 text-sm">{selectedWarningDetail.primaryDriver}</div>
            </div>

            <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xs space-y-1">
              <span className="font-mono text-[10px] font-bold text-blue-900 uppercase block">RECOMMENDED ACTION</span>
              <p className="text-slate-800 font-semibold">{selectedWarningDetail.recommendedAction}</p>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-200 font-mono">
              <button
                onClick={() => navigate(`/prediction-lab?project=${selectedWarningDetail.projectId}`)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xs flex items-center space-x-1.5 cursor-pointer"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>SIMULATE</span>
              </button>

              <button
                onClick={() => {
                  handleDispatchFromWarning(selectedWarningDetail);
                  setSelectedWarningDetail(null);
                }}
                className="px-5 py-2 bg-blue-800 hover:bg-blue-900 text-white font-bold text-xs rounded-xs shadow-xs flex items-center space-x-1.5 cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>DISPATCH INTERVENTION</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
