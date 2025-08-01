import { AggregateResults } from '../types/calculator';
import { formatCurrency, formatPMPM, formatPercentage } from '../utils/formatters';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ResultsDisplayProps {
  results: AggregateResults;
  coveredLives: number;
}

const COLORS = {
  'Right Drug': '#1f77b4',
  'Right Patient': '#2ca02c', 
  'Right Site': '#ff7f0e',
  'Right Dose': '#d62728',
  'Right Duration': '#9467bd'
};

export default function ResultsDisplay({ results, coveredLives }: ResultsDisplayProps) {
  const { aggregate_savings, aggregate_pmpm, aggregate_tcoc_pct, drug_results } = results;

  // Prepare chart data
  const pieData = [
    { name: 'Right Drug', value: aggregate_savings.right_drug, color: COLORS['Right Drug'] },
    { name: 'Right Patient', value: aggregate_savings.right_patient, color: COLORS['Right Patient'] },
    { name: 'Right Site', value: aggregate_savings.right_site, color: COLORS['Right Site'] },
    { name: 'Right Dose', value: aggregate_savings.right_dose, color: COLORS['Right Dose'] },
    { name: 'Right Duration', value: aggregate_savings.right_duration, color: COLORS['Right Duration'] }
  ].filter(item => item.value > 0);

  const barData = drug_results.map(drug => ({
    name: drug.drug_name,
    'Right Drug': drug.savings.right_drug,
    'Right Patient': drug.savings.right_patient,
    'Right Site': drug.savings.right_site,
    'Right Dose': drug.savings.right_dose,
    'Right Duration': drug.savings.right_duration
  }));

  return (
    <div className="space-y-8">
      {/* Summary Metrics */}
      <div className="card p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Results Summary</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">
              {formatCurrency(aggregate_savings.total)}
            </div>
            <div className="text-sm text-gray-600 mt-1">Total Savings</div>
            <div className="text-xs text-gray-500">Annual savings across all drugs</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-secondary">
              {formatPMPM(aggregate_pmpm.total)}
            </div>
            <div className="text-sm text-gray-600 mt-1">Total PMPM</div>
            <div className="text-xs text-gray-500">Per Member Per Month savings</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-accent">
              {formatPercentage(aggregate_tcoc_pct)}
            </div>
            <div className="text-sm text-gray-600 mt-1">TCoC Savings</div>
            <div className="text-xs text-gray-500">Percentage of Total Cost of Care</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-info">
              {formatCurrency(aggregate_savings.total / 12)}
            </div>
            <div className="text-sm text-gray-600 mt-1">Monthly Savings</div>
            <div className="text-xs text-gray-500">Average monthly savings</div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pie Chart */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-4">Savings Distribution by 5R Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(value as number)} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        {drug_results.length > 1 && (
          <div className="card p-6">
            <h3 className="text-lg font-semibold mb-4">Savings by Drug and Category</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => formatCurrency(value)} />
                <Tooltip formatter={(value) => formatCurrency(value as number)} />
                <Legend />
                <Bar dataKey="Right Drug" stackId="a" fill={COLORS['Right Drug']} />
                <Bar dataKey="Right Patient" stackId="a" fill={COLORS['Right Patient']} />
                <Bar dataKey="Right Site" stackId="a" fill={COLORS['Right Site']} />
                <Bar dataKey="Right Dose" stackId="a" fill={COLORS['Right Dose']} />
                <Bar dataKey="Right Duration" stackId="a" fill={COLORS['Right Duration']} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Individual Drug Results */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-4">Individual Drug Results</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Drug</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Members</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Savings</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total PMPM</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TCoC %</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {drug_results.map((drug) => (
                <tr key={drug.drug_name}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {drug.drug_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {drug.members_on_drug.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatCurrency(drug.savings.total)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatPMPM(drug.pmpm_savings.total)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatPercentage(drug.tcoc_savings_pct)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed Breakdown */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-4">5R Category Breakdown</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Savings</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PMPM</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Right Drug</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(aggregate_savings.right_drug)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatPMPM(aggregate_pmpm.right_drug)}</td>
                <td className="px-6 py-4 text-sm text-gray-500">Reducing unwarranted initiations</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Right Patient</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(aggregate_savings.right_patient)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatPMPM(aggregate_pmpm.right_patient)}</td>
                <td className="px-6 py-4 text-sm text-gray-500">Optimizing patient selection and redirection</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Right Site</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(aggregate_savings.right_site)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatPMPM(aggregate_pmpm.right_site)}</td>
                <td className="px-6 py-4 text-sm text-gray-500">Shifting from hospital to outpatient/clinic</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Right Dose</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(aggregate_savings.right_dose)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatPMPM(aggregate_pmpm.right_dose)}</td>
                <td className="px-6 py-4 text-sm text-gray-500">Implementing extended interval dosing strategies</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Right Duration</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(aggregate_savings.right_duration)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatPMPM(aggregate_pmpm.right_duration)}</td>
                <td className="px-6 py-4 text-sm text-gray-500">Optimizing treatment duration</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}