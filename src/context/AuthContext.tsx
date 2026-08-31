import React, { createContext, useContext, useState, useEffect } from 'react';
import type { OfficerUser, OfficerRole, Permission } from '../types/auth';
import { DEMO_ACCOUNTS, ROLE_PERMISSIONS } from '../config/demoUsers';

interface AuthContextType {
  user: OfficerUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, rememberDevice?: boolean) => Promise<{ success: boolean; error?: string }>;
  quickLogin: (role: OfficerRole) => void;
  logout: () => void;
  hasRole: (role: OfficerRole | OfficerRole[]) => boolean;
  hasPermission: (permission: Permission | Permission[]) => boolean;
}

const STORAGE_KEY = 'kshetra_auth_session';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<OfficerUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load session from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as OfficerUser;
        setUser(parsed);
      }
    } catch (e) {
      console.error('Failed to parse auth session:', e);
      localStorage.removeItem(STORAGE_KEY);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (
    email: string,
    password: string,
    _rememberDevice: boolean = true
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    await new Promise((res) => setTimeout(res, 400)); // Simulate async auth check

    const normalizedEmail = email.trim().toLowerCase();
    const account = DEMO_ACCOUNTS.find(
      (acc) => acc.email.toLowerCase() === normalizedEmail || acc.id.toLowerCase() === normalizedEmail
    );

    if (!account) {
      setIsLoading(false);
      return {
        success: false,
        error: 'Invalid Official Government Email or Officer ID. Please use a valid SIH demo account credential.',
      };
    }

    if (account.passwordHash !== password) {
      setIsLoading(false);
      return {
        success: false,
        error: 'Incorrect Password. Please check credential or select from SIH 2026 Demo Access panel.',
      };
    }

    const { passwordHash: _, ...officerData } = account;
    setUser(officerData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(officerData));
    setIsLoading(false);

    return { success: true };
  };

  const quickLogin = (role: OfficerRole) => {
    const account = DEMO_ACCOUNTS.find((acc) => acc.role === role) || DEMO_ACCOUNTS[0];
    const { passwordHash: _, ...officerData } = account;
    setUser(officerData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(officerData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const hasRole = (role: OfficerRole | OfficerRole[]): boolean => {
    if (!user) return false;
    if (Array.isArray(role)) {
      return role.includes(user.role);
    }
    return user.role === role;
  };

  const hasPermission = (permission: Permission | Permission[]): boolean => {
    if (!user) return false;
    const userPermissions = ROLE_PERMISSIONS[user.role] || [];

    if (Array.isArray(permission)) {
      return permission.every((p) => userPermissions.includes(p));
    }
    return userPermissions.includes(permission);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        quickLogin,
        logout,
        hasRole,
        hasPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
