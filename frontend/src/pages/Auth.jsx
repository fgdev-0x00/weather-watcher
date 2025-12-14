// src/pages/Auth.jsx
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotify } from '../context/NotifyContext';
import { required } from '../utils/validators';
import useAuthForm from '../hooks/useAuthForm'; // Asumo que este hook existe
import AuthForm from '../components/AuthForm'; // Asumo que este componente existe

export default function Auth() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const notify = useNotify(); // Asumo que este hook existe

  const {
    form,
    errors,
    touched,
    isValid,
    handleChange,
    handleBlur,
  } = useAuthForm(
    { username: '', password: '' },
    {
      username: [required()],
      password: [required()],
    }
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) return;

    try {
      await login(form.username, form.password);
      
      // 💡 Navegación: SOLO se ejecuta si el 'await login' fue exitoso.
      navigate('/dashboard'); 
      
      notify.success('¡Bienvenido!');
    } catch (error) {
      // 💡 Capturamos el error lanzado desde AuthContext.login
      // Si el error tiene una propiedad 'message' de la API, la usamos.
      const errorMessage = error.message || 'Credenciales inválidas o error de conexión.';
      
      notify.error(errorMessage);
    }
  };

  return (
    <AuthForm
      title="Iniciar Sesión"
      form={form}
      errors={errors}
      touched={touched}
      handleChange={handleChange}
      handleBlur={handleBlur}
      onSubmit={handleSubmit}
      isFormValid={isValid}
      loading={loading}
      buttonText="Iniciar Sesión"
      loadingText="Iniciando sesión..."
      footerText="¿No tienes cuenta?"
      footerLink="/signup"
      footerLinkText="Regístrate"
    />
  );
}