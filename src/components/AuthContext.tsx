import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  user: { email: string } | null;
  token: string | null;
  loading: boolean;
  login: (email: string, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('teaserai_token');
    const savedEmail = localStorage.getItem('teaserai_email');
    if (savedToken && savedEmail) {
      setToken(savedToken);
      setUser({ email: savedEmail });
    }
    setLoading(false);
  }, []);

  const login = (email: string, newToken: string) => {
    localStorage.setItem('teaserai_token', newToken);
    localStorage.setItem('teaserai_email', email);
    setToken(newToken);
    setUser({ email });
  };

  const logout = () => {
    localStorage.removeItem('teaserai_token');
    localStorage.removeItem('teaserai_email');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
