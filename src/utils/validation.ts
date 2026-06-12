export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validates a distance input (km).
 */
export function validateDistance(value: number): ValidationResult {
  if (value === null || value === undefined || isNaN(value)) {
    return { isValid: false, error: 'Distance must be a valid number.' };
  }
  if (!isFinite(value)) {
    return { isValid: false, error: 'Distance cannot be infinite.' };
  }
  if (value < 0) {
    return { isValid: false, error: 'Distance cannot be negative.' };
  }
  if (value > 2000) {
    return { isValid: false, error: 'Distance cannot exceed 2000 km per week.' };
  }
  return { isValid: true };
}

/**
 * Validates days tracked for food (typically 1 to 31).
 */
export function validateDays(value: number): ValidationResult {
  if (value === null || value === undefined || isNaN(value)) {
    return { isValid: false, error: 'Days must be a valid number.' };
  }
  if (!Number.isInteger(value)) {
    return { isValid: false, error: 'Days must be an integer.' };
  }
  if (value < 1) {
    return { isValid: false, error: 'Days must be at least 1.' };
  }
  if (value > 31) {
    return { isValid: false, error: 'Days cannot exceed 31 in a single entry.' };
  }
  return { isValid: true };
}

/**
 * Validates electricity (kWh).
 */
export function validateElectricity(value: number): ValidationResult {
  if (value === null || value === undefined || isNaN(value)) {
    return { isValid: false, error: 'Electricity must be a valid number.' };
  }
  if (!isFinite(value)) {
    return { isValid: false, error: 'Electricity cannot be infinite.' };
  }
  if (value < 0) {
    return { isValid: false, error: 'Electricity cannot be negative.' };
  }
  if (value > 5000) {
    return { isValid: false, error: 'Electricity cannot exceed 5000 kWh per month.' };
  }
  return { isValid: true };
}

/**
 * Validates shopping clothing count.
 */
export function validateClothingCount(value: number): ValidationResult {
  if (value === null || value === undefined || isNaN(value)) {
    return { isValid: false, error: 'Item count must be a valid number.' };
  }
  if (!Number.isInteger(value)) {
    return { isValid: false, error: 'Item count must be an integer.' };
  }
  if (value < 0) {
    return { isValid: false, error: 'Item count cannot be negative.' };
  }
  if (value > 50) {
    return { isValid: false, error: 'Clothing purchases cannot exceed 50 items per month.' };
  }
  return { isValid: true };
}

/**
 * Validates shopping electronics count.
 */
export function validateElectronicsCount(value: number): ValidationResult {
  if (value === null || value === undefined || isNaN(value)) {
    return { isValid: false, error: 'Item count must be a valid number.' };
  }
  if (!Number.isInteger(value)) {
    return { isValid: false, error: 'Item count must be an integer.' };
  }
  if (value < 0) {
    return { isValid: false, error: 'Item count cannot be negative.' };
  }
  if (value > 10) {
    return { isValid: false, error: 'Electronics purchases cannot exceed 10 items per month.' };
  }
  return { isValid: true };
}
