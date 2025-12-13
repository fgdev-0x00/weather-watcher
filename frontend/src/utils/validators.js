export const required = (msg = 'Campo requerido') => (value) =>
  !value || !value.trim() ? msg : null;

export const minLength = (len, msg) => (value) =>
  value && value.length < len ? msg : null;

// Ejemplos futuros:
export const isEmail = (msg = 'Email inválido') => (value) =>
  value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? msg : null;

export const matchField = (field, msg) => (value, form) =>
  value !== form[field] ? msg : null;
