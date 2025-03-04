
import { AuthUser } from './types';

export const AUTH_STORAGE_KEY = 'fuelninja-auth';

export const getStoredUser = (): AuthUser | null => {
  const storedUser = localStorage.getItem(AUTH_STORAGE_KEY);
  if (storedUser) {
    try {
      return JSON.parse(storedUser);
    } catch (e) {
      console.error('Error parsing auth data:', e);
      return null;
    }
  }
  return null;
};

export const storeUser = (user: AuthUser): void => {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
};

export const removeStoredUser = (): void => {
  localStorage.removeItem(AUTH_STORAGE_KEY);
};

export const isUserAdmin = (user: AuthUser | null): boolean => {
  return user?.role === 'admin';
};
