import { describe, it, expect } from 'vitest';
import {
  validateDistance,
  validateDays,
  validateElectricity,
  validateClothingCount,
  validateElectronicsCount
} from '../utils/validation';

describe('Input Validation Rules', () => {
  describe('validateDistance', () => {
    it('should approve valid distances', () => {
      expect(validateDistance(0).isValid).toBe(true);
      expect(validateDistance(50.5).isValid).toBe(true);
      expect(validateDistance(2000).isValid).toBe(true);
    });

    it('should reject invalid values', () => {
      expect(validateDistance(-1).isValid).toBe(false);
      expect(validateDistance(2001).isValid).toBe(false);
      expect(validateDistance(NaN).isValid).toBe(false);
      expect(validateDistance(Infinity).isValid).toBe(false);
    });
  });

  describe('validateDays', () => {
    it('should approve valid days tracked', () => {
      expect(validateDays(1).isValid).toBe(true);
      expect(validateDays(15).isValid).toBe(true);
      expect(validateDays(31).isValid).toBe(true);
    });

    it('should reject non-integers and out of bound values', () => {
      expect(validateDays(0).isValid).toBe(false);
      expect(validateDays(32).isValid).toBe(false);
      expect(validateDays(1.5).isValid).toBe(false);
      expect(validateDays(NaN).isValid).toBe(false);
    });
  });

  describe('validateElectricity', () => {
    it('should approve valid kWh consumption', () => {
      expect(validateElectricity(0).isValid).toBe(true);
      expect(validateElectricity(250).isValid).toBe(true);
      expect(validateElectricity(5000).isValid).toBe(true);
    });

    it('should reject negative values, infinity and extreme values', () => {
      expect(validateElectricity(-1).isValid).toBe(false);
      expect(validateElectricity(5001).isValid).toBe(false);
      expect(validateElectricity(NaN).isValid).toBe(false);
      expect(validateElectricity(Infinity).isValid).toBe(false);
    });
  });

  describe('validateClothingCount', () => {
    it('should approve valid clothing item counts', () => {
      expect(validateClothingCount(0).isValid).toBe(true);
      expect(validateClothingCount(5).isValid).toBe(true);
      expect(validateClothingCount(50).isValid).toBe(true);
    });

    it('should reject negative, non-integer and extreme values', () => {
      expect(validateClothingCount(-1).isValid).toBe(false);
      expect(validateClothingCount(51).isValid).toBe(false);
      expect(validateClothingCount(2.5).isValid).toBe(false);
      expect(validateClothingCount(NaN).isValid).toBe(false);
    });
  });

  describe('validateElectronicsCount', () => {
    it('should approve valid electronics item counts', () => {
      expect(validateElectronicsCount(0).isValid).toBe(true);
      expect(validateElectronicsCount(2).isValid).toBe(true);
      expect(validateElectronicsCount(10).isValid).toBe(true);
    });

    it('should reject negative, non-integer and extreme values', () => {
      expect(validateElectronicsCount(-1).isValid).toBe(false);
      expect(validateElectronicsCount(11).isValid).toBe(false);
      expect(validateElectronicsCount(1.5).isValid).toBe(false);
      expect(validateElectronicsCount(NaN).isValid).toBe(false);
    });
  });
});
