// lib/api-interceptor.ts
import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';

// Only patch on client side
if (typeof window !== 'undefined') {
  // Store original functions
  const originalFetch = window.fetch;
  const originalAxiosGet = axios.get;
  const originalAxiosPost = axios.post;
  const originalAxiosPut = axios.put;
  const originalAxiosDelete = axios.delete;

  axios.defaults.withCredentials = true;

  // Patch fetch
  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const auth = useAuthStore.getState().auth;
    
    const headers = {
      'Content-Type': 'application/json',
      'X-User-Id': auth?.id?.toString() || '',
      'X-User-Name': auth?.username || auth?.email || '',
      ...init?.headers,
    };

    return originalFetch(input, {
      ...init,
      headers,
    });
  };

  // Helper function to get auth headers
  const getAuthHeaders = () => {
    const auth = useAuthStore.getState().auth;
    return {
      'X-User-Id': auth?.id?.toString() || '',
      'X-User-Name': auth?.username || auth?.email || '',
    };
  };

  // Patch axios methods
  axios.get = function(url: string, config?: any) {
    const headers = {
      ...getAuthHeaders(),
      ...config?.headers,
    };

    return originalAxiosGet(url, {
      ...config,
      headers,
    });
  };

  axios.post = function(url: string, data?: any, config?: any) {
    const headers = {
      ...getAuthHeaders(),
      ...config?.headers,
    };

    return originalAxiosPost(url, data, {
      ...config,
      headers,
    });
  };

  axios.put = function(url: string, data?: any, config?: any) {
    const headers = {
      ...getAuthHeaders(),
      ...config?.headers,
    };

    return originalAxiosPut(url, data, {
      ...config,
      headers,
    });
  };

  axios.delete = function(url: string, config?: any) {
    const headers = {
      ...getAuthHeaders(),
      ...config?.headers,
    };

    return originalAxiosDelete(url, {
      ...config,
      headers,
    });
  };
}

export default function setupApiInterceptors() {
  // This function just needs to be imported to activate the patches
}