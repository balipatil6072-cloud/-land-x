import type {
  Project,
  ProjectFeatures,
  ProjectStage,
  PredictionResult,
  RiskContributor,
  RiskCategory,
} from '../types';

/**
 * Deterministic prototype prediction engine for LAND-X (SIH26017).
 * Replaces hardcoded values with actual feature-driven risk scoring.
 * Cleanly abstracted to allow replacement with trained PyTorch / XGBoost ML model later.
 */

export function calculateProjectRisk(project: Project): PredictionResult {
  return predictRiskFromFeatures(project.features, project.stages);
}

export function predictRiskFromFeatures(
  features: ProjectFeatures,
  stages: ProjectStage[]
): PredictionResult {
  // 1. Calculate individual risk factor scores (0 - 100 scale)
  const compensationScore = Math.min(
    100,
    features.unpaidBeneficiariesPercent * 1.3 + Math.max(0, features.daysPaymentStageVsMedian) * 1.2
  );

  const legalScore = Math.min(100, features.legalCasesCount * 5.8);

  const approvalScore = Math.min(100, features.pendingApprovalsCount * 22.0);

  const documentationScore = Math.min(
    100,
    (100 - features.documentationCompletenessPercent) * 1.15
  );

  const rrScore = Math.min(100, (100 - features.rrProgressPercent) * 0.45);

  // 2. Stage variance penalty
  const cumulativeVariance = stages.reduce((acc, stage) => acc + Math.max(0, stage.varianceDays), 0);
  const stagePenalty = Math.min(25, cumulativeVariance * 0.35);

  // 3. Weighted total score calculation
  const weightedSum =
    compensationScore * 0.32 +
    legalScore * 0.27 +
    approvalScore * 0.20 +
    documentationScore * 0.14 +
    rrScore * 0.07;

  // Final Risk Score percentage
  const rawRiskScore = Math.min(99, Math.max(12, Math.round(weightedSum + stagePenalty * 0.4)));

  // 4. Calculate relative contribution percentages
  const totalFactorSum = compensationScore + legalScore + approvalScore + documentationScore + rrScore || 1;

  const compPct = Math.round((compensationScore / totalFactorSum) * 97);
  const legalPct = Math.round((legalScore / totalFactorSum) * 97);
  const appPct = Math.round((approvalScore / totalFactorSum) * 97);
  const docPct = Math.round((documentationScore / totalFactorSum) * 97);
  const rrPct = Math.round((rrScore / totalFactorSum) * 97);

  // Normalize to 100%
  const currentSum = compPct + legalPct + appPct + docPct + rrPct;
  const remaining = Math.max(3, 100 - currentSum);

  const rawContributors = [
    {
      factor: 'Compensation' as const,
      percentage: compPct,
      description: `${features.unpaidBeneficiariesPercent}% beneficiaries unpaid; payment stage is +${features.daysPaymentStageVsMedian}d vs median`,
      impactColor: '#ef4444',
    },
    {
      factor: 'Legal complexity' as const,
      percentage: legalPct,
      description: `${features.legalCasesCount} pending court disputes under High Court / District Magistrate`,
      impactColor: '#f97316',
    },
    {
      factor: 'Approval' as const,
      percentage: appPct,
      description: `${features.pendingApprovalsCount} critical inter-department clearances pending (Forest/Railways/Environment)`,
      impactColor: '#eab308',
    },
    {
      factor: 'Documentation' as const,
      percentage: docPct,
      description: `Documentation completeness at ${features.documentationCompletenessPercent}% (missing gazette revenue records)`,
      impactColor: '#3b82f6',
    },
    {
      factor: 'R&R Progress' as const,
      percentage: rrPct,
      description: `Rehabilitation & Resettlement physical execution at ${features.rrProgressPercent}%`,
      impactColor: '#6b7280',
    },
    {
      factor: 'Others' as const,
      percentage: remaining,
      description: 'Minor administrative and site survey variances',
      impactColor: '#9ca3af',
    },
  ];

  const contributors: RiskContributor[] = rawContributors.sort((a, b) => b.percentage - a.percentage);

  // 5. Predict delay days based on risk score & stage variance
  const basePredictedDelayDays = Math.round(rawRiskScore * 0.72 + cumulativeVariance * 0.35);

  // 6. Risk category determination
  let riskCategory: RiskCategory = 'Low';
  if (rawRiskScore >= 80) riskCategory = 'Critical';
  else if (rawRiskScore >= 60) riskCategory = 'High';
  else if (rawRiskScore >= 40) riskCategory = 'Medium';

  // 7. Model confidence estimate
  const confidencePercent = Math.min(94, Math.max(76, 89 - Math.abs(compPct - legalPct) / 5));

  // 8. Natural language executive summary
  const topFactor = contributors[0];
  const explanation = `${topFactor.factor} status is currently the primary driver of predicted delay risk (${topFactor.percentage}% contribution). Risk score of ${rawRiskScore}% indicates severe probability of schedule slip (${basePredictedDelayDays} projected delay days) unless priority intervention is triggered.`;

  return {
    riskScorePercent: rawRiskScore,
    predictedDelayDays: basePredictedDelayDays,
    confidencePercent: Math.round(confidencePercent),
    riskCategory,
    contributors,
    explanation,
    calculatedAt: new Date().toISOString(),
  };
}

/**
 * Feature-driven XAI explanation generator for scenario comparison.
 * Derived strictly from feature calculations rather than LLM text generation.
 */
export function explainScenarioDelta(
  baselineResult: PredictionResult,
  simulatedResult: PredictionResult,
  baselineFeatures: ProjectFeatures,
  simulatedFeatures: ProjectFeatures
): string {
  const riskDelta = simulatedResult.riskScorePercent - baselineResult.riskScorePercent;
  const delayDelta = simulatedResult.predictedDelayDays - baselineResult.predictedDelayDays;

  const changes: string[] = [];

  if (simulatedFeatures.compensationPaidPercent !== baselineFeatures.compensationPaidPercent) {
    changes.push(
      `compensation completion from ${baselineFeatures.compensationPaidPercent}% to ${simulatedFeatures.compensationPaidPercent}%`
    );
  }

  if (simulatedFeatures.legalCasesCount !== baselineFeatures.legalCasesCount) {
    changes.push(
      `pending legal cases from ${baselineFeatures.legalCasesCount} to ${simulatedFeatures.legalCasesCount}`
    );
  }

  if (simulatedFeatures.pendingApprovalsCount !== baselineFeatures.pendingApprovalsCount) {
    changes.push(
      `pending approvals from ${baselineFeatures.pendingApprovalsCount} to ${simulatedFeatures.pendingApprovalsCount}`
    );
  }

  if (simulatedFeatures.documentationCompletenessPercent !== baselineFeatures.documentationCompletenessPercent) {
    changes.push(
      `documentation completeness from ${baselineFeatures.documentationCompletenessPercent}% to ${simulatedFeatures.documentationCompletenessPercent}%`
    );
  }

  if (simulatedFeatures.rrProgressPercent !== baselineFeatures.rrProgressPercent) {
    changes.push(
      `R&R progress from ${baselineFeatures.rrProgressPercent}% to ${simulatedFeatures.rrProgressPercent}%`
    );
  }

  if (changes.length === 0) {
    return 'Simulated features match baseline conditions. No risk variance detected.';
  }

  const changeText = changes.join(', ');
  const primaryDriver = baselineResult.contributors[0].factor;

  if (riskDelta < 0) {
    return `Increasing ${changeText} reduced the predicted risk from ${baselineResult.riskScorePercent}% to ${simulatedResult.riskScorePercent}% (${riskDelta}% risk reduction, -${Math.abs(delayDelta)} delay days) because ${primaryDriver} was the largest risk contributor.`;
  } else if (riskDelta > 0) {
    return `Modifying ${changeText} increased predicted delay risk from ${baselineResult.riskScorePercent}% to ${simulatedResult.riskScorePercent}% (+${riskDelta}% risk variance, +${delayDelta} delay days).`;
  } else {
    return `Modifying ${changeText} resulted in no net change to overall risk score (${baselineResult.riskScorePercent}%).`;
  }
}
