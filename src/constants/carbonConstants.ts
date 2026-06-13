export const COEFFICIENTS = {
  transport: {
    car: 0.192,
    bus: 0.089,
    train: 0.041,
    flight: 0.255,
    'walk-bike': 0.000
  },
  food: {
    'high-meat': 7.2,
    mixed: 5.6,
    vegetarian: 3.8,
    vegan: 2.9
  },
  electricity: {
    grid: 0.385
  },
  shopping: {
    clothing: 15.0,
    electronics: 80.0
  }
} as const;

export const BASELINES = {
  transport: 150,
  food: 170,
  electricity: 120,
  shopping: 60
} as const;

export const SCORE_WEIGHTS = {
  transport: 0.35,
  food: 0.25,
  electricity: 0.20,
  shopping: 0.20
} as const;

export const SCORE_CATEGORY_RATIO_CAP = 250;
export const DAYS_PER_MONTH = 30;
export const WEEKS_PER_MONTH = 4.33;

export const LIFESTYLE_COSTS = {
  transportPerKm: {
    car: 0.15,
    bus: 0.05,
    train: 0.07,
    flight: 0.25,
    'walk-bike': 0
  },
  foodPerDay: {
    'high-meat': 15.0,
    mixed: 12.90,
    vegetarian: 11.50,
    vegan: 10.80
  },
  electricityPerKwh: 0.15,
  clothingPerItem: 45.0,
  electronicsPerItem: 180.0
} as const;

export const DEFAULT_MONTHLY_TARGET = 400;

