import axios from 'axios';
import { getAccessToken, getRefreshToken, storeAccessToken, storeRefreshToken } from '@/utils/authToken';
import { config as appConfig } from '@/config';
import { RefreshResponse } from '@/types/auth';

// Create unprotected axios instance - will not check for tokens
export const unprotectedAxiosInstance = axios.create({
    baseURL: appConfig.backendBaseURL,
    // timeout: appConfig.timeout,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Create axios instance
const axiosInstance = axios.create({
    baseURL: appConfig.backendBaseURL,
    // timeout: appConfig.timeout,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor to check token on every request
axiosInstance.interceptors.request.use(
    async (config) => {
        // Check if token exists
        let token = getAccessToken();

        // If token doesn't exist, fetch it using refresh token
        if (!token) {
            try {
                // Get refresh token
                const refreshToken = getRefreshToken();

                // If no refresh token exists, we can't get a new access token
                if (!refreshToken) {
                    console.warn('No refresh token available to fetch access token');

                    // Display alert and redirect to login page with callback URL
                    alert('Your session has expired. Please login again.');

                    // Create URL object with login path and current location as callback
                    const url = new URL(appConfig.routePaths.login, window.location.origin);
                    url.searchParams.set(appConfig.callbackUrlName, window.location.pathname + window.location.search);

                    // Redirect to login with callback URL
                    window.location.href = url.toString();

                    return Promise.reject('Authentication required');
                }

                // Prepare form data
                const form = new FormData();
                form.append("refresh", refreshToken);

                // Make API call to get new token
                const { data } = await axios.post<RefreshResponse>(
                    appConfig.backendBaseURL + appConfig.endpoints.refreshToken,
                    form
                );

                // Store the new tokens using proper typing
                token = data.access;
                storeAccessToken(token);
                storeRefreshToken(data.refresh);

                console.log('Successfully refreshed access token');
            } catch (error) {
                console.error('Failed to fetch token:', error);
                return Promise.reject('Authentication failed');
            }
        }

        // Add token to request if we have one
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor - handle 401 unauthorized errors
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        // Check if error is due to unauthorized access (401)
        if (error.response && error.response.status === 401) {
            // Clear any existing tokens
            storeAccessToken('');
            storeRefreshToken('');

            // Alert user and redirect to login page with callback URL
            alert('Your session has expired. Please login again.');

            // Create URL object with login path and current location as callback
            const url = new URL(appConfig.routePaths.login, window.location.origin);
            url.searchParams.set(appConfig.callbackUrlName, window.location.pathname + window.location.search);

            // Redirect to login with callback URL
            window.location.href = url.toString();
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;