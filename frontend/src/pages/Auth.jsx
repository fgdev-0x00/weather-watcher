import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotify } from '../context/NotifyContext';
import { required } from '../utils/validators';
import useAuthForm from '../hooks/useAuthForm';
import AuthForm from '../components/AuthForm';

export default function Auth() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const notify = useNotify();

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

      navigate('/dashboard'); 
      
      notify.success('¡Bienvenido!');
    } catch (error) {
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