import * as SecureStore from 'expo-secure-store';
import { useCallback, useEffect, useState } from 'react';
import { Platform } from 'react-native';

interface IStorageService {
    getItem(key: string): Promise<string | null>;
    setItem(key: string, value: string | null): Promise<void>;
    removeItem(key: string): Promise<void>;
}

class WebStorageService implements IStorageService {
    async getItem(key: string): Promise<string | null> {
        return localStorage.getItem(key);
    }

    async setItem(key: string, value: string | null): Promise<void> {
        if (value === null) {
            await this.removeItem(key);
        } else {
            localStorage.setItem(key, value);
        }
    }

    async removeItem(key: string): Promise<void> {
        localStorage.removeItem(key);
    }
}

class SecureStorageService implements IStorageService {
    async getItem(key: string): Promise<string | null> {
        return await SecureStore.getItemAsync(key);
    }

    async setItem(key: string, value: string | null): Promise<void> {
        if (value === null) {
            await this.removeItem(key);
        } else {
            await SecureStore.setItemAsync(key, value);
        }
    }

    async removeItem(key: string): Promise<void> {
        await SecureStore.deleteItemAsync(key);
    }
}

const storageService: IStorageService =
    Platform.OS === 'web' ? new WebStorageService() : new SecureStorageService();

/**
 * React Hook zum persistenten Speichern und Lesen eines Werts.
 * 
 * @param key - Speicher-Schlüssel
 * @param initialValue - Standardwert, falls keiner vorhanden ist
 */
export function useStorage<T>(
    key: string,
    initialValue: T
): [T, (value: T | ((prev: T) => T)) => Promise<void>, () => Promise<void>] {
    const [value, setValue] = useState<T>(initialValue);

    // Laden beim Mount
    useEffect(() => {
        (async () => {
            const storedValue = await storageService.getItem(key);
            if (storedValue != null) {
                try {
                    setValue(JSON.parse(storedValue));
                } catch {
                    // Fallback für unparsebare Daten
                    setValue(storedValue as unknown as T);
                }
            }
        })();
    }, [key]);

    // Wert setzen (und speichern)
    const setStoredValue = useCallback(
        async (val: T | ((prev: T) => T)) => {
            setValue(prev => {
                const newValue = val instanceof Function ? val(prev) : val;
                storageService.setItem(key, JSON.stringify(newValue));
                return newValue;
            });
        },
        [key]
    );

    // Entfernen
    const removeStoredValue = useCallback(async () => {
        await storageService.removeItem(key);
        setValue(initialValue);
    }, [key, initialValue]);

    return [value, setStoredValue, removeStoredValue];
}
