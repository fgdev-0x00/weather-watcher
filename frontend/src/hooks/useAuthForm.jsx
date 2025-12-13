import { useState, useMemo } from 'react';

const useAuthForm = (initialValues, validators = {}) => {
  const [form, setForm] = useState(initialValues);
  const [touched, setTouched] = useState({});

  const handleChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (name) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const errors = useMemo(() => {
    const errs = {};

    for (const field in validators) {
      const value = form[field];
      const rules = validators[field] || [];

      for (const rule of rules) {
        const error = rule(value, form);
        if (error) {
          errs[field] = error;
          break;
        }
      }
    }

    return errs;
  }, [form, validators]);

  const isValid = Object.keys(errors).length === 0;

  return {
    form,
    errors,
    isValid,
    touched,
    handleChange,
    handleBlur,
    setForm,
  };
}

export default useAuthForm;