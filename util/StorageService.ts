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
    private secureStore;

    constructor() {
        this.secureStore = require('expo-secure-store');
    }

    async getItem(key: string): Promise<string | null> {
        return await this.secureStore.getItemAsync(key);
    }

    async setItem(key: string, value: string | null): Promise<void> {
        if (value === null) {
            await this.removeItem(key);
        } else {
            await this.secureStore.setItemAsync(key, value);
        }
    }

    async removeItem(key: string): Promise<void> {
        await this.secureStore.deleteItemAsync(key);
    }
}

// Export singleton instance
export const storageService: IStorageService = Platform.OS === 'web'
    ? new WebStorageService()
    : new SecureStorageService();