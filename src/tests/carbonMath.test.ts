import { describe, it, expect } from 'vitest';
import {
  COEFFICIENTS,
  BASELINES,
  calculateTransportCO2,
  calculateFoodCO2,
  calculateElectricityCO2,
  calculateShoppingCO2,
  calculateCarbonScore,
  calculateEntryCO2
} from '../utils/carbonMath';

describe('carbonMath Calculations', () => {
  describe('coefficients', () => {
    it('should match exact specification coefficients', () => {
      expect(COEFFICIENTS.transport.car).toBe(0.192);
      expect(COEFFICIENTS.transport.bus).toBe(0.089);
      expect(COEFFICIENTS.transport.train).toBe(0.041);
      expect(COEFFICIENTS.transport.flight).toBe(0.255);
      expect(COEFFICIENTS.transport['walk-bike']).toBe(0.000);

      expect(COEFFICIENTS.food['high-meat']).toBe(7.2);
      expect(COEFFICIENTS.food.mixed).toBe(5.6);
      expect(COEFFICIENTS.food.vegetarian).toBe(3.8);
      expect(COEFFICIENTS.food.vegan).toBe(2.9);

      expect(COEFFICIENTS.electricity.grid).toBe(0.385);

      expect(COEFFICIENTS.shopping.clothing).toBe(15.0);
      expect(COEFFICIENTS.shopping.electronics).toBe(80.0);
    });
  });

  describe('calculateTransportCO2', () => {
    it('should calculate correct emissions for transport mode and distance', () => {
      expect(calculateTransportCO2('car', 100)).toBe(19.2);
      expect(calculateTransportCO2('train', 1000)).toBe(41.0);
      expect(calculateTransportCO2('walk-bike', 50)).toBe(0);
    });

    it('should handle zero, negative, NaN and infinite distances gracefully', () => {
      expect(calculateTransportCO2('car', 0)).toBe(0);
      expect(calculateTransportCO2('car', -100)).toBe(0);
      expect(calculateTransportCO2('car', NaN)).toBe(0);
      expect(calculateTransportCO2('car', Infinity)).toBe(0);
    });
  });

  describe('calculateFoodCO2', () => {
    it('should calculate food emissions correctly for days', () => {
      expect(calculateFoodCO2('high-meat', 10)).toBe(72.0);
      expect(calculateFoodCO2('vegan', 30)).toBe(87.0);
    });

    it('should handle zero, negative, NaN and infinite days gracefully', () => {
      expect(calculateFoodCO2('mixed', 0)).toBe(0);
      expect(calculateFoodCO2('mixed', -5)).toBe(0);
      expect(calculateFoodCO2('mixed', NaN)).toBe(0);
      expect(calculateFoodCO2('mixed', Infinity)).toBe(0);
    });
  });

  describe('calculateElectricityCO2', () => {
    it('should calculate electricity emissions correctly', () => {
      expect(calculateElectricityCO2(200)).toBe(77.0);
    });

    it('should handle zero, negative, NaN and infinite kWh gracefully', () => {
      expect(calculateElectricityCO2(0)).toBe(0);
      expect(calculateElectricityCO2(-50)).toBe(0);
      expect(calculateElectricityCO2(NaN)).toBe(0);
      expect(calculateElectricityCO2(Infinity)).toBe(0);
    });
  });

  describe('calculateShoppingCO2', () => {
    it('should calculate shopping emissions correctly', () => {
      expect(calculateShoppingCO2(3, 1)).toBe(3 * 15.0 + 1 * 80.0);
    });

    it('should handle zero, negative, NaN and infinite counts gracefully', () => {
      expect(calculateShoppingCO2(0, 0)).toBe(0);
      expect(calculateShoppingCO2(-1, -1)).toBe(0);
      expect(calculateShoppingCO2(NaN, NaN)).toBe(0);
      expect(calculateShoppingCO2(Infinity, Infinity)).toBe(0);
    });
  });

  describe('calculateEntryCO2 helper', () => {
    it('should correctly route calculations to sub-calculators', () => {
      expect(calculateEntryCO2('transport', 'car', 100)).toBe(19.2);
      expect(calculateEntryCO2('food', 'vegan', 10)).toBe(29.0);
      expect(calculateEntryCO2('electricity', '', 100)).toBe(38.5);
      expect(calculateEntryCO2('shopping', '', 2, 1)).toBe(30.0 + 80.0);
    });
  });

  describe('calculateCarbonScore', () => {
    it('should return 100 if all emissions are zero', () => {
      const score = calculateCarbonScore(0, 0, 0, 0);
      expect(score.total).toBe(100);
      expect(score.transportPct).toBe(0);
      expect(score.foodPct).toBe(0);
      expect(score.electricityPct).toBe(0);
      expect(score.shoppingPct).toBe(0);
    });

    it('should calculate correct percentages and total score', () => {
      // If emissions are exactly baseline values:
      // norm values will be 100% of baseline.
      // weighted index sum: 100 * 0.35 + 100 * 0.25 + 100 * 0.20 + 100 * 0.20 = 100
      // score total = 100 - 100 = 0.
      const score = calculateCarbonScore(
        BASELINES.transport,
        BASELINES.food,
        BASELINES.electricity,
        BASELINES.shopping
      );
      expect(score.total).toBe(0);
      
      const totalBaselineSum = BASELINES.transport + BASELINES.food + BASELINES.electricity + BASELINES.shopping;
      expect(score.transportPct).toBe(Math.round((BASELINES.transport / totalBaselineSum) * 100));
    });

    it('should cap category ratio multipliers at 250% to prevent extreme values from causing underflows', () => {
      const score = calculateCarbonScore(10000, 10000, 10000, 10000);
      expect(score.total).toBe(0); // capped at 0 minimum
    });

    it('should yield a high score for low emissions', () => {
      // If emissions are half of baselines
      const score = calculateCarbonScore(
        BASELINES.transport / 2,
        BASELINES.food / 2,
        BASELINES.electricity / 2,
        BASELINES.shopping / 2
      );
      expect(score.total).toBe(50);
    });
  });
});
