import { createContext, useContext, useState } from 'react';

import Toast from '../components/Toast';

const NotifyContext = createContext(null);

export function NotifyProvider({ children }) {
  const [notification, setNotification] = useState(null);

  const show = (type, message, timeout = 3000) => {
    setNotification({ type, message });

    setTimeout(() => {
      setNotification(null);
    }, timeout);
  };

  const notify = {
    success: (msg) => show('success', msg),
    error: (msg) => show('error', msg),
    info: (msg) => show('info', msg),
  };

  return (
    <NotifyContext.Provider value={notify}>
      {children}
      {notification && <Toast {...notification} />}
    </NotifyContext.Provider>
  );
}

export function useNotify() {
  return useContext(NotifyContext);
}
