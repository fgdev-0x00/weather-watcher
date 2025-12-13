import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import useAuthForm from '../hooks/useAuthForm';
import { authService } from '../services/auth.service';
import { useNotify } from '../context/NotifyContext';
import { required, minLength } from '../utils/validators';

export default function Signup() {
  const navigate = useNavigate();
  const notify = useNotify();
  const [loading, setLoading] = useState(false);

  // 🧠 Hook de formulario (ESCALABLE)
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
      password: [required(), minLength(8, 'Mínimo 8 caracteres')],
    }
  );

  // 📤 Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) return;

    try {
      setLoading(true);
      await authService.register(form);
      notify.success('Cuenta creada correctamente');
      navigate('/login');
    } catch (err) {
      notify.error('Error al crear la cuenta');
    } finally {
      setLoading(false);
    }
  };

  // 🎨 UI
  return (
    <AuthForm
      title="Crear Cuenta"
      form={form}
      errors={errors}
      touched={touched}
      handleChange={handleChange}
      handleBlur={handleBlur}
      onSubmit={handleSubmit}
      isFormValid={isValid}
      loading={loading}
      buttonText="Crear cuenta"
      loadingText="Creando cuenta..."
      footerText="¿Ya tienes cuenta?"
      footerLink="/login"
      footerLinkText="Inicia Sesión"
    />
  );
}
