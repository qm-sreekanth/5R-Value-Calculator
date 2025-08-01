import { useState } from 'react';
import Head from 'next/head';
import CalculatorForm from '../components/CalculatorForm';
import ResultsDisplay from '../components/ResultsDisplay';
import { SpecialtyRx5RCalculator } from '../utils/calculator';
import { validateInputs } from '../utils/formatters';
import { CalculatorInputs, AggregateResults } from '../types/calculator';

export default function Home() {
  const [results, setResults] = useState<AggregateResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastInputs, setLastInputs] = useState<CalculatorInputs | null>(null);

  const calculator = new SpecialtyRx5RCalculator();

  const handleCalculate = async (inputs: CalculatorInputs) => {
    setLoading(true);
    setError(null);

    // Validate inputs
    const validation = validateInputs(
      inputs.covered_lives,
      inputs.line_of_business,
      inputs.selected_drugs
    );

    if (!validation.valid) {
      setError(validation.message);
      setLoading(false);
      return;
    }

    try {
      // Simulate async calculation (in real app might call API)
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const calculationResults = calculator.calculateAggregateSavings(
        inputs.selected_drugs,
        inputs.covered_lives,
        inputs.line_of_business
      );

      setResults(calculationResults);
      setLastInputs(inputs);
    } catch (err) {
      setError('An error occurred during calculation. Please try again.');
      console.error('Calculation error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Specialty Rx 5R Value Calculator</title>
        <meta name="description" content="Medical Benefit Drug Cost Savings Assessment" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <h1 className="text-3xl font-bold text-gray-900">
              💊 Specialty Rx 5R Value Calculator
            </h1>
            <p className="text-lg text-gray-600 mt-2">
              Medical Benefit Drug Cost Savings Assessment
            </p>
          </div>
        </header>

        {/* Main Content */}
        <main className="  px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex md:flex-row gap-8">
            {/* Left Sidebar - fixed width menu */}
            <div className="md:w-64 md:self-start md:flex-shrink-0 space-y-6">
              <CalculatorForm onCalculate={handleCalculate} loading={loading} />
              {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}
            </div>

            {/* Right Content - full width */}
            <div className="flex-1">
              {results && lastInputs ? (
                <ResultsDisplay 
                  results={results} 
                  coveredLives={lastInputs.covered_lives}
                />
              ) : (
                <IntroductionCard />
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

function IntroductionCard() {
  return (
    <div className="space-y-6">
      {/* Overview */}
      <div className="card p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Getting Started</h2>
        <p className="text-gray-600 mb-4">
          This calculator estimates potential cost savings through the 5R optimization framework for specialty medical benefit drugs:
        </p>
        <div className="space-y-2 text-sm text-gray-600">
          <div><strong>Right Drug:</strong> Reducing unwarranted initiations</div>
          <div><strong>Right Patient:</strong> Optimizing patient selection and redirection</div>
          <div><strong>Right Site:</strong> Shifting from hospital to outpatient/clinic administration</div>
          <div><strong>Right Dose:</strong> Implementing extended interval dosing (EID) strategies</div>
          <div><strong>Right Duration:</strong> Optimizing treatment duration and discontinuation</div>
        </div>
      </div>

      {/* Available Drugs */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Available Drugs</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Medical Benefit Specialty Drugs:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li><strong>IVIG:</strong> Intravenous Immunoglobulin</li>
              <li><strong>Tysabri:</strong> Natalizumab (MS/Crohn's)</li>
              <li><strong>Remicade:</strong> Infliximab (RA/IBD)</li>
              <li><strong>Ocrevus:</strong> Ocrelizumab (MS)</li>
              <li><strong>Entyvio:</strong> Vedolizumab (UC/Crohn's)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Sample Results */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Sample Output</h3>
        <p className="text-sm text-gray-600 mb-4">
          Based on the Excel model, Tysabri analysis for 100,000 Commercial lives shows:
        </p>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Savings</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">PMPM</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 text-sm">
              <tr>
                <td className="px-4 py-2 font-medium">Right Drug</td>
                <td className="px-4 py-2">$371,438</td>
                <td className="px-4 py-2">$0.31</td>
                <td className="px-4 py-2">7.5% unwarranted initiation reduction</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-medium">Right Patient</td>
                <td className="px-4 py-2">$495,250</td>
                <td className="px-4 py-2">$0.41</td>
                <td className="px-4 py-2">10% patient redirection</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-medium">Right Site</td>
                <td className="px-4 py-2">$247,625</td>
                <td className="px-4 py-2">$0.21</td>
                <td className="px-4 py-2">40% hospital admin, 50% shift to clinic</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-medium">Right Dose</td>
                <td className="px-4 py-2">$173,338</td>
                <td className="px-4 py-2">$0.14</td>
                <td className="px-4 py-2">12.5% EID implementation</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-medium">Right Duration</td>
                <td className="px-4 py-2">$371,438</td>
                <td className="px-4 py-2">$0.31</td>
                <td className="px-4 py-2">7.5% appropriate discontinuation</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm font-medium text-blue-800">
            Total Tysabri Savings: $1,659,088 | PMPM: $1.38 | TCoC Savings: 33.5%
          </p>
        </div>
      </div>
    </div>
  );
}