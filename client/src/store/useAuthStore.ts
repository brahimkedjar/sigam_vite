// src/store/useAuthStore.ts
'use client';

import { create, type StoreApi } from 'zustand';
import type { UseBoundStore } from 'zustand';
import axios from 'axios';

interface AuthData {
  token: string | null;
  id: number | null;
  username: string | null;
  email: string | null;
  role: string | null;
  permissions: string[];
}

const emptyAuthState: AuthData = {
  token: null,
  id: null,
  username: null,
  email: null,
  role: null,
  permissions: [],
};

interface AuthStore {
  auth: AuthData;
  isLoaded: boolean;
  login: (data: { token: string; user: Omit<AuthData, 'token'> }) => void;
  logout: () => Promise<void>;
  initialize: () => Promise<void>;
  hasPermission: (perm: string) => boolean;
}

const apiURL = process.env.NEXT_PUBLIC_API_URL;

function readAuthFromStorage(): AuthData | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const raw = window.localStorage.getItem('auth');
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw);
    return {
      token: parsed.token ?? null,
      id: parsed.id ?? null,
      username: parsed.username ?? null,
      email: parsed.email ?? null,
      role: parsed.role ?? null,
      permissions: Array.isArray(parsed.permissions) ? parsed.permissions : [],
    };
  } catch (error) {
    console.warn('Failed to read auth from storage', error);
    return null;
  }
}

// Ensure a single global store instance across any module duplication
// (e.g. mixed import paths, dynamic chunks). This guards against state
// resets where different parts of the app see different stores.
type BoundStore = UseBoundStore<StoreApi<AuthStore>>;

function createAuthStore(): BoundStore {
  return create<AuthStore>((set, get) => ({
    auth: { ...emptyAuthState },
    isLoaded: false,

    login: (data) => {
      const newAuth = {
        token: data.token,
        id: data.user.id,
        username: data.user.username,
        email: data.user.email,
        role: data.user.role,
        permissions: data.user.permissions,
      };

      if (typeof window !== 'undefined') {
        window.localStorage.setItem('auth', JSON.stringify(newAuth));
      }

      set({ auth: newAuth, isLoaded: true });
    },

    logout: async () => {
      const { token } = get().auth;
      try {
        await axios.post(`${apiURL}/auth/logout`, {}, { withCredentials: true });
      } catch (error) {
        console.error('Logout error:', error);
      }

      if (typeof window !== 'undefined') {
        window.localStorage.removeItem('auth');
      }

      set({
        auth: { ...emptyAuthState },
        isLoaded: true,
      });

      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
    },

    initialize: async () => {
      let authState = get().auth;

      if (!authState.token) {
        const stored = readAuthFromStorage();
        if (stored) {
          authState = stored;
          set({ auth: stored });
        }
      }

      const token = authState.token;

      if (!token) {
        set({ isLoaded: true });
        return;
      }

      try {
        const response = await axios.post(
          `${apiURL}/auth/verify`,
          { token },
          { withCredentials: true }
        );

        if (response.data?.user) {
          const updatedAuth = {
            token,
            id: response.data.user.id,
            username: response.data.user.username,
            email: response.data.user.email,
            role: response.data.user.role,
            permissions: response.data.user.permissions,
          };

          if (typeof window !== 'undefined') {
            window.localStorage.setItem('auth', JSON.stringify(updatedAuth));
          }

          set({ auth: updatedAuth, isLoaded: true });
          return;
        }
      } catch (error) {
        console.warn('Token verification failed, clearing session');
        if (typeof window !== 'undefined') {
          window.localStorage.removeItem('auth');
        }

        set({
          auth: { ...emptyAuthState },
          isLoaded: true,
});
}

      set({ isLoaded: true });
    },

    hasPermission: (perm) => {
      const { permissions } = get().auth;
      return Array.isArray(permissions) && permissions.includes(perm);
    },
  }));
}

declare global {
  interface Window {
    __SIGAM_AUTH_STORE__?: BoundStore;
  }
}

export const useAuthStore: BoundStore = ((): BoundStore => {
  if (typeof window === 'undefined') {
    return createAuthStore();
  }
  if (!window.__SIGAM_AUTH_STORE__) {
    window.__SIGAM_AUTH_STORE__ = createAuthStore();
  }
  return window.__SIGAM_AUTH_STORE__;
})();
