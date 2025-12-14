// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '../services/auth.service';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Inicializamos en true

  // 🔁 Al cargar la app, si hay token → obtener usuario
  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      setLoading(false); // Si no hay token, terminamos la carga
      return;
    }

    // Obtener usuario con el token existente
    authService
      .getUser()
      .then((res) => {
        // La respuesta 'res' es { success: true, data: userObject }
        setUser(res.data); 
      })
      .catch((error) => {
        // Si el token es inválido (401), limpia el almacenamiento
        console.error("Token inválido o expirado:", error);
        localStorage.removeItem('token');
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (username, password) => {
    setLoading(true);

    try {
      // 1. Llamar al login: res = { success: true, data: { token: '...' } }
      const res = await authService.login({ username, password });
      
      // Acceder al token dentro de la propiedad 'data' de la respuesta exitosa
      const token = res.data.token; 

      localStorage.setItem('token', token);

      // 2. Obtener datos del usuario con el nuevo token
      const userRes = await authService.getUser();
      setUser(userRes.data);
      
      // Si todo fue exitoso, no lanzamos error.

    } catch (error) {
      // Si hay error (ej. 401 de credenciales inválidas), limpiamos por seguridad
      localStorage.removeItem('token');
      setUser(null);
      
      // 💡 RE-LANZAR el error para que la vista (Auth.jsx) lo capture y notifique.
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
      {/* Muestra children solo cuando la carga inicial ha terminado */}
      {children} 
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}