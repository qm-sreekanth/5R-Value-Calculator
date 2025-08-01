export interface DrugData {
  conditions: Record<string, number>;
  treatment_prevalence: Record<string, number>;
  annual_allowed_cost: number;
  baseline_tcoc: number;
  baseline_pmpm: number;
  assumptions: {
    unwarranted_initiations: number;
    redirect_rate: number;
    hospital_admin_rate: number;
    shift_to_clinic_rate: number;
    site_savings_per_member: number;
    eid_rate: number;
    dose_savings_per_member: number;
    discontinue_rate: number;
    duration_savings_per_member: number;
  };
}

export interface SavingsResult {
  right_drug: number;
  right_patient: number;
  right_site: number;
  right_dose: number;
  right_duration: number;
  total: number;
}

export interface DrugResult {
  drug_name: string;
  members_on_drug: number;
  baseline_tcoc: number;
  savings: SavingsResult;
  pmpm_savings: SavingsResult;
  tcoc_savings_pct: number;
}

export interface AggregateResults {
  drug_results: DrugResult[];
  aggregate_savings: SavingsResult;
  aggregate_pmpm: SavingsResult;
  aggregate_tcoc_pct: number;
  total_baseline_tcoc: number;
}

export interface CalculatorInputs {
  covered_lives: number;
  line_of_business: 'Commercial' | 'Medicare';
  selected_drugs: string[];
  ms_prevalence: number;
  crohns_prevalence: number;
  ms_treatment_prevalence: number;
  crohns_treatment_prevalence: number;
  annual_allowed_cost: number;
}