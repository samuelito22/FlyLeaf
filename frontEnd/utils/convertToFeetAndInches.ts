export function cmToFeetInches(cm: number) {
  const totalInches = cm / 2.54;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);
  
  return {
    feet: feet,
    inches: inches
  };
}

// Function to convert feet and inches to centimeters
export function feetInchesToCm(feet: number, inches: number) {
  const totalInches = (feet * 12) + inches;
  const cm = Math.round(totalInches * 2.54);
  
  return cm;
}

