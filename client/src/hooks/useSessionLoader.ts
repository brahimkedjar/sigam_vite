// src/hooks/useSessionLoader.ts
'use client';
import { useEffect } from 'react';
import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';

export function useSessionLoader() {
  const initialize = useAuthStore((s) => s.initialize);
  const setLoaded = () => useAuthStore.setState({ isLoaded: true });
  const apiURL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const load = async () => {
      try {
        // Use the verify endpoint instead of /auth/me
        const token = useAuthStore.getState().auth.token;
        
        if (token) {
          const res = await axios.post(`${apiURL}/auth/verify`, 
            { token },
            { withCredentials: true }
          );
          
          // Update the store with verified user data
          useAuthStore.setState({
            auth: {
              token,
              id: res.data.user.id,
              username: res.data.user.username,
              email: res.data.user.email,
              role: res.data.user.role,
              permissions: res.data.user.permissions,
            },
            isLoaded: true
          });
        }
      } catch (err) {
        console.warn('⚠️ Session verification failed', err);
        // Clear invalid session
        useAuthStore.setState({
          auth: {
            token: null,
            id: null,
            username: null,
            email: null,
            role: null,
            permissions: [],
          },
          isLoaded: true
        });
      } finally {
        setLoaded();
      }
    };

    load();
  }, []);
}