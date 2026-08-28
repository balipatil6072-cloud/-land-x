import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { RotateCcw, Zap, CheckCircle2, AlertCircle } from 'lucide-react';

export const PredictionLabPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { projects, dispatchIntervention, logAuditEvent } = useApp();

  // Selected project ID (default to query param or LA-1842)
  const targetProjectId = searchParams.get('project') || 'LA-1842';
  const currentProject = projects.find((p) => p.id === targetProjectId) || projects[0];

  // Scenario Parameter Sliders
  const [compResolution, setCompResolution] = useState(80);
  const [docCompletion, setDocCompletion] = useState(75);
  const [approvalAcceleration, setApprovalAcceleration] = useState(85);
  const [legalResolution, setLegalResolution] = useState(50);

  const [dispatchSuccess, setDispatchSuccess] = useState(false);

  // Baseline Current State
  const currentRisk = 92;
  const currentDelayDays = 74;

  // Calculate Scenario Impact
  const riskReduction = Math.round((compResolution * 0.15) + (docCompletion * 0.05) + (approvalAcceleration * 0.05) + (legalResolution * 0.05));
  const projectedRisk = Math.max(35, currentRisk - riskReduction);
  const projectedDelayDays = Math.max(20, currentDelayDays - Math.round(riskReduction * 0.85));

  const handleDispatch = () => {
    dispatchIntervention({
      projectId: currentProject.id,
      projectName: currentProject.name,
      state: currentProject.state,
      district: currentProject.district,
      actionName: `Beneficiary-Bank Reconciliation & Field Action`,
      recommendedAction: `Execute scenario parameters: Compensation ${compResolution}%, Document Completion ${docCompletion}%`,
      primaryDriver: 'Compensation',
      owner: 'District Land Acquisition Cell',
      priority: 'P1',
      dueDays: 3,
      beforeRiskPercent: currentRisk,
      targetFeatureChanges: {
        compensationPaidPercent: compResolution,
        unpaidBeneficiariesPercent: 100 - compResolution,
        daysPaymentStageVsMedian: 4,
      },
    });

    logAuditEvent({
      projectId: currentProject.id,
      actionType: 'SCENARIO_CREATED',
      actionName: 'Prediction Lab Simulation Executed',
      actor: 'Monitoring Officer',
      details: `User executed scenario simulation on ${currentProject.id}. Risk score recalculated from ${currentRisk}% to ${projectedRisk}%.`,
      beforeRisk: currentRisk,
      afterRisk: projectedRisk,
    });

    setDispatchSuccess(true);
  };

  const resetSimulation = () => {
    setCompResolution(80);
    setDocCompletion(75);
    setApprovalAcceleration(85);
    setLegalResolution(50);
    setDispatchSuccess(false);
  };

  return (
    <div className="space-y-6 pb-16 font-sans antialiased max-w-7xl mx-auto">
      {/* HEADER BAR & DISCLAIMER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-200 pb-4 gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 bg-blue-50 border border-blue-200 rounded text-[11px] font-mono font-bold text-blue-700 mb-1">
            <span>PREDICTIVE SCENARIO PLANNER</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            WHAT HAPPENS IF WE ACT? &bull; {currentProject.id} {currentProject.name}
          </h1>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <span className="px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-900 font-mono font-bold rounded flex items-center space-x-1">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
            <span>PREDICTIVE SCENARIO &bull; NOT GUARANTEED OUTCOME</span>
          </span>

          <button
            onClick={resetSimulation}
            className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded border border-slate-300 flex items-center space-x-1 cursor-pointer font-mono"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* THREE-COLUMN SIMULATION CANVAS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Column 1: CURRENT STATE */}
        <div className="bg-white border border-slate-200 rounded p-6 shadow-xs space-y-4 font-mono">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block border-b border-slate-200 pb-2">
            CURRENT STATE
          </span>

          <div className="space-y-4 pt-2">
            <div>
              <span className="text-4xl font-black text-red-600 block">{currentRisk}%</span>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mt-1">
                DELAY RISK
              </span>
            </div>

            <div className="pt-2 border-t border-slate-200">
              <span className="text-3xl font-black text-slate-900 block">+{currentDelayDays} DAYS</span>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mt-1">
                EXPECTED DELAY
              </span>
            </div>
          </div>
        </div>

        {/* Column 2: INTERVENTION SCENARIOS */}
        <div className="bg-white border border-slate-200 rounded p-6 shadow-xs space-y-4 text-xs font-sans">
          <span className="font-mono text-[10px] font-bold text-slate-500 uppercase tracking-widest block border-b border-slate-200 pb-2">
            SCENARIO CONTROLS (Adjust Action Parameters)
          </span>

          <div className="space-y-4 pt-1">
            {/* Slider 1 */}
            <div className="space-y-1">
              <div className="flex justify-between font-bold text-slate-800">
                <span>Resolve Compensation Records</span>
                <span className="font-mono text-blue-700">{compResolution}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={compResolution}
                onChange={(e) => setCompResolution(Number(e.target.value))}
                className="w-full accent-blue-600 h-1.5 bg-slate-200 rounded cursor-pointer"
              />
            </div>

            {/* Slider 2 */}
            <div className="space-y-1">
              <div className="flex justify-between font-bold text-slate-800">
                <span>Documentation Completion</span>
                <span className="font-mono text-indigo-700">{docCompletion}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={docCompletion}
                onChange={(e) => setDocCompletion(Number(e.target.value))}
                className="w-full accent-indigo-600 h-1.5 bg-slate-200 rounded cursor-pointer"
              />
            </div>

            {/* Slider 3 */}
            <div className="space-y-1">
              <div className="flex justify-between font-bold text-slate-800">
                <span>Administrative Approval Acceleration</span>
                <span className="font-mono text-emerald-700">{approvalAcceleration}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={approvalAcceleration}
                onChange={(e) => setApprovalAcceleration(Number(e.target.value))}
                className="w-full accent-emerald-600 h-1.5 bg-slate-200 rounded cursor-pointer"
              />
            </div>

            {/* Slider 4 */}
            <div className="space-y-1">
              <div className="flex justify-between font-bold text-slate-800">
                <span>Legal Dispute Settlement</span>
                <span className="font-mono text-orange-600">{legalResolution}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={legalResolution}
                onChange={(e) => setLegalResolution(Number(e.target.value))}
                className="w-full accent-orange-600 h-1.5 bg-slate-200 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Column 3: PREDICTED OUTCOME */}
        <div className="bg-white border border-slate-200 rounded p-6 shadow-xs space-y-4 font-mono flex flex-col justify-between">
          <div className="space-y-4">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block border-b border-slate-200 pb-2">
              PREDICTED OUTCOME
            </span>

            <div className="space-y-4 pt-1">
              <div>
                <div className="flex items-baseline space-x-2">
                  <span className="text-4xl font-black text-emerald-600">{projectedRisk}%</span>
                  <span className="text-xs font-bold text-emerald-600">&darr; -{riskReduction} percentage pts</span>
                </div>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mt-1">
                  PREDICTED DELAY RISK
                </span>
              </div>

              <div className="pt-2 border-t border-slate-200">
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-black text-slate-900">+{projectedDelayDays} DAYS</span>
                  <span className="text-xs font-bold text-emerald-600">&darr; -{currentDelayDays - projectedDelayDays} days</span>
                </div>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mt-1">
                  PREDICTED DELAY DURATION
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DISPATCH ACTION FOOTER */}
      <div className="bg-white border border-slate-200 rounded p-6 shadow-xs space-y-4">
        <div className="space-y-1 text-xs">
          <span className="font-mono text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
            PREDICTIVE MODEL REASONING
          </span>
          <p className="text-slate-700 leading-relaxed font-medium">
            Resolving compensation records produces the highest risk reduction because payment delays are currently the primary bottleneck for {currentProject.id}.
          </p>
        </div>

        <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200">
          {dispatchSuccess ? (
            <div className="p-2 bg-emerald-50 border border-emerald-200 rounded text-xs text-emerald-800 flex items-center space-x-1.5 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Intervention approved and dispatched to District Officer!</span>
            </div>
          ) : (
            <span className="text-xs font-mono text-slate-500">Target SLA: 14 Days</span>
          )}

          <button
            onClick={handleDispatch}
            className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-mono font-bold text-xs rounded shadow-xs flex items-center justify-center space-x-2 transition-colors cursor-pointer"
          >
            <Zap className="w-4 h-4" />
            <span>APPROVE INTERVENTION &rarr;</span>
          </button>
        </div>
      </div>
    </div>
  );
};
