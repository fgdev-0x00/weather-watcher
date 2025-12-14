import { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '../services/auth.service';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      setLoading(false);
      return;
    }

    authService
      .getUser()
      .then((res) => {
        setUser(res.data); 
      })
      .catch((error) => {
        console.error("Token inválido o expirado:", error);
        localStorage.removeItem('token');
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (username, password) => {
    setLoading(true);

    try {
      const res = await authService.login({ username, password });
      const token = res.data.token; 

      localStorage.setItem('token', token);

      const userRes = await authService.getUser();
      setUser(userRes.data);
      

    } catch (error) {
      localStorage.removeItem('token');
      setUser(null);
      
      throw error; 
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children} 
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}