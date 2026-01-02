// src/config/Config.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const CONFIG_URL =
  'https://raw.githubusercontent.com/TheKushalRijal/base-url-icamp/main/config.json';

const CACHE_KEY = 'API_BASE_URL';
const FALLBACK_URL = 'http://localhost:3000';

// 🔹 This is what you will import everywhere
export let DEV_BASE_URL = '';

// 🔹 Call this once in App.tsx
export async function initBaseUrl(): Promise<string> {
  console.log('[Config] initBaseUrl: starting');

  const baseUrl = await loadBaseUrl();

  DEV_BASE_URL = baseUrl;          // <- set the exported variable
  axios.defaults.baseURL = baseUrl; // <- also set axios default for safety

  console.log('[Config] DEV_BASE_URL =', DEV_BASE_URL);
  return baseUrl;
}

async function loadBaseUrl(): Promise<string> {
  try {
    const cached = await AsyncStorage.getItem(CACHE_KEY);
    if (cached) {
      console.log('[Config] Using cached base URL:', cached);
      refreshInBackground();
      return cached;
    }

    console.log('[Config] Fetching base URL from GitHub:', CONFIG_URL);
    const res = await fetch(CONFIG_URL);
    const json = await res.json();

    const baseUrl = json.apiBaseUrl;
    console.log('[Config] Fetched base URL from GitHub:', baseUrl);

    await AsyncStorage.setItem(CACHE_KEY, baseUrl);
    return baseUrl;
  } catch (e) {
    console.warn('[Config] Failed to fetch config, using fallback:', FALLBACK_URL);
    return FALLBACK_URL;
  }
}

async function refreshInBackground() {
  try {
    console.log('[Config] Background refresh: fetching latest base URL');
    const res = await fetch(CONFIG_URL);
    const json = await res.json();
    await AsyncStorage.setItem(CACHE_KEY, json.apiBaseUrl);
    console.log('[Config] Background refresh: updated base URL to:', json.apiBaseUrl);
  } catch (e) {
    console.warn('[Config] Background refresh failed');
  }
}
