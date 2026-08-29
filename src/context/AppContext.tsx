import React, { createContext, useContext, useState } from 'react';
import type {
  Project,
  ProjectFeatures,
  InterventionRecord,
  InterventionStatus,
  AuditLogEvent,
  StageName,
  EarlyWarningItem,
  EarlyWarningState,
  OutcomeVerification,
} from '../types';
import { MOCK_PROJECTS } from '../data/mockProjects';
import { calculateProjectRisk } from '../services/predictionService';
import { INITIAL_EARLY_WARNINGS } from '../services/warningService';
import { calculateInterventionImpact } from '../services/outcomeService';

interface AppContextType {
  projects: Project[];
  interventions: InterventionRecord[];
  warnings: EarlyWarningItem[];
  auditLogs: AuditLogEvent[];
  addProject: (newProject: Project) => void;
  updateProjectFeatures: (
    projectId: string,
    updatedFeatures: Partial<ProjectFeatures>,
    newStage?: StageName
  ) => void;
  dispatchIntervention: (
    record: Omit<InterventionRecord, 'id' | 'dispatchedAt' | 'status'>
  ) => InterventionRecord;
  updateInterventionStatus: (
    interventionId: string,
    newStatus: InterventionStatus
  ) => void;
  verifyInterventionOutcome: (
    interventionId: string,
    evidenceInput: {
      beneficiariesReviewed: number;
      mismatchesIdentified: number;
      mismatchesResolved: number;
      documentsVerified: number;
      compensationAchievedPct: number;
    }
  ) => OutcomeVerification;
  updateWarningState: (
    warningId: string,
    newState: EarlyWarningState
  ) => void;
  logAuditEvent: (
    event: Omit<AuditLogEvent, 'id' | 'timestamp'>
  ) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Initial demo audit logs
const INITIAL_AUDIT_LOGS: AuditLogEvent[] = [
  {
    id: 'aud-100',
    timestamp: '28 Aug 2026, 11:30:00 AM',
    projectId: 'LA-1842',
    actionType: 'WARNING_CREATED',
    actionName: 'P1 Early Warning Generated',
    actor: 'Early Warning Engine v2.0',
    details: 'Escalation detected: Risk score increased from 71% to 92% (+21 points / 14 days)',
    beforeRisk: 71,
    afterRisk: 92,
  },
  {
    id: 'aud-101',
    timestamp: '14 May 2026, 09:00:00 AM',
    projectId: 'LA-1842',
    actionType: 'PREDICTION_GENERATED',
    actionName: 'Feature Risk Prediction Run',
    actor: 'LAND-X Engine v1.0',
    details: 'Initial predictive feature scoring generated 92% risk score (+74 delay days)',
    beforeRisk: 92,
    afterRisk: 92,
  },
];

// Initial demo interventions
const INITIAL_INTERVENTIONS: InterventionRecord[] = [
  {
    id: 'int-1842-001',
    projectId: 'LA-1842',
    projectName: 'Mumbai-Nagpur Infrastructure Corridor',
    state: 'Maharashtra',
    district: 'Nashik',
    actionName: 'Beneficiary Bank Account Reconciliation & SLAO Verification',
    problemDescription: '38% beneficiary compensation claims unresolved due to bank mismatches.',
    rootCauseDescription: 'Tehsil revenue records name mismatch with Direct Benefit Transfer (DBT) bank accounts.',
    recommendedAction: 'Deploy Special Land Acquisition Officer (SLAO) reconciliation camp at Nashik Tehsil',
    primaryDriver: 'Compensation',
    owner: 'District Land Acquisition Cell',
    priority: 'P1',
    dueDays: 3,
    status: 'Pending',
    dispatchedAt: '28 Aug 2026, 11:35 AM',
    beforeRiskPercent: 92,
    targetFeatureChanges: {
      compensationPaidPercent: 89,
      unpaidBeneficiariesPercent: 11,
      daysPaymentStageVsMedian: 5,
      legalCasesCount: 6,
    },
  },
  {
    id: 'int-1931-001',
    projectId: 'LA-1931',
    projectName: 'Patna Ring Road Project',
    state: 'Bihar',
    district: 'Patna',
    actionName: 'Fast-track Legal Resolution Panel',
    problemDescription: '18 high-priority land title disputes active in High Court.',
    rootCauseDescription: 'Disagreement over agricultural land valuation tariff rates.',
    recommendedAction: 'Convene Lok Adalat bench for out-of-court valuation settlement',
    primaryDriver: 'Legal Dispute',
    owner: 'District LA Cell',
    priority: 'P1',
    dueDays: 5,
    status: 'Assigned',
    dispatchedAt: '27 Aug 2026, 08:30 AM',
    beforeRiskPercent: 88,
    targetFeatureChanges: {
      legalCasesCount: 5,
      compensationPaidPercent: 80,
    },
  },
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
  const [interventions, setInterventions] = useState<InterventionRecord[]>(INITIAL_INTERVENTIONS);
  const [warnings, setWarnings] = useState<EarlyWarningItem[]>(INITIAL_EARLY_WARNINGS);
  const [auditLogs, setAuditLogs] = useState<AuditLogEvent[]>(INITIAL_AUDIT_LOGS);

  const logAuditEvent = (event: Omit<AuditLogEvent, 'id' | 'timestamp'>) => {
    const newLog: AuditLogEvent = {
      ...event,
      id: `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'medium',
      }),
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const addProject = (newProject: Project) => {
    setProjects((prev) => [newProject, ...prev]);

    const risk = calculateProjectRisk(newProject);

    // If project is High or Critical risk, automatically add Early Warning item
    if (risk.riskScorePercent >= 60) {
      const newWarning: EarlyWarningItem = {
        id: `warn-${newProject.id.toLowerCase()}`,
        projectId: newProject.id,
        projectName: newProject.name,
        state: newProject.state,
        district: newProject.district,
        signalType: 'Emerging Risk',
        warningState: 'NEW',
        previousRiskScore: Math.max(10, risk.riskScorePercent - 18),
        currentRiskScore: risk.riskScorePercent,
        riskVelocityPoints: 18,
        riskVelocityDays: 14,
        priorityScore: risk.riskScorePercent,
        priorityLevel: risk.riskScorePercent >= 80 ? 'P1' : 'P2',
        primaryDriver: newProject.recommendedIntervention.primaryDriver,
        evidenceSignals: newProject.evidenceSignals,
        recommendedAction: newProject.recommendedIntervention.recommendedAction,
        expectedRiskAfterIntervention: Math.round(risk.riskScorePercent * 0.65),
        detectedAt: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        historicalTrend: [
          { date: '14 days ago', riskScore: Math.max(10, risk.riskScorePercent - 18) },
          { date: '7 days ago', riskScore: Math.max(15, risk.riskScorePercent - 8) },
          { date: 'Today', riskScore: risk.riskScorePercent },
        ],
        warningTimeline: [
          {
            id: `ev-${Date.now()}`,
            date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
            title: 'Project Initialized & Analyzed',
            description: `LAND-X AI engine completed risk assessment. Score: ${risk.riskScorePercent}% (${risk.riskCategory}).`,
            severity: risk.riskScorePercent >= 80 ? 'critical' : 'high',
          },
        ],
      };
      setWarnings((prev) => [newWarning, ...prev]);
    }

    logAuditEvent({
      projectId: newProject.id,
      actionType: 'PREDICTION_GENERATED',
      actionName: 'New Project Predictive Analysis Run',
      actor: 'LAND-X AI Engine v2.0',
      details: `Project ${newProject.id} (${newProject.name}) initialized. Predicted Risk: ${risk.riskScorePercent}% (${risk.predictedDelayDays} delay days).`,
      beforeRisk: 0,
      afterRisk: risk.riskScorePercent,
    });
  };

  const updateProjectFeatures = (
    projectId: string,
    updatedFeatures: Partial<ProjectFeatures>,
    newStage?: StageName
  ) => {
    setProjects((prevProjects) =>
      prevProjects.map((p) => {
        if (p.id !== projectId) return p;

        const beforeRisk = calculateProjectRisk(p).riskScorePercent;
        const newFeatures = { ...p.features, ...updatedFeatures };
        if (updatedFeatures.compensationPaidPercent !== undefined) {
          newFeatures.unpaidBeneficiariesPercent = Math.max(0, 100 - updatedFeatures.compensationPaidPercent);
        }

        const updatedProject: Project = {
          ...p,
          features: newFeatures,
          currentStage: newStage || p.currentStage,
          lastUpdated: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
        };

        const afterRisk = calculateProjectRisk(updatedProject).riskScorePercent;

        logAuditEvent({
          projectId,
          actionType: 'RISK_RECALCULATED',
          actionName: 'Dynamic Risk Recalculation',
          actor: 'Prediction Engine',
          details: `Project features updated for ${projectId}. Risk recalculated from ${beforeRisk}% to ${afterRisk}%.`,
          beforeRisk,
          afterRisk,
        });

        return updatedProject;
      })
    );
  };

  const updateWarningState = (warningId: string, newState: EarlyWarningState) => {
    setWarnings((prevWarnings) =>
      prevWarnings.map((w) => {
        if (w.id !== warningId) return w;

        logAuditEvent({
          projectId: w.projectId,
          actionType: newState === 'RESOLVED' ? 'WARNING_RESOLVED' : 'WARNING_ACKNOWLEDGED',
          actionName: `Warning Status Transition: ${newState}`,
          actor: 'Admin Officer',
          details: `Early warning ${w.id} state updated from ${w.warningState} to ${newState}.`,
        });

        return { ...w, warningState: newState };
      })
    );
  };

  const dispatchIntervention = (
    record: Omit<InterventionRecord, 'id' | 'dispatchedAt' | 'status'>
  ): InterventionRecord => {
    const newRecord: InterventionRecord = {
      ...record,
      id: `int-${record.projectId.toLowerCase().replace('la-', '')}-${Date.now().toString().slice(-3)}`,
      dispatchedAt: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
      status: 'Pending',
    };

    setInterventions((prev) => [newRecord, ...prev]);

    // Update associated early warning state to 'UNDER ACTION'
    setWarnings((prev) =>
      prev.map((w) => {
        if (w.projectId === record.projectId && w.warningState !== 'RESOLVED') {
          return { ...w, warningState: 'UNDER ACTION' };
        }
        return w;
      })
    );

    logAuditEvent({
      projectId: record.projectId,
      actionType: 'INTERVENTION_DISPATCHED',
      actionName: `Dispatched Intervention: ${record.actionName}`,
      actor: 'Admin Officer',
      details: `Action dispatched to ${record.owner} with Priority ${record.priority}. Baseline risk: ${record.beforeRiskPercent}%.`,
      beforeRisk: record.beforeRiskPercent,
    });

    return newRecord;
  };

  const updateInterventionStatus = (
    interventionId: string,
    newStatus: InterventionStatus
  ) => {
    setInterventions((prevInterventions) =>
      prevInterventions.map((item) => {
        if (item.id !== interventionId) return item;

        const updatedItem = { ...item, status: newStatus };

        logAuditEvent({
          projectId: item.projectId,
          actionType:
            newStatus === 'Completed'
              ? 'OUTCOME_VERIFIED'
              : newStatus === 'In Progress'
              ? 'INTERVENTION_STARTED'
              : 'INTERVENTION_RECOMMENDED',
          actionName: `Intervention ${newStatus}: ${item.actionName}`,
          actor: 'District LA Cell',
          details: `Intervention status moved to ${newStatus} for task ${item.id}.`,
        });

        return updatedItem;
      })
    );
  };

  const verifyInterventionOutcome = (
    interventionId: string,
    evidenceInput: {
      beneficiariesReviewed: number;
      mismatchesIdentified: number;
      mismatchesResolved: number;
      documentsVerified: number;
      compensationAchievedPct: number;
    }
  ): OutcomeVerification => {
    const item = interventions.find((i) => i.id === interventionId);
    const targetProjectId = item ? item.projectId : 'LA-1842';
    const beforeRisk = item ? item.beforeRiskPercent : 92;

    const targetChanges: Partial<ProjectFeatures> = item?.targetFeatureChanges || {
      compensationPaidPercent: evidenceInput.compensationAchievedPct,
      unpaidBeneficiariesPercent: 100 - evidenceInput.compensationAchievedPct,
      daysPaymentStageVsMedian: 5,
      legalCasesCount: 6,
    };

    // 1. Update Project features in state
    updateProjectFeatures(targetProjectId, targetChanges);

    // 2. Compute recalculated after risk
    const targetProject = projects.find((p) => p.id === targetProjectId);
    const recalculatedAfterRisk = targetProject
      ? calculateProjectRisk({
          ...targetProject,
          features: { ...targetProject.features, ...targetChanges },
        }).riskScorePercent
      : 65;

    // 3. Compute Outcome Impact Metrics (Observed vs Predicted)
    const outcome = calculateInterventionImpact(
      beforeRisk,
      recalculatedAfterRisk,
      item ? item.beforeRiskPercent - 27 : 65,
      evidenceInput
    );

    // 4. Update Intervention record with completed status and outcome verification
    setInterventions((prev) =>
      prev.map((i) => {
        if (i.id === interventionId) {
          return {
            ...i,
            status: 'Completed',
            completedAt: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
            afterRiskPercent: recalculatedAfterRisk,
            outcomeVerification: outcome,
          };
        }
        return i;
      })
    );

    // 5. CLOSED-LOOP RESOLUTION: Update Warning state to RESOLVED if risk drops!
    setWarnings((prevWarnings) =>
      prevWarnings.map((w) => {
        if (w.projectId === targetProjectId) {
          return {
            ...w,
            previousRiskScore: w.currentRiskScore,
            currentRiskScore: recalculatedAfterRisk,
            warningState: recalculatedAfterRisk < 75 ? 'RESOLVED' : 'MITIGATED',
          };
        }
        return w;
      })
    );

    // 6. Log Immutable Audit Events
    logAuditEvent({
      projectId: targetProjectId,
      actionType: 'EVIDENCE_SUBMITTED',
      actionName: 'Synthetic Verification Evidence Submitted',
      actor: 'District LA Cell',
      details: `Submitted evidence: ${evidenceInput.beneficiariesReviewed} reviewed, ${evidenceInput.mismatchesResolved} bank mismatches resolved.`,
    });

    logAuditEvent({
      projectId: targetProjectId,
      actionType: 'OUTCOME_VERIFIED',
      actionName: 'Outcome Impact Verification',
      actor: 'LAND-X Decision Engine',
      details: `Verified outcome: Expected reduction -27% vs Observed -${outcome.observedRiskReduction}%. Intervention Effectiveness: ${outcome.effectivenessPercent}%.`,
      beforeRisk,
      afterRisk: recalculatedAfterRisk,
    });

    logAuditEvent({
      projectId: targetProjectId,
      actionType: 'WARNING_RESOLVED',
      actionName: 'Closed-Loop Warning Resolution',
      actor: 'Early Warning Engine',
      details: `Early warning for ${targetProjectId} marked RESOLVED as risk score dropped below threshold (${beforeRisk}% -> ${recalculatedAfterRisk}%).`,
      beforeRisk,
      afterRisk: recalculatedAfterRisk,
    });

    return outcome;
  };

  return (
    <AppContext.Provider
      value={{
        projects,
        interventions,
        warnings,
        auditLogs,
        addProject,
        updateProjectFeatures,
        dispatchIntervention,
        updateInterventionStatus,
        verifyInterventionOutcome,
        updateWarningState,
        logAuditEvent,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
