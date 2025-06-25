import AsyncStorage from '@react-native-async-storage/async-storage';

// Utility class for AsyncStorage operations with error handling
class StorageManager {
  private static instance: StorageManager;
  private isInitialized: boolean = false;

  private constructor() {}

  static getInstance(): StorageManager {
    if (!StorageManager.instance) {
      StorageManager.instance = new StorageManager();
    }
    return StorageManager.instance;
  }

  // Initialize AsyncStorage
  async initialize(): Promise<boolean> {
    try {
      // Test if AsyncStorage is available
      await AsyncStorage.setItem('test', 'test');
      await AsyncStorage.removeItem('test');
      this.isInitialized = true;
      console.log('AsyncStorage initialized successfully');
      return true;
    } catch (error) {
      console.error('AsyncStorage initialization failed:', error);
      this.isInitialized = false;
      return false;
    }
  }

  // Safe get item with error handling
  async getItem(key: string): Promise<string | null> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      const value = await AsyncStorage.getItem(key);
      return value;
    } catch (error) {
      console.error(`Error getting item ${key}:`, error);
      return null;
    }
  }

  // Safe set item with error handling
  async setItem(key: string, value: string): Promise<boolean> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      await AsyncStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.error(`Error setting item ${key}:`, error);
      return false;
    }
  }

  // Safe remove item with error handling
  async removeItem(key: string): Promise<boolean> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      await AsyncStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing item ${key}:`, error);
      return false;
    }
  }

  // Safe clear all with error handling
  async clear(): Promise<boolean> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      await AsyncStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing AsyncStorage:', error);
      return false;
    }
  }

  // Get multiple items
  async getMultipleItems(keys: string[]): Promise<[string, string | null][]> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      return await AsyncStorage.multiGet(keys);
    } catch (error) {
      console.error('Error getting multiple items:', error);
      return keys.map(key => [key, null]);
    }
  }

  // Set multiple items
  async setMultipleItems(keyValuePairs: [string, string][]): Promise<boolean> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      await AsyncStorage.multiSet(keyValuePairs);
      return true;
    } catch (error) {
      console.error('Error setting multiple items:', error);
      return false;
    }
  }
}

// Export singleton instance
export const storageManager = StorageManager.getInstance();

// Convenience functions
export const getItem = (key: string) => storageManager.getItem(key);
export const setItem = (key: string, value: string) => storageManager.setItem(key, value);
export const removeItem = (key: string) => storageManager.removeItem(key);
export const clear = () => storageManager.clear();
export const getMultipleItems = (keys: string[]) => storageManager.getMultipleItems(keys);
export const setMultipleItems = (keyValuePairs: [string, string][]) => storageManager.setMultipleItems(keyValuePairs); 