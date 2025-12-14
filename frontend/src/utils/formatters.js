// src/utils/formatters.js

/**
 * Formatea una cadena a Title Case (Primera Letra de Cada Palabra en Mayúscula).
 * @param {string} str La cadena a formatear (ej: "ciudad de mexico").
 * @returns {string} La cadena formateada (ej: "Ciudad De Mexico").
 */
export const toTitleCase = (str) => {
    if (!str) return '';
    return str
        .toLowerCase()
        .split(' ') // Divide la cadena por espacios
        .map(word => 
            // Capitaliza la primera letra de cada palabra
            word.charAt(0).toUpperCase() + word.slice(1)
        )
        .join(' '); // Vuelve a unir las palabras con espacios
};