import type { EarlyWarningItem } from '../types';

/**
 * Calculates Early Warning Priority Score (0 - 100) using a multi-factor formula:
 * Priority Score = (Risk Severity * 0.35) + (Risk Velocity * 0.30) + (Delay Score * 0.20) + (Driver Weight * 0.15)
 */
export function calculatePriorityScore(
  currentRiskScore: number,
  velocityPoints: number,
  velocityDays: number,
  predictedDelayDays: number,
  primaryDriver: string
): { priorityScore: number; priorityLevel: 'P1' | 'P2' | 'P3' } {
  const riskSeverityScore = currentRiskScore;
  const velocityRate = Math.min(100, (velocityPoints / Math.max(1, velocityDays)) * 40);
  const delayScore = Math.min(100, predictedDelayDays * 1.1);

  let driverWeight = 70;
  if (primaryDriver === 'Compensation') driverWeight = 95;
  else if (primaryDriver === 'Legal complexity' || primaryDriver === 'Legal Dispute') driverWeight = 90;
  else if (primaryDriver === 'Approval') driverWeight = 85;

  const score = Math.min(
    99,
    Math.max(
      15,
      Math.round(
        riskSeverityScore * 0.35 +
          velocityRate * 0.30 +
          delayScore * 0.20 +
          driverWeight * 0.15
      )
    )
  );

  let priorityLevel: 'P1' | 'P2' | 'P3' = 'P3';
  if (score >= 80) priorityLevel = 'P1';
  else if (score >= 60) priorityLevel = 'P2';

  return { priorityScore: score, priorityLevel };
}

/**
 * Initial Early Warnings dataset populated with historical escalation trends.
 */
export const INITIAL_EARLY_WARNINGS: EarlyWarningItem[] = [
  {
    id: 'WARN-1842-01',
    projectId: 'LA-1842',
    projectName: 'Mumbai-Nagpur Infrastructure Corridor',
    state: 'Maharashtra',
    district: 'Nashik',
    signalType: 'Risk Escalation',
    warningState: 'NEW',
    previousRiskScore: 71,
    currentRiskScore: 92,
    riskVelocityPoints: 21,
    riskVelocityDays: 14,
    priorityScore: 96,
    priorityLevel: 'P1',
    primaryDriver: 'Compensation',
    evidenceSignals: [
      '38% beneficiaries unpaid due to bank account mismatch in 4 sub-districts',
      '14 legal court injunction cases pending in Nashik District Magistrate Court',
      'Compensation disbursement stage delayed by +21 days vs state median',
      'Documentation completeness dropped from 84% to 71% in 14 days',
    ],
    recommendedAction: 'Deploy Special Land Acquisition Officer (SLAO) bank reconciliation camp at Nashik Tehsil',
    expectedRiskAfterIntervention: 65,
    detectedAt: '28 Aug 2026, 11:30 AM',
    historicalTrend: [
      { date: '14 Aug', riskScore: 71 },
      { date: '18 Aug', riskScore: 76 },
      { date: '21 Aug', riskScore: 81 },
      { date: '24 Aug', riskScore: 87 },
      { date: '28 Aug', riskScore: 92 },
    ],
    warningTimeline: [
      { id: 'wt-1', date: '14 Aug 2026', title: 'Documentation completeness dropped', description: 'Revenue survey 7A completeness dropped 84% -> 78%', severity: 'medium' },
      { id: 'wt-2', date: '18 Aug 2026', title: 'Compensation payment backlog spike', description: 'Unpaid beneficiaries reached 38% across Nashik tehsil', severity: 'high' },
      { id: 'wt-3', date: '21 Aug 2026', title: 'Threshold Breach (Risk > 80%)', description: 'Predicted delay risk crossed critical 80% threshold', severity: 'critical' },
      { id: 'wt-4', date: '24 Aug 2026', title: 'Legal Court Case Escalation', description: '14 pending court injunction stay orders filed', severity: 'critical' },
      { id: 'wt-5', date: '28 Aug 2026', title: 'CRITICAL EARLY WARNING GENERATED', description: 'LAND-X Engine generated P1 Immediate Risk Escalation warning', severity: 'critical' },
    ],
  },
  {
    id: 'WARN-1931-01',
    projectId: 'LA-1931',
    projectName: 'Patna Ring Road Project',
    state: 'Bihar',
    district: 'Patna',
    signalType: 'Risk Escalation',
    warningState: 'NEW',
    previousRiskScore: 74,
    currentRiskScore: 88,
    riskVelocityPoints: 14,
    riskVelocityDays: 21,
    priorityScore: 89,
    priorityLevel: 'P1',
    primaryDriver: 'Legal Dispute',
    evidenceSignals: [
      '18 land title dispute petitions active in Patna High Court',
      '52% affected landowners rejected initial valuation award rate',
      'Award stage delayed by +25 days vs statutory threshold',
    ],
    recommendedAction: 'Convene Lok Adalat bench for out-of-court valuation settlement',
    expectedRiskAfterIntervention: 64,
    detectedAt: '27 Aug 2026, 09:15 AM',
    historicalTrend: [
      { date: '07 Aug', riskScore: 74 },
      { date: '14 Aug', riskScore: 79 },
      { date: '21 Aug', riskScore: 83 },
      { date: '27 Aug', riskScore: 88 },
    ],
    warningTimeline: [
      { id: 'wt-19-1', date: '07 Aug 2026', title: 'Valuation Award Rejection', description: '52% landowners rejected award tariff rate', severity: 'high' },
      { id: 'wt-19-2', date: '14 Aug 2026', title: 'High Court Writ Filing', description: '18 title dispute cases submitted in Patna High Court', severity: 'critical' },
      { id: 'wt-19-3', date: '27 Aug 2026', title: 'HIGH WARNING GENERATED', description: 'LAND-X Engine generated P1 Legal Dispute warning', severity: 'critical' },
    ],
  },
  {
    id: 'WARN-2077-01',
    projectId: 'LA-2077',
    projectName: 'Bundelkhand Expressway Expansion',
    state: 'Uttar Pradesh',
    district: 'Jhansi',
    signalType: 'Evidence Deterioration',
    warningState: 'ACKNOWLEDGED',
    previousRiskScore: 73,
    currentRiskScore: 84,
    riskVelocityPoints: 11,
    riskVelocityDays: 18,
    priorityScore: 82,
    priorityLevel: 'P2',
    primaryDriver: 'Documentation',
    evidenceSignals: [
      'Gazette notification missing revenue boundary maps for 12 villages',
      'Documentation completeness dropped to 58%',
      '4 pending forest land diversion clearances at MoEFCC',
    ],
    recommendedAction: 'Upload verified Khasra/Khatauni GIS shapefiles to state portal',
    expectedRiskAfterIntervention: 60,
    detectedAt: '26 Aug 2026, 04:30 PM',
    historicalTrend: [
      { date: '08 Aug', riskScore: 73 },
      { date: '16 Aug', riskScore: 78 },
      { date: '26 Aug', riskScore: 84 },
    ],
    warningTimeline: [
      { id: 'wt-20-1', date: '08 Aug 2026', title: 'Boundary Map Discrepancy', description: '12 village boundary maps flagged mismatched', severity: 'medium' },
      { id: 'wt-20-2', date: '26 Aug 2026', title: 'WARNING ACKNOWLEDGED', description: 'Project Authority acknowledged documentation warning', severity: 'high' },
    ],
  },
  {
    id: 'WARN-2144-01',
    projectId: 'LA-2144',
    projectName: 'Mahanadi Rail Line Expansion',
    state: 'Odisha',
    district: 'Cuttack',
    signalType: 'Stage Overrun',
    warningState: 'NEW',
    previousRiskScore: 72,
    currentRiskScore: 81,
    riskVelocityPoints: 9,
    riskVelocityDays: 15,
    priorityScore: 78,
    priorityLevel: 'P2',
    primaryDriver: 'Approval',
    evidenceSignals: [
      'Social Impact Assessment (SIA) stage exceeded threshold by +28 days',
      'Coastal Regulation Zone (CRZ) clearance pending with SEIAA',
    ],
    recommendedAction: 'Submit compensatory afforestation land allocation certificate to SEIAA',
    expectedRiskAfterIntervention: 58,
    detectedAt: '28 Aug 2026, 08:00 AM',
    historicalTrend: [
      { date: '13 Aug', riskScore: 72 },
      { date: '20 Aug', riskScore: 76 },
      { date: '28 Aug', riskScore: 81 },
    ],
    warningTimeline: [
      { id: 'wt-21-1', date: '13 Aug 2026', title: 'SIA Stage Overrun', description: 'SIA completed in 118 days vs 90 days expected (+28d variance)', severity: 'high' },
      { id: 'wt-21-2', date: '28 Aug 2026', title: 'WARNING DETECTED', description: 'Stage overrun warning generated', severity: 'medium' },
    ],
  },
  {
    id: 'WARN-2188-01',
    projectId: 'LA-2188',
    projectName: 'Karnataka Rural Industrial Corridor',
    state: 'Karnataka',
    district: 'Mandya',
    signalType: 'Threshold Breach',
    warningState: 'NEW',
    previousRiskScore: 70,
    currentRiskScore: 79,
    riskVelocityPoints: 9,
    riskVelocityDays: 20,
    priorityScore: 74,
    priorityLevel: 'P3',
    primaryDriver: 'R&R Progress',
    evidenceSignals: [
      'R&R housing colony civil construction lagging at 28%',
      'Land possession stage delayed by +32 days',
    ],
    recommendedAction: 'Issue priority tender for R&R colony water and electricity utilities',
    expectedRiskAfterIntervention: 56,
    detectedAt: '25 Aug 2026, 02:15 PM',
    historicalTrend: [
      { date: '05 Aug', riskScore: 70 },
      { date: '15 Aug', riskScore: 74 },
      { date: '25 Aug', riskScore: 79 },
    ],
    warningTimeline: [
      { id: 'wt-22-1', date: '05 Aug 2026', title: 'R&R Construction Delay', description: 'Rehabilitation housing physical execution at 28%', severity: 'medium' },
    ],
  },
];
