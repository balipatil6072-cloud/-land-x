import React, { useState } from 'react';
import { ShieldCheck, User, Search, Filter } from 'lucide-react';

export const GovernancePage: React.FC = () => {
  const [logFilterQuery, setLogFilterQuery] = useState('');
  const [actionTypeFilter, setActionTypeFilter] = useState('All');

  // Hero demonstration audit timeline events specified by prompt
  const heroAuditEvents = [
    {
      id: 'AUD-901',
      timestamp: '14:32:08',
      actor: 'System Predictive Engine',
      actionType: 'Prediction Generated',
      projectId: 'LA-1842',
      details: 'Risk score generated based on 14 acquisition lifecycle features.',
      auditRef: '0x8f2a...1a9e',
      beforeRisk: 71,
      afterRisk: 92,
    },
    {
      id: 'AUD-902',
      timestamp: '14:33:15',
      actor: 'Anomaly Detection System',
      actionType: 'Risk Assessed',
      projectId: 'LA-1842',
      details: 'Escalation detected (+21 points / 14 days). Priority set to P1.',
      auditRef: '0x3b1c...4d2f',
      beforeRisk: 92,
      afterRisk: 92,
    },
    {
      id: 'AUD-903',
      timestamp: '14:34:40',
      actor: 'Decision Support System',
      actionType: 'Intervention Recommended',
      projectId: 'LA-1842',
      details: 'Deploy beneficiary-bank reconciliation camp at Nashik Tehsil office.',
      auditRef: '0x7e4d...9a1b',
      beforeRisk: 92,
      afterRisk: 65,
    },
    {
      id: 'AUD-904',
      timestamp: '14:35:10',
      actor: 'Special Land Officer Nashik',
      actionType: 'Officer Approval',
      projectId: 'LA-1842',
      details: 'Officer approved recommended SLAO Tehsil reconciliation camp.',
      auditRef: '0x5c8a...2e4d',
      beforeRisk: 92,
      afterRisk: 92,
    },
    {
      id: 'AUD-905',
      timestamp: '14:35:11',
      actor: 'District LA Cell',
      actionType: 'Intervention Dispatched',
      projectId: 'LA-1842',
      details: 'Intervention order dispatched to District Land Cell for execution.',
      auditRef: '0x1d9f...6b3c',
      beforeRisk: 92,
      afterRisk: 92,
    },
    {
      id: 'AUD-906',
      timestamp: '14:48:21',
      actor: 'Tehsil Field Inspector',
      actionType: 'Evidence Submitted',
      projectId: 'LA-1842',
      details: '163 beneficiaries reviewed, 108 Direct Benefit Transfer bank mismatches resolved.',
      auditRef: '0x4a2e...8f1d',
      beforeRisk: 92,
      afterRisk: 92,
    },
    {
      id: 'AUD-907',
      timestamp: '14:49:02',
      actor: 'Senior SLAO Auditor',
      actionType: 'Outcome Verified',
      projectId: 'LA-1842',
      details: 'Intervention effectiveness verified at 89% (-25 observed risk points).',
      auditRef: '0x9b3c...5e7a',
      beforeRisk: 92,
      afterRisk: 67,
    },
    {
      id: 'AUD-908',
      timestamp: '14:49:03',
      actor: 'System Predictive Engine',
      actionType: 'Risk Recalculated',
      projectId: 'LA-1842',
      details: 'Closed-loop risk score recalculated from 92% down to 65%. Warning status set to RESOLVED.',
      auditRef: '0x2e8f...1c4b',
      beforeRisk: 92,
      afterRisk: 65,
    },
  ];

  const filteredLogs = heroAuditEvents.filter((log) => {
    if (actionTypeFilter !== 'All' && log.actionType !== actionTypeFilter) return false;
    if (
      logFilterQuery.trim() &&
      !log.projectId.toLowerCase().includes(logFilterQuery.toLowerCase()) &&
      !log.actionType.toLowerCase().includes(logFilterQuery.toLowerCase()) &&
      !log.details.toLowerCase().includes(logFilterQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="w-full space-y-6 pb-12 font-sans text-slate-900 antialiased">
      {/* 6. PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-slate-300 pb-3 gap-2">
        <div>
          <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider block mb-1">
            IMMUTABLE GOVERNANCE AUDIT TRAIL
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 uppercase font-mono">
            GOVERNANCE AUDIT LOG
          </h1>
          <p className="text-sm text-slate-600 font-normal mt-1">
            System audit, decision traceability, and event timeline log.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center space-x-3 text-xs font-mono">
          <div className="relative w-48">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Search audit log..."
              value={logFilterQuery}
              onChange={(e) => setLogFilterQuery(e.target.value)}
              className="w-full bg-white border border-slate-300 text-slate-900 rounded-xs pl-8 pr-3 py-1.5 font-medium focus:outline-hidden"
            />
          </div>

          <div className="flex items-center space-x-1 bg-white border border-slate-300 px-2.5 py-1.5 rounded-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={actionTypeFilter}
              onChange={(e) => setActionTypeFilter(e.target.value)}
              className="bg-transparent text-slate-900 font-bold focus:outline-hidden cursor-pointer"
            >
              <option value="All">All Actions</option>
              <option value="Prediction Generated">Prediction Generated</option>
              <option value="Risk Assessed">Risk Assessed</option>
              <option value="Intervention Recommended">Intervention Recommended</option>
              <option value="Officer Approval">Officer Approval</option>
              <option value="Intervention Dispatched">Intervention Dispatched</option>
              <option value="Evidence Submitted">Evidence Submitted</option>
              <option value="Outcome Verified">Outcome Verified</option>
              <option value="Risk Recalculated">Risk Recalculated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Audit Timeline */}
      <div className="bg-white border border-slate-300 rounded-xs p-6 shadow-2xs space-y-4">
        <div className="flex items-center space-x-2 border-b border-slate-200 pb-3">
          <ShieldCheck className="w-4 h-4 text-blue-800" />
          <h2 className="text-xs font-mono font-bold text-slate-900 uppercase tracking-wider">
            CHRONOLOGICAL AUDIT TIMELINE LOG (HERO PROJECT LA-1842)
          </h2>
        </div>

        <div className="space-y-4 py-2 font-mono text-xs">
          {filteredLogs.map((log) => (
            <div
              key={log.id}
              className="flex items-start space-x-4 border-l-2 border-slate-300 pl-4 py-2.5 relative hover:bg-slate-50 rounded-r-xs transition-colors"
            >
              {/* Node indicator */}
              <div
                className={`w-2.5 h-2.5 rounded-full absolute -left-[6px] top-3.5 ${
                  log.actionType === 'Risk Recalculated' || log.actionType === 'Outcome Verified'
                    ? 'bg-emerald-700'
                    : log.actionType === 'Intervention Dispatched' || log.actionType === 'Officer Approval'
                    ? 'bg-blue-800'
                    : log.actionType === 'Intervention Recommended'
                    ? 'bg-amber-600'
                    : 'bg-slate-700'
                }`}
              />

              {/* Timestamp */}
              <div className="text-xs text-slate-500 font-bold w-20 flex-shrink-0 pt-0.5">
                {log.timestamp}
              </div>

              {/* Project ID */}
              <div className="w-20 flex-shrink-0 font-bold text-blue-800 text-xs">
                {log.projectId}
              </div>

              {/* Event Type */}
              <div className="w-48 flex-shrink-0">
                <span
                  className={`px-2 py-0.5 rounded-xs text-[10px] font-extrabold uppercase border ${
                    log.actionType === 'Risk Recalculated' || log.actionType === 'Outcome Verified'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      : log.actionType === 'Intervention Dispatched' || log.actionType === 'Officer Approval'
                      ? 'bg-blue-50 text-blue-800 border-blue-300'
                      : log.actionType === 'Intervention Recommended'
                      ? 'bg-amber-50 text-amber-800 border-amber-300'
                      : 'bg-slate-100 text-slate-700 border-slate-300'
                  }`}
                >
                  {log.actionType}
                </span>
              </div>

              {/* Description */}
              <div className="flex-1 font-sans text-slate-900">
                <div className="text-xs text-slate-900 font-semibold">{log.details}</div>
                <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                  Audit Ref: {log.auditRef}
                </div>
              </div>

              {/* Actor & Risk */}
              <div className="text-right flex-shrink-0 space-y-1">
                <div className="text-xs text-slate-600 flex items-center justify-end space-x-1 font-sans font-medium">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>{log.actor}</span>
                </div>

                <div className="font-mono font-bold text-xs">
                  {log.afterRisk !== log.beforeRisk ? (
                    <span className="text-emerald-700">
                      {log.beforeRisk}% &rarr; {log.afterRisk}% Risk
                    </span>
                  ) : (
                    <span className="text-slate-700">{log.beforeRisk}% Risk</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
