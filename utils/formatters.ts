export const formatCurrency = (amount: number): string => {
  if (amount >= 1_000_000) {
    return `$${(amount / 1_000_000).toFixed(2)}M`;
  } else if (amount >= 1_000) {
    return `$${(amount / 1_000).toFixed(0)}K`;
  } else {
    return `$${amount.toLocaleString()}`;
  }
};

export const formatPMPM = (amount: number): string => {
  return `$${amount.toFixed(2)}`;
};

export const formatPercentage = (value: number): string => {
  return `${value.toFixed(1)}%`;
};

export const validateInputs = (
  coveredLives: number,
  lineOfBusiness: string,
  selectedDrugs: string[]
): { valid: boolean; message: string } => {
  if (coveredLives <= 0) {
    return {
      valid: false,
      message: "Covered lives must be greater than 0"
    };
  }

  if (coveredLives > 10_000_000) {
    return {
      valid: false,
      message: "Covered lives seems unusually high. Please verify the number."
    };
  }

  if (!['Commercial', 'Medicare'].includes(lineOfBusiness)) {
    return {
      valid: false,
      message: "Line of business must be either 'Commercial' or 'Medicare'"
    };
  }

  if (selectedDrugs.length === 0) {
    return {
      valid: false,
      message: "Please select at least one drug for analysis"
    };
  }

  const validDrugs = ['IVIG', 'Tysabri', 'Remicade', 'Ocrevus', 'Entyvio'];
  for (const drug of selectedDrugs) {
    if (!validDrugs.includes(drug)) {
      return {
        valid: false,
        message: `Invalid drug selection: ${drug}`
      };
    }
  }

  return {
    valid: true,
    message: "All inputs are valid"
  };
};

export const get5RColors = (): Record<string, string> => {
  return {
    'Right Drug': '#1f77b4',      // Blue
    'Right Patient': '#2ca02c',   // Green
    'Right Site': '#ff7f0e',      // Orange
    'Right Dose': '#d62728',      // Red
    'Right Duration': '#9467bd'   // Purple
  };
};