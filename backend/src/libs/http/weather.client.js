import { createHttpClient } from './client.js'; // Ajusta la ruta a donde guardaste el archivo

// 1. Cliente para la API de Usuarios
export const weatherClient = createHttpClient({
  baseURL: 'https://api.openweathermap.org/data/2.5',
  // Opcional: headers específicos para esta API
});
