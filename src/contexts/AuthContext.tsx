import React, { createContext, useContext } from 'react';

interface UserProfile {
  name: string;
  email: string;
  photoURL: string;
  condition: string;
  createdAt: any;
}

interface AuthContextType {
  user: { uid: string; email: string; displayName: string; photoURL: string } | null;
  profile: UserProfile | null;
  loading: boolean;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const mockUser = {
  uid: 'local-user-123',
  email: 'user@example.com',
  displayName: 'Local User',
  photoURL: ''
};

const mockProfile = {
  name: 'Local User',
  email: 'user@example.com',
  photoURL: '',
  condition: 'None',
  createdAt: new Date().toISOString()
};

const AuthContext = createContext<AuthContextType>({
  user: mockUser,
  profile: mockProfile,
  loading: false,
  logout: async () => {},
  refreshProfile: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <AuthContext.Provider value={{ user: mockUser, profile: mockProfile, loading: false, logout: async () => {}, refreshProfile: async () => {} }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
