import { useState, useEffect, useCallback } from 'react';

/**
 * Check if we're in a browser environment (not SSR)
 */
function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

/**
 * Safely parse JSON with a fallback
 */
function safeParseJSON<T>(value: string | null, fallback: T): T {
  if (value === null) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

/**
 * Safely stringify a value to JSON
 */
function safeStringifyJSON<T>(value: T): string {
  try {
    return JSON.stringify(value);
  } catch {
    console.warn('Failed to stringify value for localStorage:', value);
    return '';
  }
}

/**
 * Custom hook for persisting state to localStorage
 * Handles SSR by returning initial value when window is not available
 *
 * @param key - The localStorage key to use
 * @param initialValue - The initial value if no stored value exists
 * @returns A tuple of [storedValue, setValue] similar to useState
 *
 * @example
 * const [name, setName] = useLocalStorage('user-name', 'Guest');
 * const [settings, setSettings] = useLocalStorage('settings', { theme: 'dark' });
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  // Initialize state with a function to handle SSR and lazy initialization
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (!isBrowser()) {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return safeParseJSON(item, initialValue);
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Update localStorage when state changes
  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        // Allow value to be a function (like regular useState)
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;

        // Save state
        setStoredValue(valueToStore);

        // Save to localStorage
        if (isBrowser()) {
          const stringified = safeStringifyJSON(valueToStore);
          if (stringified) {
            window.localStorage.setItem(key, stringified);
          }
        }
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  // Listen for changes to this key from other tabs/windows
  useEffect(() => {
    if (!isBrowser()) return;

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === key && event.newValue !== null) {
        try {
          setStoredValue(safeParseJSON(event.newValue, initialValue));
        } catch {
          console.warn(`Error parsing storage change for key "${key}"`);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key, initialValue]);

  return [storedValue, setValue];
}

/**
 * Remove an item from localStorage
 * @param key - The localStorage key to remove
 */
export function removeFromLocalStorage(key: string): void {
  if (isBrowser()) {
    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error);
    }
  }
}

/**
 * Clear all items from localStorage
 */
export function clearLocalStorage(): void {
  if (isBrowser()) {
    try {
      window.localStorage.clear();
    } catch (error) {
      console.warn('Error clearing localStorage:', error);
    }
  }
}

export default useLocalStorage;
