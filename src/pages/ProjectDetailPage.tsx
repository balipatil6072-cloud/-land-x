import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  MapPin,
  Share2,
  Download,
  TrendingUp,
  CheckCircle2,
  Clock,
  ShieldCheck,
  FileCheck,
} from 'lucide-react';

export const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { projects, dispatchIntervention, logAuditEvent } = useApp();

  const [actionDispatched, setActionDispatched] = useState(false);

  // Target project lookup or fallback
  const project = projects.find((p) => p.id === id) || projects[0];

  // Risk Drivers Breakdown
  const riskDrivers = [
    { rank: '01', factor: 'Compensation delays', impact: 'HIGH IMPACT', desc: '38% beneficiary bank accounts unresolved', pct: 38 },
    { rank: '02', factor: 'Legal disputes', impact: 'HIGH IMPACT', desc: '17 pending heirship claims in Tehsil Court', pct: 26 },
    { rank: '03', factor: 'Incomplete documentation', impact: 'MEDIUM IMPACT', desc: '23 unverified land title deeds', pct: 18 },
    { rank: '04', factor: 'Pending approvals', impact: 'MEDIUM IMPACT', desc: '2 Gazette clearance approvals pending', pct: 11 },
    { rank: '05', factor: 'Rehabilitation progress', impact: 'LOW IMPACT', desc: '12 families pending relocation', pct: 7 },
  ];

  // Feature Importance for Explainable AI
  const featureImportance = [
    { feature: 'Compensation disbursement status', weight: '38% weight', level: 'High' },
    { feature: 'Pending legal court disputes', weight: '26% weight', level: 'High' },
    { feature: 'Title documentation completeness', weight: '18% weight', level: 'Medium' },
    { feature: 'Inter-departmental clearance time', weight: '11% weight', level: 'Medium' },
    { feature: 'Historical corridor delay pattern', weight: '7% weight', level: 'Low' },
  ];



  // Recent Changes Audit Log
  const recentChanges = [
    { item: 'Compensation processing', detail: '18 unresolved bank records', trend: '↑ increased', isBad: true },
    { item: 'Legal cases', detail: '3 new heirship dispute notices filed', trend: '↑ increased', isBad: true },
    { item: 'Documentation', detail: '12 title deeds verified by SLAO', trend: '↓ improved', isBad: false },
  ];

  // Dispatch Intervention Handler
  const handleExecuteIntervention = () => {
    dispatchIntervention({
      projectId: project.id,
      projectName: project.name,
      state: project.state,
      district: project.district,
      actionName: 'Beneficiary-Bank Reconciliation Camp',
      recommendedAction: 'Deploy Tehsil-level SLAO bank account reconciliation drive',
      primaryDriver: 'Compensation',
      owner: 'District Land Acquisition Cell',
      priority: 'P1',
      dueDays: 3,
      beforeRiskPercent: 92,
      targetFeatureChanges: {
        compensationPaidPercent: 80,
        unpaidBeneficiariesPercent: 20,
        daysPaymentStageVsMedian: 4,
      },
    });

    logAuditEvent({
      projectId: project.id,
      actionType: 'INTERVENTION_DISPATCHED',
      actionName: 'Bank Reconciliation Camp Dispatched',
      actor: 'Monitoring Officer',
      details: `Officer approved and dispatched beneficiary reconciliation camp for ${project.id}.`,
      beforeRisk: 92,
      afterRisk: 65,
    });

    setActionDispatched(true);
  };

  return (
    <div className="w-full space-y-6 pb-12 font-sans text-slate-900 antialiased">
      {/* 2. BREADCRUMB & PAGE HEADER */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-3 gap-2">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-[11px] font-mono font-medium text-slate-500">
              <button onClick={() => navigate('/')} className="hover:text-blue-700 flex items-center space-x-1 cursor-pointer">
                <span>Home</span>
              </button>
              <span>/</span>
              <button onClick={() => navigate('/projects')} className="hover:text-blue-700 flex items-center space-x-1 cursor-pointer">
                <span>Projects</span>
              </button>
              <span>/</span>
              <span>Project Intelligence</span>
              <span>/</span>
              <span className="font-bold text-slate-900 font-mono">{project.id}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 uppercase font-mono mt-1">
              PROJECT INTELLIGENCE
            </h1>
          </div>

          {/* Action Controls */}
          <div className="flex items-center space-x-2 text-xs font-mono">
            <button
              onClick={() => navigate('/national-map')}
              className="px-3 py-1.5 bg-blue-50 border border-blue-200 text-blue-800 rounded-xs font-bold hover:bg-blue-100 flex items-center space-x-1 cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Open on map</span>
            </button>

            <button className="px-3 py-1.5 bg-white border border-slate-300 text-slate-700 rounded-xs font-bold hover:bg-slate-50 flex items-center space-x-1 cursor-pointer">
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
            </button>

            <button className="px-3 py-1.5 bg-white border border-slate-300 text-slate-700 rounded-xs font-bold hover:bg-slate-50 flex items-center space-x-1 cursor-pointer">
              <Share2 className="w-3.5 h-3.5" />
              <span>Share</span>
            </button>
          </div>
        </div>

        {/* Project Meta Banner */}
        <div className="p-4 bg-white border border-slate-300 rounded-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-3">
              <span className="text-xl font-bold font-mono text-blue-800">{project.id}</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-red-100 text-red-800 border border-red-200 uppercase">
                CRITICAL RISK
              </span>
            </div>
            <h2 className="text-base font-bold text-slate-900 mt-0.5">{project.name}</h2>
            <div className="text-xs text-slate-600 font-medium mt-0.5">
              Location: <strong className="text-slate-800">{project.district}, {project.state}</strong> &bull; Type: <strong className="text-slate-800">{project.projectType}</strong> &bull; Stage: <strong className="text-slate-800">{project.currentStage}</strong>
            </div>
          </div>

          <div className="text-right font-mono text-xs text-slate-500">
            <span className="block text-[10px] font-bold text-slate-400 uppercase">LAST MODEL RUN</span>
            <span className="font-semibold text-slate-900">Today at 11:42 AM</span>
          </div>
        </div>
      </div>

      {/* 3. PRIMARY RISK HEADER (FIRST VIEWPORT SUMMARY) */}
      <div className="bg-white border border-slate-300 rounded-xs p-4 shadow-2xs">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-slate-200 font-mono text-xs">
          <div className="px-4 py-1 first:pl-0">
            <span className="text-[10px] text-slate-500 font-bold uppercase block">DELAY RISK</span>
            <span className="text-3xl font-black text-red-700 block mt-0.5">92%</span>
            <span className="text-[10px] text-red-700 font-bold block mt-0.5">CRITICAL SEVERITY</span>
          </div>

          <div className="px-4 py-1">
            <span className="text-[10px] text-slate-500 font-bold uppercase block">RISK MOVEMENT</span>
            <span className="text-xl font-bold text-red-700 flex items-center space-x-1 mt-1">
              <TrendingUp className="w-4 h-4" />
              <span>↑ +21 pts (7 days)</span>
            </span>
            <span className="text-[10px] text-slate-500 font-sans block mt-0.5">Accelerating Trajectory</span>
          </div>

          <div className="px-4 py-1">
            <span className="text-[10px] text-slate-500 font-bold uppercase block">PREDICTED DELAY</span>
            <span className="text-3xl font-black text-slate-900 block mt-0.5">+74 DAYS</span>
            <span className="text-[10px] text-slate-500 font-sans block mt-0.5">Downstream Impact</span>
          </div>

          <div className="px-4 py-1 last:pr-0">
            <span className="text-[10px] text-slate-500 font-bold uppercase block">MODEL CONFIDENCE</span>
            <span className="text-2xl font-bold text-blue-800 block mt-0.5">87%</span>
            <span className="text-[10px] text-slate-500 font-mono block mt-0.5">LAND-X ML v0.8</span>
          </div>
        </div>
      </div>

      {/* TWO-COLUMN WORKSPACE: LEFT 68% PRIMARY INTELLIGENCE / RIGHT 32% SECONDARY & AUDIT */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 items-start">
        {/* LEFT 68% (7 COLUMNS ON LG): PRIMARY INTELLIGENCE */}
        <div className="lg:col-span-7 space-y-6">
          {/* SECTION 1: RISK TRAJECTORY */}
          <div className="bg-white border border-slate-300 rounded-xs p-5 shadow-2xs space-y-3">
            <div className="flex justify-between items-baseline border-b border-slate-200 pb-2">
              <h2 className="text-xs font-mono font-bold text-slate-900 uppercase tracking-wider">
                RISK TRAJECTORY
              </h2>
              <span className="text-[11px] font-mono text-slate-500">How risk changed over 28 days</span>
            </div>

            <p className="text-xs text-slate-700 font-sans">
              How the project's predicted delay risk has changed over time.
            </p>

            <div className="pt-2 space-y-3 font-mono text-xs">
              <div className="h-28 w-full">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 400 80" preserveAspectRatio="none">
                  <path
                    d="M0,70 L100,62 L200,48 L300,32 L400,8"
                    fill="none"
                    stroke="#dc2626"
                    strokeWidth="3"
                  />
                  <circle cx="0" cy="70" r="3.5" fill="#475569" />
                  <circle cx="100" cy="62" r="3.5" fill="#475569" />
                  <circle cx="200" cy="48" r="3.5" fill="#ea580c" />
                  <circle cx="300" cy="32" r="3.5" fill="#dc2626" />
                  <circle cx="400" cy="8" r="4.5" fill="#dc2626" />
                </svg>
              </div>

              <div className="flex justify-between text-[11px] text-slate-500 border-t border-slate-100 pt-2 font-bold">
                <span>T-28: 41%</span>
                <span>T-21: 48%</span>
                <span>T-14: 57%</span>
                <span className="text-orange-700">T-7: 71%</span>
                <span className="text-red-700">TODAY: 92%</span>
              </div>
            </div>
          </div>

          {/* SECTION 2: PREDICTED PROJECT IMPACT */}
          <div className="bg-white border border-slate-300 rounded-xs p-5 shadow-2xs space-y-3">
            <div className="border-b border-slate-200 pb-2">
              <h2 className="text-xs font-mono font-bold text-slate-900 uppercase tracking-wider">
                PREDICTED PROJECT IMPACT
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xs">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">PREDICTED DELAY</span>
                <strong className="text-xl font-bold text-red-700 block mt-1">+74 DAYS</strong>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xs">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">AFFECTED MILESTONE</span>
                <strong className="text-xs font-bold text-slate-900 block mt-1">Compensation Disbursement &amp; Possession</strong>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xs">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">RISK HORIZON</span>
                <strong className="text-xs font-bold text-slate-900 block mt-1">Next 30–60 Days</strong>
              </div>
            </div>
          </div>

          {/* SECTION 3: WHY IS THIS PROJECT AT RISK? */}
          <div className="bg-white border border-slate-300 rounded-xs p-5 shadow-2xs space-y-3">
            <div className="border-b border-slate-200 pb-2">
              <h2 className="text-xs font-mono font-bold text-slate-900 uppercase tracking-wider">
                WHY IS THIS PROJECT AT RISK?
              </h2>
              <p className="text-[11px] text-slate-500 font-sans mt-0.5">
                Key factors contributing to the current prediction in ranked order.
              </p>
            </div>

            <div className="space-y-3 text-xs">
              {riskDrivers.map((d) => (
                <div key={d.rank} className="p-3 bg-slate-50 border border-slate-200 rounded-xs space-y-1.5">
                  <div className="flex justify-between items-baseline font-mono">
                    <div className="flex items-center space-x-2">
                      <span className="text-slate-400 font-bold">{d.rank}</span>
                      <span className="font-bold text-slate-900 text-xs">{d.factor}</span>
                    </div>

                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-50 text-red-700 border border-red-200 uppercase">
                      {d.impact}
                    </span>
                  </div>

                  <p className="text-slate-700 font-sans text-xs">{d.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 4: EXPLAINABLE PREDICTION */}
          <div className="bg-white border border-slate-300 rounded-xs p-5 shadow-2xs space-y-3">
            <div className="border-b border-slate-200 pb-2">
              <h2 className="text-xs font-mono font-bold text-slate-900 uppercase tracking-wider">
                PREDICTION EXPLANATION (MODEL FEATURE IMPORTANCE)
              </h2>
            </div>

            <div className="space-y-2 text-xs font-mono">
              {featureImportance.map((f) => (
                <div key={f.feature} className="flex justify-between items-center py-1.5 border-b border-slate-100">
                  <span className="font-medium text-slate-800 font-sans">{f.feature}</span>
                  <div className="flex items-center space-x-3">
                    <span className="text-slate-500">{f.weight}</span>
                    <span className="font-bold text-slate-900 w-16 text-right">{f.level}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 5: ACQUISITION LIFECYCLE DIAGRAM */}
          <div className="bg-white border border-slate-300 rounded-xs p-5 shadow-2xs space-y-4">
            <div className="flex justify-between items-baseline border-b border-slate-200 pb-2">
              <h2 className="text-xs font-mono font-bold text-slate-900 uppercase tracking-wider">
                ACQUISITION LIFECYCLE STAGE DIAGRAM
              </h2>
              <span className="text-[11px] font-mono text-red-700 font-bold">Primary Bottleneck: Stage 4 (Compensation)</span>
            </div>

            {/* Simple Step Process Diagram */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-2 font-mono text-xs">
              <div className="flex-1 p-2.5 bg-emerald-50 border border-emerald-300 rounded-xs text-center w-full">
                <div className="font-bold text-emerald-900">01. Notification</div>
                <div className="text-[10px] text-emerald-700 font-bold mt-0.5">Completed ✓</div>
              </div>
              <span className="text-slate-400 font-bold hidden md:block">&rarr;</span>

              <div className="flex-1 p-2.5 bg-emerald-50 border border-emerald-300 rounded-xs text-center w-full">
                <div className="font-bold text-emerald-900">02. Survey</div>
                <div className="text-[10px] text-emerald-700 font-bold mt-0.5">Completed ✓</div>
              </div>
              <span className="text-slate-400 font-bold hidden md:block">&rarr;</span>

              <div className="flex-1 p-2.5 bg-emerald-50 border border-emerald-300 rounded-xs text-center w-full">
                <div className="font-bold text-emerald-900">03. Documentation</div>
                <div className="text-[10px] text-emerald-700 font-bold mt-0.5">Completed ✓</div>
              </div>
              <span className="text-red-700 font-bold hidden md:block">&rarr;</span>

              <div className="flex-1 p-2.5 bg-red-100 border-2 border-red-600 rounded-xs text-center w-full shadow-xs">
                <div className="font-bold text-red-950">04. Compensation</div>
                <div className="text-[10px] text-red-700 font-black mt-0.5">⚠ BLOCKED</div>
              </div>
              <span className="text-slate-300 font-bold hidden md:block">&rarr;</span>

              <div className="flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xs text-center w-full opacity-60">
                <div className="font-bold text-slate-700">05. R&amp;R Package</div>
                <div className="text-[10px] text-slate-500 font-bold mt-0.5">&mdash; Pending</div>
              </div>
              <span className="text-slate-300 font-bold hidden md:block">&rarr;</span>

              <div className="flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xs text-center w-full opacity-60">
                <div className="font-bold text-slate-700">06. Possession</div>
                <div className="text-[10px] text-slate-500 font-bold mt-0.5">&mdash; Pending</div>
              </div>
            </div>
          </div>

          {/* SECTION 6: WHAT CHANGED? */}
          <div className="bg-white border border-slate-300 rounded-xs p-5 shadow-2xs space-y-3">
            <div className="border-b border-slate-200 pb-2">
              <h2 className="text-xs font-mono font-bold text-slate-900 uppercase tracking-wider">
                RECENT CHANGES (EVENT AUDIT)
              </h2>
            </div>

            <div className="divide-y divide-slate-200 text-xs">
              {recentChanges.map((c) => (
                <div key={c.item} className="py-2.5 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 block">{c.item}</span>
                    <span className="text-slate-600 text-[11px] block">{c.detail}</span>
                  </div>

                  <span className={`font-mono text-xs font-bold ${c.isBad ? 'text-red-700' : 'text-emerald-700'}`}>
                    {c.trend}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 7: RECOMMENDED INTERVENTION & ACTION WORKFLOW */}
          <div className="bg-white border border-slate-300 rounded-xs p-5 shadow-2xs space-y-4">
            <div className="border-b border-slate-200 pb-2">
              <h2 className="text-xs font-mono font-bold text-slate-900 uppercase tracking-wider">
                RECOMMENDED INTERVENTION
              </h2>
            </div>

            <div className="space-y-3 text-xs font-sans">
              <div>
                <span className="text-[10px] font-mono font-bold text-blue-800 uppercase block">PRIORITY ACTION</span>
                <h3 className="text-sm font-bold text-slate-900">
                  Deploy Beneficiary-Bank Reconciliation Camp at Nashik Tehsil Office
                </h3>
              </div>

              <div>
                <span className="text-[10px] font-mono font-bold text-slate-500 uppercase block">WHY THIS MATTERS</span>
                <p className="text-slate-700 mt-0.5">
                  Compensation processing is currently the largest contributor to the project's predicted delay risk (38% weight).
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs pt-1">
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xs">
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">EXPECTED EFFECT</span>
                  <span className="font-bold text-emerald-700 text-xs">Recalculates Risk: 92% &rarr; 65%</span>
                </div>

                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xs">
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">RESPONSIBLE AREA</span>
                  <span className="font-bold text-slate-900 text-xs">District LA Cell / SLAO Nashik</span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                {actionDispatched ? (
                  <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-xs text-emerald-800 text-xs font-mono font-bold flex items-center space-x-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Intervention Dispatched &amp; Logged to Governance Audit!</span>
                  </div>
                ) : (
                  <span className="text-xs text-slate-500 font-mono">Target Action SLA: 3 Days</span>
                )}

                {!actionDispatched && (
                  <button
                    onClick={handleExecuteIntervention}
                    className="px-6 py-2.5 bg-blue-800 hover:bg-blue-900 text-white font-mono font-bold text-xs rounded-xs cursor-pointer shadow-2xs transition-colors"
                  >
                    Investigate &amp; Dispatch Intervention &rarr;
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT 32% (3 COLUMNS ON LG): SECONDARY CONTEXT & AUDIT */}
        <div className="lg:col-span-3 space-y-6">
          {/* EVIDENCE & DATA TRACEABILITY */}
          <div className="bg-white border border-slate-300 rounded-xs p-4 shadow-2xs space-y-3">
            <div className="border-b border-slate-200 pb-2">
              <h2 className="text-xs font-mono font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-1.5">
                <FileCheck className="w-3.5 h-3.5 text-blue-800" />
                <span>EVIDENCE &amp; DATA</span>
              </h2>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="p-2 bg-slate-50 border border-slate-200 rounded-xs">
                <span className="text-[10px] text-slate-500 font-bold block">PROJECT RECORDS</span>
                <span className="font-semibold text-slate-900">MSRDC File #902</span>
              </div>

              <div className="p-2 bg-slate-50 border border-slate-200 rounded-xs">
                <span className="text-[10px] text-slate-500 font-bold block">COMPENSATION DOCKETS</span>
                <span className="font-semibold text-slate-900">163 Beneficiary DBT Records</span>
              </div>

              <div className="p-2 bg-slate-50 border border-slate-200 rounded-xs">
                <span className="text-[10px] text-slate-500 font-bold block">LEGAL DOCKETS</span>
                <span className="font-semibold text-slate-900">Tehsil Court Case #441–457</span>
              </div>

              <div className="p-2 bg-slate-50 border border-slate-200 rounded-xs">
                <span className="text-[10px] text-slate-500 font-bold block">GAZETTE CLEARANCE</span>
                <span className="font-semibold text-slate-900">MH Gazette #1842</span>
              </div>
            </div>
          </div>

          {/* AUDIT TRAIL */}
          <div className="bg-white border border-slate-300 rounded-xs p-4 shadow-2xs space-y-3">
            <div className="border-b border-slate-200 pb-2">
              <h2 className="text-xs font-mono font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-600" />
                <span>AUDIT TRAIL</span>
              </h2>
            </div>

            <div className="space-y-2 font-mono text-[11px] text-slate-700">
              <div className="border-l-2 border-red-600 pl-2.5 py-0.5">
                <span className="text-slate-400 block text-[10px]">28 Aug 2026</span>
                <span className="font-bold text-slate-900">Risk recalculated to 92%</span>
              </div>

              <div className="border-l-2 border-orange-600 pl-2.5 py-0.5">
                <span className="text-slate-400 block text-[10px]">28 Aug 2026</span>
                <span className="font-bold text-slate-900">Compensation mismatch logged</span>
              </div>

              <div className="border-l-2 border-slate-400 pl-2.5 py-0.5">
                <span className="text-slate-400 block text-[10px]">27 Aug 2026</span>
                <span>3 legal heirship filings added</span>
              </div>

              <div className="border-l-2 border-blue-600 pl-2.5 py-0.5">
                <span className="text-slate-400 block text-[10px]">26 Aug 2026</span>
                <span>Recommendation generated</span>
              </div>
            </div>
          </div>

          {/* PREDICTION DETAILS / MODEL METADATA */}
          <div className="bg-white border border-slate-300 rounded-xs p-4 shadow-2xs space-y-3">
            <div className="border-b border-slate-200 pb-2">
              <h2 className="text-xs font-mono font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-800" />
                <span>MODEL DETAILS</span>
              </h2>
            </div>

            <div className="space-y-1.5 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-slate-500">Model:</span>
                <span className="font-bold text-slate-900">LAND-X v0.8</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Generated:</span>
                <span className="font-semibold text-slate-800">28 Aug, 11:42</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Window:</span>
                <span className="font-semibold text-slate-800">Previous 180d</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Features:</span>
                <span className="font-semibold text-slate-800">14 parameters</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
