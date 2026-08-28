export type RiskCategory = 'Critical' | 'High' | 'Medium' | 'Low';

export type StageName =
  | 'Notification'
  | 'SIA'
  | 'Declaration'
  | 'Award'
  | 'Compensation'
  | 'Possession'
  | 'R&R';

export type ProjectType =
  | 'Infrastructure'
  | 'Expressway'
  | 'Railways'
  | 'Industrial'
  | 'Urban Infrastructure'
  | 'Energy';

export interface ProjectStage {
  id: string;
  name: StageName;
  expectedDays: number;
  actualDays: number;
  varianceDays: number; // actual - expected
  status: 'Completed' | 'Delayed' | 'In Progress' | 'Pending';
  completedDate?: string;
  notes?: string;
}

export interface ProjectFeatures {
  compensationPaidPercent: number; // e.g. 62%
  unpaidBeneficiariesPercent: number; // e.g. 38%
  legalCasesCount: number; // e.g. 14 pending cases
  pendingApprovalsCount: number; // e.g. 3 pending clearances
  documentationCompletenessPercent: number; // e.g. 71%
  rrProgressPercent: number; // e.g. 43%
  daysPaymentStageVsMedian: number; // e.g. +21 days
}

export interface RecommendedIntervention {
  id: string;
  actionName: string;
  recommendedAction: string;
  primaryDriver: string;
  owner: string;
  dueDays: number;
  priority: 'P1' | 'P2' | 'P3';
  status: 'Open' | 'In Progress' | 'Resolved';
}

export interface Project {
  id: string; // e.g. "LA-1842"
  name: string;
  state: string;
  district: string;
  agency: string;
  projectType: ProjectType;
  landAreaHa: number;
  affectedFamilies: number;
  villagesCount: number;
  currentStage: StageName;
  stageProgressPercent: number;
  lat: number;
  lng: number;
  lastUpdated: string;
  features: ProjectFeatures;
  stages: ProjectStage[];
  evidenceSignals: string[];
  recommendedIntervention: RecommendedIntervention;
  isSyntheticDemo: boolean;
}

export interface RiskContributor {
  factor: 'Compensation' | 'Legal complexity' | 'Approval' | 'Documentation' | 'R&R Progress' | 'Others';
  percentage: number;
  description: string;
  impactColor: string;
}

export interface PredictionResult {
  riskScorePercent: number; // 0 - 100
  predictedDelayDays: number;
  confidencePercent: number;
  riskCategory: RiskCategory;
  contributors: RiskContributor[];
  explanation: string;
  calculatedAt: string;
}

export interface StateMetrics {
  state: string;
  projectCount: number;
  criticalCount: number;
  highCount: number;
  avgDelayDays: number;
  riskPercentage: number;
}

export type InterventionStatus = 'Pending' | 'Assigned' | 'In Progress' | 'Completed';

export interface OutcomeVerification {
  beneficiariesReviewed: number;
  mismatchesIdentified: number;
  mismatchesResolved: number;
  documentsVerified: number;
  compensationAchievedPct: number;
  expectedRiskReduction: number;
  observedRiskReduction: number;
  effectivenessPercent: number; // (observed / expected) * 100
  verifiedAt: string;
}

export interface InterventionRecord {
  id: string;
  projectId: string;
  projectName: string;
  state: string;
  district: string;
  actionName: string;
  problemDescription?: string;
  rootCauseDescription?: string;
  recommendedAction: string;
  primaryDriver: string;
  owner: string;
  priority: 'P1' | 'P2' | 'P3';
  dueDays: number;
  status: InterventionStatus;
  dispatchedAt: string;
  assignedAt?: string;
  startedAt?: string;
  completedAt?: string;
  beforeRiskPercent: number;
  afterRiskPercent?: number;
  targetFeatureChanges?: Partial<ProjectFeatures>;
  outcomeVerification?: OutcomeVerification;
  notes?: string;
}

export type EarlyWarningSignalType =
  | 'Risk Escalation'
  | 'Stage Overrun'
  | 'Evidence Deterioration'
  | 'Threshold Breach'
  | 'Intervention Failure'
  | 'Emerging Risk';

export type EarlyWarningState =
  | 'NEW'
  | 'ACKNOWLEDGED'
  | 'UNDER ACTION'
  | 'MITIGATED'
  | 'RESOLVED'
  | 'REOPENED';

export interface WarningTimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'info';
}

export interface EarlyWarningItem {
  id: string;
  projectId: string;
  projectName: string;
  state: string;
  district: string;
  signalType: EarlyWarningSignalType;
  warningState: EarlyWarningState;
  previousRiskScore: number;
  currentRiskScore: number;
  riskVelocityPoints: number; // e.g. +21 points
  riskVelocityDays: number; // e.g. in 14 days
  priorityScore: number; // 0 - 100 computed formula
  priorityLevel: 'P1' | 'P2' | 'P3';
  primaryDriver: string;
  evidenceSignals: string[];
  recommendedAction: string;
  expectedRiskAfterIntervention: number;
  detectedAt: string;
  historicalTrend: Array<{ date: string; riskScore: number }>;
  warningTimeline: WarningTimelineEvent[];
}

export type AuditActionType =
  | 'PREDICTION_GENERATED'
  | 'SCENARIO_CREATED'
  | 'WARNING_CREATED'
  | 'WARNING_ACKNOWLEDGED'
  | 'INTERVENTION_RECOMMENDED'
  | 'INTERVENTION_DISPATCHED'
  | 'INTERVENTION_STARTED'
  | 'INTERVENTION_COMPLETED'
  | 'EVIDENCE_SUBMITTED'
  | 'OUTCOME_VERIFIED'
  | 'RISK_RECALCULATED'
  | 'WARNING_RESOLVED';

export interface AuditLogEvent {
  id: string;
  timestamp: string;
  projectId: string;
  actionType: AuditActionType;
  actionName: string;
  actor: string;
  details: string;
  beforeRisk?: number;
  afterRisk?: number;
}
