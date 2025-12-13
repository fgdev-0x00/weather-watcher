import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotifyProvider } from './context/NotifyContext';

import Auth from './pages/Auth';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import CityDetail from './pages/CityDetail';
import AppContainer from './layouts/AppContainer';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <NotifyProvider>
      <AuthProvider>
        <AppContainer>
          <Routes>
            <Route path="/login" element={<Auth />} />
            <Route path="/signup" element={<Signup />} />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/city/:id"
              element={
                <ProtectedRoute>
                  <CityDetail />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </AppContainer>
      </AuthProvider>
    </NotifyProvider>
  );
}
