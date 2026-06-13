export enum StorageKey {
  ENTRIES = 'carbon_entries',
  TARGET = 'carbon_monthly_target',
  LEVERS = 'carbon_simulator_levers',
}

/**
 * Saves a value to localStorage, failing silently if storage quota is exceeded or storage is disabled.
 */
export function save<T>(key: StorageKey, value: T): void {
  try {
    const serialized = JSON.stringify(value);
    localStorage.setItem(key, serialized);
  } catch (error) {
    console.warn(`[Storage] Failed to save key "${key}":`, error);
  }
}

/**
 * Loads a value from localStorage, returning fallback on failure or if not found.
 */
export function load<T>(key: StorageKey, fallback: T): T {
  try {
    const value = localStorage.getItem(key);
    if (value === null) return fallback;
    const parsed: T = JSON.parse(value);
    return parsed;
  } catch (error) {
    console.warn(`[Storage] Failed to load key "${key}", using fallback:`, error);
    return fallback;
  }
}

/**
 * Updates a value in localStorage using an updater function.
 */
export function update<T>(key: StorageKey, updater: (prev: T) => T, fallback: T): void {
  try {
    const prev = load<T>(key, fallback);
    const updated = updater(prev);
    save<T>(key, updated);
  } catch (error) {
    console.warn(`[Storage] Failed to update key "${key}":`, error);
  }
}

/**
 * Removes an item from localStorage.
 */
export function remove(key: StorageKey): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.warn(`[Storage] Failed to remove key "${key}":`, error);
  }
}
