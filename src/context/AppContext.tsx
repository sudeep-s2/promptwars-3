import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { ActivityEntry, SimulatorState } from '../types';
import { AppAction } from './actions';
import { load, save, StorageKey } from '../utils/storage';

export interface AppState {
  entries: ActivityEntry[];
  monthlyTarget: number;
  simulatorLevers: SimulatorState;
  currentTab: string;
}

const DEFAULT_LEVERS: SimulatorState = {
  transportMode: 'car',
  weeklyKm: 150,
  diet: 'mixed',
  monthlyKwh: 250,
  monthlyClothingItems: 2,
  monthlyElectronicsItems: 0,
};

const INITIAL_STATE: AppState = {
  entries: [],
  monthlyTarget: 400, // kg CO2
  simulatorLevers: DEFAULT_LEVERS,
  currentTab: 'dashboard',
};

// Initial state loader from storage
function getInitialState(): AppState {
  const entries = load<ActivityEntry[]>(StorageKey.ENTRIES, INITIAL_STATE.entries);
  const monthlyTarget = load<number>(StorageKey.TARGET, INITIAL_STATE.monthlyTarget);
  const simulatorLevers = load<SimulatorState>(StorageKey.LEVERS, INITIAL_STATE.simulatorLevers);
  
  return {
    entries,
    monthlyTarget,
    simulatorLevers,
    currentTab: 'dashboard'
  };
}

const AppStateContext = createContext<AppState | undefined>(undefined);
const AppDispatchContext = createContext<React.Dispatch<AppAction> | undefined>(undefined);

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'ADD_ENTRY': {
      const updatedEntries = [action.payload, ...state.entries];
      return { ...state, entries: updatedEntries };
    }
    case 'DELETE_ENTRY': {
      const updatedEntries = state.entries.filter(entry => entry.id !== action.payload);
      return { ...state, entries: updatedEntries };
    }
    case 'SET_TARGET':
      return { ...state, monthlyTarget: action.payload };
    case 'UPDATE_LEVERS':
      return {
        ...state,
        simulatorLevers: { ...state.simulatorLevers, ...action.payload }
      };
    case 'SET_TAB':
      return { ...state, currentTab: action.payload };
    case 'CLEAR_DATA':
      return {
        entries: [],
        monthlyTarget: 400,
        simulatorLevers: DEFAULT_LEVERS,
        currentTab: 'dashboard'
      };
    default:
      return state;
  }
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, null, getInitialState);

  // Sync state changes with localStorage
  useEffect(() => {
    save(StorageKey.ENTRIES, state.entries);
  }, [state.entries]);

  useEffect(() => {
    save(StorageKey.TARGET, state.monthlyTarget);
  }, [state.monthlyTarget]);

  useEffect(() => {
    save(StorageKey.LEVERS, state.simulatorLevers);
  }, [state.simulatorLevers]);

  return (
    <AppStateContext.Provider value={state}>
      <AppDispatchContext.Provider value={dispatch}>
        {children}
      </AppDispatchContext.Provider>
    </AppStateContext.Provider>
  );
};

export const useAppState = (): AppState => {
  const context = useContext(AppStateContext);
  if (context === undefined) {
    throw new Error('useAppState must be used within an AppProvider');
  }
  return context;
};

export const useAppDispatch = (): React.Dispatch<AppAction> => {
  const context = useContext(AppDispatchContext);
  if (context === undefined) {
    throw new Error('useAppDispatch must be used within an AppProvider');
  }
  return context;
};
