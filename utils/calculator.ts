import { DrugData, DrugResult, AggregateResults, SavingsResult } from '../types/calculator';

export class SpecialtyRx5RCalculator {
  private drugData: Record<string, DrugData>;

  constructor() {
    this.drugData = {
      'Tysabri': {
        conditions: { 'MS': 0.003, 'Crohns': 0.00305 },
        treatment_prevalence: { 'MS': 0.16, 'Crohns': 0.005 },
        annual_allowed_cost: 100000,
        baseline_tcoc: 4952500,
        baseline_pmpm: 4.13,
        assumptions: {
          unwarranted_initiations: 0.075,
          redirect_rate: 0.10,
          hospital_admin_rate: 0.40,
          shift_to_clinic_rate: 0.50,
          site_savings_per_member: 25000,
          eid_rate: 0.125,
          dose_savings_per_member: 28000,
          discontinue_rate: 0.075,
          duration_savings_per_member: 100000
        }
      },
      'IVIG': {
        conditions: { 'CIDP': 0.001, 'MMN': 0.0005 },
        treatment_prevalence: { 'CIDP': 0.12, 'MMN': 0.08 },
        annual_allowed_cost: 120000,
        baseline_tcoc: 3600000,
        baseline_pmpm: 3.00,
        assumptions: {
          unwarranted_initiations: 0.08,
          redirect_rate: 0.12,
          hospital_admin_rate: 0.35,
          shift_to_clinic_rate: 0.60,
          site_savings_per_member: 30000,
          eid_rate: 0.10,
          dose_savings_per_member: 25000,
          discontinue_rate: 0.08,
          duration_savings_per_member: 90000
        }
      },
      'Remicade': {
        conditions: { 'RA': 0.005, 'IBD': 0.004 },
        treatment_prevalence: { 'RA': 0.18, 'IBD': 0.15 },
        annual_allowed_cost: 85000,
        baseline_tcoc: 5100000,
        baseline_pmpm: 4.25,
        assumptions: {
          unwarranted_initiations: 0.09,
          redirect_rate: 0.11,
          hospital_admin_rate: 0.45,
          shift_to_clinic_rate: 0.55,
          site_savings_per_member: 22000,
          eid_rate: 0.15,
          dose_savings_per_member: 20000,
          discontinue_rate: 0.09,
          duration_savings_per_member: 85000
        }
      },
      'Ocrevus': {
        conditions: { 'MS': 0.003, 'PPMS': 0.0008 },
        treatment_prevalence: { 'MS': 0.20, 'PPMS': 0.12 },
        annual_allowed_cost: 95000,
        baseline_tcoc: 4275000,
        baseline_pmpm: 3.56,
        assumptions: {
          unwarranted_initiations: 0.07,
          redirect_rate: 0.09,
          hospital_admin_rate: 0.38,
          shift_to_clinic_rate: 0.52,
          site_savings_per_member: 27000,
          eid_rate: 0.11,
          dose_savings_per_member: 30000,
          discontinue_rate: 0.07,
          duration_savings_per_member: 95000
        }
      },
      'Entyvio': {
        conditions: { 'UC': 0.002, 'Crohns': 0.00305 },
        treatment_prevalence: { 'UC': 0.14, 'Crohns': 0.12 },
        annual_allowed_cost: 75000,
        baseline_tcoc: 2625000,
        baseline_pmpm: 2.19,
        assumptions: {
          unwarranted_initiations: 0.085,
          redirect_rate: 0.105,
          hospital_admin_rate: 0.42,
          shift_to_clinic_rate: 0.48,
          site_savings_per_member: 20000,
          eid_rate: 0.13,
          dose_savings_per_member: 18000,
          discontinue_rate: 0.085,
          duration_savings_per_member: 75000
        }
      }
    };
  }

  calculateMembersOnDrug(drugName: string, coveredLives: number, lineOfBusiness: string): number {
    const drugInfo = this.drugData[drugName];
    const lobMultiplier = lineOfBusiness === 'Commercial' ? 1.0 : 0.8;
    
    let totalMembers = 0;
    for (const [condition, prevalence] of Object.entries(drugInfo.conditions)) {
      const conditionMembers = coveredLives * (prevalence as number) * lobMultiplier;
      const treatmentPrev = drugInfo.treatment_prevalence[condition];
      totalMembers += conditionMembers * treatmentPrev;
    }
    
    return Math.round(totalMembers);
  }

  calculate5RSavings(drugName: string, coveredLives: number, lineOfBusiness: string): DrugResult {
    const drugInfo = this.drugData[drugName];
    const membersOnDrug = this.calculateMembersOnDrug(drugName, coveredLives, lineOfBusiness);
    const annualCost = drugInfo.annual_allowed_cost;
    const assumptions = drugInfo.assumptions;

    // Calculate 5R savings
    const rightDrugSavings = membersOnDrug * assumptions.unwarranted_initiations * annualCost;
    const rightPatientSavings = membersOnDrug * assumptions.redirect_rate * annualCost;
    
    // Right Site savings
    const hospitalMembers = membersOnDrug * assumptions.hospital_admin_rate;
    const shiftedMembers = hospitalMembers * assumptions.shift_to_clinic_rate;
    const rightSiteSavings = shiftedMembers * assumptions.site_savings_per_member;
    
    // Right Dose savings
    const eidEligibleMembers = membersOnDrug * assumptions.eid_rate;
    const rightDoseSavings = eidEligibleMembers * assumptions.dose_savings_per_member;
    
    // Right Duration savings
    const discontinueEligible = membersOnDrug * assumptions.discontinue_rate;
    const rightDurationSavings = discontinueEligible * assumptions.duration_savings_per_member;
    
    const totalSavings = rightDrugSavings + rightPatientSavings + rightSiteSavings + rightDoseSavings + rightDurationSavings;
    
    // Calculate PMPM values
    const monthlyMembers = coveredLives * 12;
    
    return {
      drug_name: drugName,
      members_on_drug: membersOnDrug,
      baseline_tcoc: drugInfo.baseline_tcoc,
      savings: {
        right_drug: rightDrugSavings,
        right_patient: rightPatientSavings,
        right_site: rightSiteSavings,
        right_dose: rightDoseSavings,
        right_duration: rightDurationSavings,
        total: totalSavings
      },
      pmpm_savings: {
        right_drug: rightDrugSavings / monthlyMembers,
        right_patient: rightPatientSavings / monthlyMembers,
        right_site: rightSiteSavings / monthlyMembers,
        right_dose: rightDoseSavings / monthlyMembers,
        right_duration: rightDurationSavings / monthlyMembers,
        total: totalSavings / monthlyMembers
      },
      tcoc_savings_pct: drugInfo.baseline_tcoc > 0 ? (totalSavings / drugInfo.baseline_tcoc) * 100 : 0
    };
  }

  calculateAggregateSavings(selectedDrugs: string[], coveredLives: number, lineOfBusiness: string): AggregateResults {
    const drugResults: DrugResult[] = [];
    const totalSavings: SavingsResult = {
      right_drug: 0,
      right_patient: 0,
      right_site: 0,
      right_dose: 0,
      right_duration: 0,
      total: 0
    };
    const totalPmpm: SavingsResult = {
      right_drug: 0,
      right_patient: 0,
      right_site: 0,
      right_dose: 0,
      right_duration: 0,
      total: 0
    };
    let totalBaselineTcoc = 0;

    for (const drug of selectedDrugs) {
      const drugResult = this.calculate5RSavings(drug, coveredLives, lineOfBusiness);
      drugResults.push(drugResult);

      // Aggregate totals
      Object.keys(totalSavings).forEach(category => {
        const key = category as keyof SavingsResult;
        totalSavings[key] += drugResult.savings[key];
        totalPmpm[key] += drugResult.pmpm_savings[key];
      });

      totalBaselineTcoc += drugResult.baseline_tcoc;
    }

    const aggregateTcocPct = totalBaselineTcoc > 0 ? (totalSavings.total / totalBaselineTcoc) * 100 : 0;

    return {
      drug_results: drugResults,
      aggregate_savings: totalSavings,
      aggregate_pmpm: totalPmpm,
      aggregate_tcoc_pct: aggregateTcocPct,
      total_baseline_tcoc: totalBaselineTcoc
    };
  }
}