import { ActivityEntry, SimulatorState } from '../types';

export type AppAction =
  | { type: 'ADD_ENTRY'; payload: ActivityEntry }
  | { type: 'DELETE_ENTRY'; payload: string }
  | { type: 'SET_TARGET'; payload: number }
  | { type: 'UPDATE_LEVERS'; payload: Partial<SimulatorState> }
  | { type: 'SET_TAB'; payload: string }
  | { type: 'CLEAR_DATA' };

export const addEntry = (entry: ActivityEntry): AppAction => ({
  type: 'ADD_ENTRY',
  payload: entry
});

export const deleteEntry = (id: string): AppAction => ({
  type: 'DELETE_ENTRY',
  payload: id
});

export const setTarget = (target: number): AppAction => ({
  type: 'SET_TARGET',
  payload: target
});

export const updateLevers = (levers: Partial<SimulatorState>): AppAction => ({
  type: 'UPDATE_LEVERS',
  payload: levers
});

export const setTab = (tab: string): AppAction => ({
  type: 'SET_TAB',
  payload: tab
});

export const clearData = (): AppAction => ({
  type: 'CLEAR_DATA'
});
