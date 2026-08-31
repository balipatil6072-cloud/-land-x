import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import type { OutcomeVerification } from '../types';
import {
  CheckCircle2,
  Filter,
  Plus,
  FileCheck2,
  X,
  Lock,
} from 'lucide-react';

export const InterventionCenterPage: React.FC = () => {
  const { verifyInterventionOutcome } = useApp();
  const { user } = useAuth();

  const [selectedCaseDetail, setSelectedCaseDetail] = useState<any | null>(null);

  // Exact Rows matching Reference Tile 9
  const caseRows = [
    { id: '01', projectId: 'LA-1842', problem: 'Compensation bottleneck', intervention: 'Bank-account reconciliation camp', owner: 'District Collector', dueDate: '22 May 2025', status: 'In Progress', expectedImpact: '-27 risk points' },
    { id: '02', projectId: 'LA-1931', problem: 'Legal disputes', intervention: 'Legal facilitation cell', owner: 'Project Officer', dueDate: '24 May 2025', status: 'Not Started', expectedImpact: '-24 risk points' },
    { id: '03', projectId: 'LA-2077', problem: 'Documentation delay', intervention: 'Document verification drive', owner: 'Tehsildar', dueDate: '25 May 2025', status: 'In Progress', expectedImpact: '-18 risk points' },
    { id: '04', projectId: 'LA-1555', problem: 'Approval pending', intervention: 'Inter-department meeting', owner: 'Nodal Officer', dueDate: '26 May 2025', status: 'Not Started', expectedImpact: '-14 risk points' },
    { id: '05', projectId: 'LA-1770', problem: 'Compensation delay', intervention: 'Mobile compensation unit', owner: 'RDO', dueDate: '27 May 2025', status: 'Not Started', expectedImpact: '-21 risk points' },
  ];

  // Evidence input state
  const [evidenceInput, setEvidenceInput] = useState({
    beneficiariesReviewed: 163,
    mismatchesIdentified: 117,
    mismatchesResolved: 108,
    documentsVerified: 146,
    compensationAchievedPct: 89,
  });

  const [verificationResult, setVerificationResult] = useState<OutcomeVerification | null>({
    expectedRiskReduction: 27,
    observedRiskReduction: 25,
    effectivenessPercent: 89,
    verifiedAt: '14:49:02',
    beneficiariesReviewed: 163,
    mismatchesIdentified: 117,
    mismatchesResolved: 108,
    documentsVerified: 146,
    compensationAchievedPct: 89,
  });

  const handleVerifyOutcomeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const outcome = verifyInterventionOutcome('INT-1842-01', evidenceInput);
    setVerificationResult(outcome);
  };

  return (
    <div className="w-full space-y-6 pb-12 font-sans text-slate-900 antialiased">
      {/* 6. PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-slate-300 pb-3 gap-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 uppercase font-mono">
            ACTIONS &amp; INTERVENTIONS
          </h1>
          <p className="text-sm text-slate-600 font-normal mt-1">
            Manage, track, and verify intervention actions and closed-loop risk recalculations.
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs font-mono">
          <button className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xs border border-slate-300 flex items-center space-x-1 cursor-pointer">
            <Filter className="w-3.5 h-3.5" />
            <span>Filters</span>
          </button>
          {user?.role === 'READ_ONLY' ? (
            <button
              disabled={true}
              title="Restricted to authorized operational officers."
              className="px-4 py-1.5 bg-slate-100 text-slate-500 font-bold rounded-xs border border-slate-300 flex items-center space-x-1 cursor-not-allowed opacity-80"
            >
              <Lock className="w-3.5 h-3.5 text-slate-500" />
              <span>+ New Intervention (Restricted)</span>
            </button>
          ) : (
            <button className="px-4 py-1.5 bg-blue-800 hover:bg-blue-900 text-white font-bold rounded-xs flex items-center space-x-1 cursor-pointer shadow-xs">
              <Plus className="w-3.5 h-3.5" />
              <span>+ New Intervention</span>
            </button>
          )}
        </div>
      </div>

      {/* ACTION STATUS SUMMARY STRIP */}
      <div className="bg-white border border-slate-300 rounded-xs p-4 font-mono text-xs shadow-2xs">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-slate-200">
          <div className="px-4 py-1 first:pl-0 flex justify-between md:block">
            <span className="text-[10px] text-slate-500 font-bold uppercase block">OPEN ACTIONS</span>
            <span className="text-xl font-bold text-slate-900 block mt-0.5">12 CASES</span>
          </div>
          <div className="px-4 py-1 flex justify-between md:block">
            <span className="text-[10px] text-red-700 font-bold uppercase block">HIGH PRIORITY (P1)</span>
            <span className="text-xl font-bold text-red-700 block mt-0.5">5 CASES</span>
          </div>
          <div className="px-4 py-1 flex justify-between md:block">
            <span className="text-[10px] text-amber-700 font-bold uppercase block">UNDER REVIEW</span>
            <span className="text-xl font-bold text-amber-700 block mt-0.5">5 CASES</span>
          </div>
          <div className="px-4 py-1 last:pr-0 flex justify-between md:block">
            <span className="text-[10px] text-emerald-700 font-bold uppercase block">RESOLVED THIS MONTH</span>
            <span className="text-xl font-bold text-emerald-700 block mt-0.5">8 CASES</span>
          </div>
        </div>
      </div>

      {/* 18. INTERVENTIONS TABLE */}
      <div className="bg-white border border-slate-300 rounded-xs shadow-2xs overflow-hidden w-full">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100/90 border-b border-slate-300 text-[11px] font-mono font-bold text-slate-700 uppercase">
                <th className="py-3 px-4 w-12 text-center">ID</th>
                <th className="py-3 px-4">PROJECT</th>
                <th className="py-3 px-4">PROBLEM</th>
                <th className="py-3 px-4">INTERVENTION</th>
                <th className="py-3 px-4">OWNER</th>
                <th className="py-3 px-4 text-center">DUE DATE</th>
                <th className="py-3 px-4 text-center">STATUS</th>
                <th className="py-3 px-4 text-right">EXPECTED IMPACT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-sans">
              {caseRows.map((row) => (
                <tr
                  key={row.id}
                  onClick={() => setSelectedCaseDetail(row)}
                  className="hover:bg-slate-100/80 cursor-pointer transition-colors"
                >
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-400 text-center">
                    {row.id}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-blue-800 text-xs">
                    {row.projectId}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-900 text-xs">
                    {row.problem}
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-800 text-xs">
                    {row.intervention}
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 font-semibold text-xs">
                    {row.owner}
                  </td>
                  <td className="py-3.5 px-4 text-center font-mono text-slate-700 text-xs">
                    {row.dueDate}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`px-2.5 py-0.5 rounded-xs font-mono font-bold text-[10px] uppercase ${
                        row.status === 'In Progress'
                          ? 'bg-blue-50 text-blue-800 border border-blue-200'
                          : 'bg-slate-100 text-slate-700 border border-slate-300'
                      }`}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-700 text-xs">
                    {row.expectedImpact}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* HERO DEMONSTRATION WORKSPACE (LA-1842 CASE VERIFICATION) */}
      <div className="bg-white border border-slate-300 rounded-xs p-6 shadow-2xs space-y-5">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div>
            <span className="font-mono text-xs font-bold text-blue-800 uppercase">HERO CASE &bull; LA-1842</span>
            <h2 className="text-lg font-bold text-slate-900 font-sans mt-0.5">
              Outcome Verification &amp; Risk Recalculation for LA-1842
            </h2>
          </div>

          <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 font-mono font-bold text-xs rounded-xs border border-emerald-300">
            RESOLVED ✓
          </span>
        </div>

        {/* Evidence Submission Form */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xs space-y-3 text-xs">
          <span className="font-mono text-[11px] font-bold text-slate-700 uppercase flex items-center space-x-1.5">
            <FileCheck2 className="w-4 h-4 text-blue-800" />
            <span>SUBMIT OUTCOME EVIDENCE</span>
          </span>

          <form onSubmit={handleVerifyOutcomeSubmit} className="space-y-3">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Beneficiaries Reviewed</label>
                <input
                  type="number"
                  value={evidenceInput.beneficiariesReviewed}
                  onChange={(e) => setEvidenceInput({ ...evidenceInput, beneficiariesReviewed: Number(e.target.value) })}
                  className="w-full bg-white border border-slate-300 rounded-xs px-2.5 py-1.5 font-mono text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Mismatches Resolved</label>
                <input
                  type="number"
                  value={evidenceInput.mismatchesResolved}
                  onChange={(e) => setEvidenceInput({ ...evidenceInput, mismatchesResolved: Number(e.target.value) })}
                  className="w-full bg-white border border-slate-300 rounded-xs px-2.5 py-1.5 font-mono text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Documents Verified</label>
                <input
                  type="number"
                  value={evidenceInput.documentsVerified}
                  onChange={(e) => setEvidenceInput({ ...evidenceInput, documentsVerified: Number(e.target.value) })}
                  className="w-full bg-white border border-slate-300 rounded-xs px-2.5 py-1.5 font-mono text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Achieved Comp %</label>
                <input
                  type="number"
                  value={evidenceInput.compensationAchievedPct}
                  onChange={(e) => setEvidenceInput({ ...evidenceInput, compensationAchievedPct: Number(e.target.value) })}
                  className="w-full bg-white border border-slate-300 rounded-xs px-2.5 py-1.5 font-mono text-xs font-bold"
                />
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-mono font-bold text-xs rounded-xs shadow-2xs cursor-pointer flex items-center space-x-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>MEASURE OUTCOME &amp; RECALCULATE</span>
              </button>
            </div>
          </form>
        </div>

        {/* VERIFICATION METRICS */}
        {verificationResult && (
          <div className="p-5 bg-slate-900 text-white rounded-xs space-y-4 font-mono text-xs shadow-xl">
            <div className="flex justify-between border-b border-slate-800 pb-2 text-[11px]">
              <span className="font-bold text-emerald-400 uppercase">MEASURED OUTCOME IMPACT — LA-1842</span>
              <span className="text-slate-400">Verified: 14:49:02 &bull; SLAO Nashik</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xs">
                <span className="text-[10px] text-slate-400 block uppercase">EXPECTED IMPACT</span>
                <strong className="text-lg font-bold text-slate-200">&minus;27 pts</strong>
              </div>

              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xs">
                <span className="text-[10px] text-slate-400 block uppercase">OBSERVED IMPACT</span>
                <strong className="text-lg font-bold text-emerald-400">&minus;25 pts</strong>
              </div>

              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xs">
                <span className="text-[10px] text-slate-400 block uppercase">EFFECTIVENESS</span>
                <strong className="text-xl font-bold text-emerald-300">89%</strong>
              </div>

              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xs">
                <span className="text-[10px] text-slate-400 block uppercase">RISK RECALCULATION</span>
                <strong className="text-lg font-bold text-emerald-400">92% &rarr; 65%</strong>
              </div>

              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xs">
                <span className="text-[10px] text-slate-400 block uppercase">STATUS</span>
                <strong className="text-sm font-bold text-emerald-400 block mt-1">RESOLVED ✓</strong>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* DETAIL MODAL IF SELECTED */}
      {selectedCaseDetail && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-slate-300 rounded-xs max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto text-xs font-sans">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="font-mono text-xs font-bold text-blue-800 uppercase">CASE {selectedCaseDetail.id} &bull; {selectedCaseDetail.projectId}</span>
                <h2 className="text-lg font-bold text-slate-900 mt-0.5">{selectedCaseDetail.intervention}</h2>
              </div>

              <button onClick={() => setSelectedCaseDetail(null)} className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 font-mono">
              <div className="flex justify-between">
                <span className="text-slate-500">Owner:</span>
                <span className="font-bold text-slate-900">{selectedCaseDetail.owner}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Problem:</span>
                <span className="font-bold text-slate-900">{selectedCaseDetail.problem}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Status:</span>
                <span className="font-bold text-blue-800 uppercase">{selectedCaseDetail.status}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
