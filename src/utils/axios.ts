import axios from 'axios';
import { BASE_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

const instance = axios.create({
    baseURL: BASE_URL,
    timeout: 30000, // Increased timeout for slower connections
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    // For self-signed certificates in development
    ...(process.env.NODE_ENV === 'development' && {
        httpsAgent: new (require('https').Agent)({  
            rejectUnauthorized: false
        })
    })
});

// Add a request interceptor for authentication
instance.interceptors.request.use(
    async (config) => {
        // Get the token from AsyncStorage
        const token = await AsyncStorage.getItem('userToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor for error handling
instance.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            // Handle unauthorized access
            // e.g., redirect to login
            await AsyncStorage.removeItem('userToken');
            // You might want to navigate to login screen here
        }
        return Promise.reject(error);
    }
);

export default instance;
