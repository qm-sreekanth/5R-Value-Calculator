import { useState } from 'react';
import { CalculatorInputs } from '../types/calculator';

interface CalculatorFormProps {
  onCalculate: (inputs: CalculatorInputs) => void;
  loading?: boolean;
}

const AVAILABLE_DRUGS = ['IVIG', 'Tysabri', 'Remicade', 'Ocrevus', 'Entyvio'];

export default function CalculatorForm({ onCalculate, loading = false }: CalculatorFormProps) {
  // Basic inputs
  const [clientName, setClientName] = useState<string>('');
  const [coveredLives, setCoveredLives] = useState<number>(100000);
  const [lineOfBusiness, setLineOfBusiness] = useState<'Commercial' | 'Medicare'>('Commercial');
  const [selectedDrugs, setSelectedDrugs] = useState<string[]>(['Tysabri']);
  
  // Prevalence inputs
  const [msPrevalence, setMsPrevalence] = useState<number>(0.3);
  const [crohnsPrevalence, setCrohnsPrevalence] = useState<number>(0.305);
  const [msTreatmentPrevalence, setMsTreatmentPrevalence] = useState<number>(16.0);
  const [crohnsTreatmentPrevalence, setCrohnsTreatmentPrevalence] = useState<number>(0.5);
  
  // Cost inputs
  const [membersOnDrug, setMembersOnDrug] = useState<number>(50);
  const [annualAllowedCost, setAnnualAllowedCost] = useState<number>(100000);
  const [baselineTCoC, setBaselineTCoC] = useState<number>(4952500);
  const [baselinePMPM, setBaselinePMPM] = useState<number>(4.13);
  
  // 5R Strategy inputs
  const [unwarrantedInitiationRate, setUnwarrantedInitiationRate] = useState<number>(7.5);
  const [redirectRate, setRedirectRate] = useState<number>(10);
  const [hospitalAdminPercent, setHospitalAdminPercent] = useState<number>(40);
  const [shiftToClinicPercent, setShiftToClinicPercent] = useState<number>(50);
  const [siteRightSavingsPerMember, setSiteRightSavingsPerMember] = useState<number>(25000);
  const [eidRate, setEidRate] = useState<number>(12.5);
  const [doseRightSavingsPerMember, setDoseRightSavingsPerMember] = useState<number>(28000);
  const [discontinueRate, setDiscontinueRate] = useState<number>(7.5);
  const [durationRightSavingsPerMember, setDurationRightSavingsPerMember] = useState<number>(100000);
  
  // Options
  const [includeBaseline, setIncludeBaseline] = useState<boolean>(true);

  const handleDrugToggle = (drug: string) => {
    setSelectedDrugs(prev => 
      prev.includes(drug) 
        ? prev.filter(d => d !== drug)
        : [...prev, drug]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCalculate({
      client_name: clientName,
      covered_lives: coveredLives,
      line_of_business: lineOfBusiness,
      selected_drugs: selectedDrugs,
      ms_prevalence: msPrevalence,
      crohns_prevalence: crohnsPrevalence,
      ms_treatment_prevalence: msTreatmentPrevalence,
      crohns_treatment_prevalence: crohnsTreatmentPrevalence,
      members_on_drug: membersOnDrug,
      annual_allowed_cost: annualAllowedCost,
      baseline_tcoc: baselineTCoC,
      baseline_pmpm: baselinePMPM,
      unwarranted_initiation_rate: unwarrantedInitiationRate,
      redirect_rate: redirectRate,
      hospital_admin_percent: hospitalAdminPercent,
      shift_to_clinic_percent: shiftToClinicPercent,
      site_savings_per_member: siteRightSavingsPerMember,
      eid_rate: eidRate,
      dose_savings_per_member: doseRightSavingsPerMember,
      discontinue_rate: discontinueRate,
      duration_savings_per_member: durationRightSavingsPerMember,
      include_baseline: includeBaseline
    });
  };

  return (
    <div className="card p-6">
      <h2 className="text-xl font-semibold mb-6 text-gray-800">Client Information</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Client Name */}
        <div>
          <label className="label">Client Name (Optional)</label>
          <input
            type="text"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            className="input-field"
            placeholder="Enter client name"
          />
        </div>

        {/* Covered Lives */}
        <div>
          <label className="label">Covered Lives</label>
          <input
            type="number"
            value={coveredLives}
            onChange={(e) => setCoveredLives(Number(e.target.value))}
            className="input-field"
            placeholder="Enter covered lives"
          />
          <p className="text-sm text-gray-500 mt-1">Total number of covered members</p>
        </div>

        {/* Line of Business */}
        <div>
          <label className="label">Line of Business</label>
          <select
            value={lineOfBusiness}
            onChange={(e) => setLineOfBusiness(e.target.value as 'Commercial' | 'Medicare')}
            className="input-field"
          >
            <option value="Commercial">Commercial</option>
            <option value="Medicare">Medicare</option>
          </select>
        </div>

        {/* Condition Prevalence Section */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-800">Condition Prevalence</h3>
          <div>
            <label className="label">MS Prevalence (%)</label>
            <input
              type="number"
              value={msPrevalence}
              onChange={e => setMsPrevalence(Number(e.target.value))}
              className="input-field"
              placeholder="Enter MS prevalence %"
            />
          </div>
          <div>
            <label className="label">Crohn's Prevalence (%)</label>
            <input
              type="number"
              value={crohnsPrevalence}
              onChange={e => setCrohnsPrevalence(Number(e.target.value))}
              className="input-field"
              placeholder="Enter Crohn's prevalence %"
            />
          </div>
        </div>

        {/* Treatment Prevalence Section */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-800">Treatment Prevalence</h3>
          <div>
            <label className="label">MS Treatment Prevalence (%)</label>
            <input
              type="number"
              value={msTreatmentPrevalence}
              onChange={e => setMsTreatmentPrevalence(Number(e.target.value))}
              className="input-field"
              placeholder="Enter MS treatment prevalence %"
            />
          </div>
          <div>
            <label className="label">Crohn's Treatment Prevalence (%)</label>
            <input
              type="number"
              value={crohnsTreatmentPrevalence}
              onChange={e => setCrohnsTreatmentPrevalence(Number(e.target.value))}
              className="input-field"
              placeholder="Enter Crohn's treatment prevalence %"
            />
          </div>
        </div>

        {/* Cost Inputs */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-800">Cost Parameters</h3>
          <div>
            <label className="label">Members on Drug</label>
            <input
              type="number"
              value={membersOnDrug}
              onChange={e => setMembersOnDrug(Number(e.target.value))}
              className="input-field"
              placeholder="Enter members on drug"
            />
          </div>
          <div>
            <label className="label">Annual Allowed Cost per Member ($)</label>
            <input
              type="number"
              value={annualAllowedCost}
              onChange={e => setAnnualAllowedCost(Number(e.target.value))}
              className="input-field"
              placeholder="Enter annual allowed cost"
            />
          </div>
          <div>
            <label className="label">Baseline TCoC ($)</label>
            <input
              type="number"
              value={baselineTCoC}
              onChange={e => setBaselineTCoC(Number(e.target.value))}
              className="input-field"
              placeholder="Enter baseline total cost of care"
            />
          </div>
          <div>
            <label className="label">Baseline PMPM ($)</label>
            <input
              type="number"
              value={baselinePMPM}
              onChange={e => setBaselinePMPM(Number(e.target.value))}
              className="input-field"
              placeholder="Enter baseline PMPM"
            />
          </div>
        </div>

        {/* 5R Strategy Parameters */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-800">5R Strategy Parameters</h3>
          
          {/* Right Drug */}
          <div>
            <label className="label">Unwarranted Initiation Rate - Right Drug (%)</label>
            <input
              type="number"
              value={unwarrantedInitiationRate}
              onChange={e => setUnwarrantedInitiationRate(Number(e.target.value))}
              className="input-field"
              placeholder="Enter unwarranted initiation rate"
            />
          </div>

          {/* Right Patient */}
          <div>
            <label className="label">Redirect Rate - Right Patient (%)</label>
            <input
              type="number"
              value={redirectRate}
              onChange={e => setRedirectRate(Number(e.target.value))}
              className="input-field"
              placeholder="Enter redirect rate"
            />
          </div>

          {/* Right Site */}
          <div>
            <label className="label">Hospital Admin % - Right Site (%)</label>
            <input
              type="number"
              value={hospitalAdminPercent}
              onChange={e => setHospitalAdminPercent(Number(e.target.value))}
              className="input-field"
              placeholder="Enter hospital admin percentage"
            />
          </div>
          <div>
            <label className="label">Shift to Clinic % - Right Site (%)</label>
            <input
              type="number"
              value={shiftToClinicPercent}
              onChange={e => setShiftToClinicPercent(Number(e.target.value))}
              className="input-field"
              placeholder="Enter shift to clinic percentage"
            />
          </div>
          <div>
            <label className="label">Savings per Member - Right Site ($)</label>
            <input
              type="number"
              value={siteRightSavingsPerMember}
              onChange={e => setSiteRightSavingsPerMember(Number(e.target.value))}
              className="input-field"
              placeholder="Enter savings per member for site"
            />
          </div>

          {/* Right Dose */}
          <div>
            <label className="label">EID Rate - Right Dose (%)</label>
            <input
              type="number"
              value={eidRate}
              onChange={e => setEidRate(Number(e.target.value))}
              className="input-field"
              placeholder="Enter EID rate"
            />
          </div>
          <div>
            <label className="label">Savings per Member - Right Dose ($)</label>
            <input
              type="number"
              value={doseRightSavingsPerMember}
              onChange={e => setDoseRightSavingsPerMember(Number(e.target.value))}
              className="input-field"
              placeholder="Enter savings per member for dose"
            />
          </div>

          {/* Right Duration */}
          <div>
            <label className="label">Discontinue Rate - Right Duration (%)</label>
            <input
              type="number"
              value={discontinueRate}
              onChange={e => setDiscontinueRate(Number(e.target.value))}
              className="input-field"
              placeholder="Enter discontinue rate"
            />
          </div>
          <div>
            <label className="label">Savings per Member - Right Duration ($)</label>
            <input
              type="number"
              value={durationRightSavingsPerMember}
              onChange={e => setDurationRightSavingsPerMember(Number(e.target.value))}
              className="input-field"
              placeholder="Enter savings per member for duration"
            />
          </div>
        </div>
 {/* Drug Selection */}
        <div>
          <label className="label">Target Drugs</label>
          <p className="text-sm text-gray-600 mb-3">Select medical benefit drugs for analysis:</p>
          
          <div className="space-y-2">
            {AVAILABLE_DRUGS.map((drug) => (
              <label key={drug} className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedDrugs.includes(drug)}
                  onChange={() => handleDrugToggle(drug)}
                  className="mr-3 h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <span className="text-sm font-medium text-gray-700">{drug}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Include Baseline */}
        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={includeBaseline}
              onChange={(e) => setIncludeBaseline(e.target.checked)}
              className="mr-3 h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <span className="text-sm font-medium text-gray-700">Include Baseline Values</span>
          </label>
          <p className="text-sm text-gray-500 mt-1">Include baseline calculations in results</p>
        </div>

        {/* Calculate Button */}
        <button
          type="submit"
          disabled={loading || selectedDrugs.length === 0}
          className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors duration-200 ${
            loading || selectedDrugs.length === 0
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'btn-primary'
          }`}
        >
          {loading ? 'Calculating...' : '🧮 Calculate 5R Savings'}
        </button>
      </form>
    </div>
  );
}