import { Link } from 'react-router-dom';
import Button from './Button';
import LogoBanner from './LogoBanner';

export default function AuthForm({
  title,
  action,
  form,
  errors,
  touched,
  handleChange,
  handleBlur,
  onSubmit,
  isFormValid,
  loading,
  buttonText,
  loadingText,
  footerText,
  footerLink,
  footerLinkText,
}) {

  const handleFormSubmit = (e) => {
    if (!isFormValid || loading) {
      e.preventDefault();
      return;  
    }

    onSubmit(e);
  };

  return (
    <div className="h-full flex flex-col justify-center items-center p-8 bg-white">
      <div className="w-full max-w-sm text-center">

        <LogoBanner />

        <h1 className="text-3xl font-light mb-10">
          {title}
        </h1>

        <form onSubmit={handleFormSubmit} className="space-y-6">
          <div>
            <input
              placeholder="Username"
              value={form.username}
              onChange={(e) => handleChange('username', e.target.value)}
              onBlur={() => handleBlur('username')}
              className="w-full p-3 border-b-2 border-gray-200 focus:border-indigo-600 outline-none"
            />

            {touched?.username && errors?.username && (
              <p className="mt-1 text-sm text-red-500">
                {errors.username}
              </p>
            )}
          </div>

          <div>
            <input
              type="password"
              placeholder="Contraseña"
              value={form.password}
              onChange={(e) => handleChange('password', e.target.value)}
              onBlur={() => handleBlur('password')}
              className="w-full p-3 border-b-2 border-gray-200 focus:border-indigo-600 outline-none"
            />
            {action == "signup" && (
              <p className="mt-1 text-sm text-gray-500">
                Minimo 8 caracteres
              </p>
            )}


            {touched?.password && errors?.password && (
              <p className="mt-1 text-sm text-red-500">
                {errors.password}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={!isFormValid || loading}
          >
            {loading ? loadingText : buttonText}
          </Button>
        </form>

        <Link
          to={footerLink}
          className="mt-8 text-sm text-gray-500 hover:text-indigo-600 inline-block"
        >
          {footerText}{' '}
          <span className="font-medium">
            {footerLinkText}
          </span>
        </Link>
      </div>
    </div>
  );
}