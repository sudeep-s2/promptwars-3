import { useState } from 'react';
import { useAppDispatch } from '../context/AppContext';
import { addEntry, setTab } from '../context/actions';
import type { ActivityEntry, DietType, TransportMode } from '../types';
import {
  validateClothingCount,
  validateDays,
  validateDistance,
  validateElectricity,
  validateElectronicsCount
} from '../utils/validation';
import {
  calculateElectricityCO2,
  calculateFoodCO2,
  calculateShoppingCO2,
  calculateTransportCO2
} from '../utils/carbonMath';

interface TrackerCalculations {
  transportCO2: number;
  foodCO2: number;
  electricityCO2: number;
  clothingCO2: number;
  electronicsCO2: number;
  shoppingCO2: number;
  totalCO2: number;
}

export interface TrackerFormState extends TrackerCalculations {
  step: number;
  transportMode: TransportMode;
  distance: string;
  diet: DietType;
  days: string;
  electricity: string;
  clothingCount: string;
  electronicsCount: string;
  errors: Record<string, string>;
  setTransportMode: (mode: TransportMode) => void;
  setDistance: (distance: string) => void;
  setDiet: (diet: DietType) => void;
  setDays: (days: string) => void;
  setElectricity: (electricity: string) => void;
  setClothingCount: (count: string) => void;
  setElectronicsCount: (count: string) => void;
  handleNext: () => void;
  handleBack: () => void;
  handleSave: () => void;
}

const createEntryId = () => Math.random().toString(36).substring(2, 9);

export function useTrackerForm(): TrackerFormState {
  const dispatch = useAppDispatch();
  const [step, setStep] = useState<number>(1);
  const [transportMode, setTransportMode] = useState<TransportMode>('car');
  const [distance, setDistance] = useState<string>('150');
  const [diet, setDiet] = useState<DietType>('mixed');
  const [days, setDays] = useState<string>('30');
  const [electricity, setElectricity] = useState<string>('250');
  const [clothingCount, setClothingCount] = useState<string>('2');
  const [electronicsCount, setElectronicsCount] = useState<string>('0');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const transportCO2 = calculateTransportCO2(transportMode, parseFloat(distance) || 0);
  const foodCO2 = calculateFoodCO2(diet, parseFloat(days) || 0);
  const electricityCO2 = calculateElectricityCO2(parseFloat(electricity) || 0);
  const clothingCO2 = calculateShoppingCO2(parseFloat(clothingCount) || 0, 0);
  const electronicsCO2 = calculateShoppingCO2(0, parseFloat(electronicsCount) || 0);
  const shoppingCO2 = clothingCO2 + electronicsCO2;
  const totalCO2 = transportCO2 + foodCO2 + electricityCO2 + shoppingCO2;

  const validateStep = (currentStep: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 1) {
      const res = validateDistance(parseFloat(distance));
      if (!res.isValid) newErrors.distance = res.error || '';
    } else if (currentStep === 2) {
      const res = validateDays(parseFloat(days));
      if (!res.isValid) newErrors.days = res.error || '';
    } else if (currentStep === 3) {
      const res = validateElectricity(parseFloat(electricity));
      if (!res.isValid) newErrors.electricity = res.error || '';
    } else if (currentStep === 4) {
      const resCloth = validateClothingCount(parseFloat(clothingCount));
      const resElec = validateElectronicsCount(parseFloat(electronicsCount));

      if (!resCloth.isValid) newErrors.clothing = resCloth.error || '';
      if (!resElec.isValid) newErrors.electronics = resElec.error || '';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
  };

  const handleSave = () => {
    if (!validateStep(4)) {
      setStep(4);
      return;
    }

    const timestamp = Date.now();
    const entries: ActivityEntry[] = [];
    const distNum = parseFloat(distance) || 0;
    const daysNum = parseFloat(days) || 0;
    const kwhNum = parseFloat(electricity) || 0;
    const clothNum = parseFloat(clothingCount) || 0;
    const elecNum = parseFloat(electronicsCount) || 0;

    if (distNum > 0) {
      entries.push({
        id: createEntryId(),
        timestamp,
        category: 'transport',
        subcategory: transportMode,
        quantity: distNum,
        unit: 'km',
        kgCO2: transportCO2
      });
    }

    if (daysNum > 0) {
      entries.push({
        id: createEntryId(),
        timestamp,
        category: 'food',
        subcategory: diet,
        quantity: daysNum,
        unit: 'days',
        kgCO2: foodCO2
      });
    }

    if (kwhNum > 0) {
      entries.push({
        id: createEntryId(),
        timestamp,
        category: 'electricity',
        subcategory: 'grid',
        quantity: kwhNum,
        unit: 'kWh',
        kgCO2: electricityCO2
      });
    }

    if (clothNum > 0) {
      entries.push({
        id: createEntryId(),
        timestamp,
        category: 'shopping',
        subcategory: 'clothing',
        quantity: clothNum,
        unit: 'items',
        kgCO2: clothingCO2
      });
    }

    if (elecNum > 0) {
      entries.push({
        id: createEntryId(),
        timestamp,
        category: 'shopping',
        subcategory: 'electronics',
        quantity: elecNum,
        unit: 'items',
        kgCO2: electronicsCO2
      });
    }

    entries.forEach(entry => dispatch(addEntry(entry)));
    dispatch(setTab('dashboard'));
  };

  return {
    step,
    transportMode,
    distance,
    diet,
    days,
    electricity,
    clothingCount,
    electronicsCount,
    errors,
    transportCO2,
    foodCO2,
    electricityCO2,
    clothingCO2,
    electronicsCO2,
    shoppingCO2,
    totalCO2,
    setTransportMode,
    setDistance,
    setDiet,
    setDays,
    setElectricity,
    setClothingCount,
    setElectronicsCount,
    handleNext,
    handleBack,
    handleSave
  };
}

