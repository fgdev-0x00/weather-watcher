// src/utils/weatherIcons.jsx
import { Sun, CloudRain, CloudSun, Cloud, Zap } from 'lucide-react';

/**
 * Retorna el componente Lucide React para la condición climática dada, 
 * utilizando un color uniforme (Gris 500) para mantener la limpieza y uniformidad de la UI.
 * * @param {string} condition El texto de la condición climática.
 * @param {string} baseClassName Clases Tailwind base (incluyendo tamaño y margen, ej: "w-5 h-5 mb-1 text-indigo-500").
 * @returns {JSX.Element} El componente icono de Lucide.
 */
export const getWeatherIcon = (condition, baseClassName = "w-12 h-12 text-indigo-500 mb-6") => {
    condition = condition.toLowerCase();
    
    // 💡 COLOR ÚNICO ELEGIDO: text-gray-500 (o usa 'text-indigo-400' si prefieres azul más claro)
    const UNIFORM_COLOR_CLASS = 'text-gray-500';

    // Función auxiliar para reemplazar la clase de color existente por la uniforme
    const getFinalClassName = () => {
        // Reemplaza cualquier clase de color de texto (text-X-Y) por el color uniforme.
        return baseClassName.replace(/text-\w+-\d{3}/, UNIFORM_COLOR_CLASS);
    };

    const finalClassName = getFinalClassName();

    // 1. ☀️ Cielo Claro / Soleado
    if (condition.includes('claro') || condition.includes('soleado')) {
        return <Sun className={finalClassName} />; 
    }
    
    // 2. 🌧️ Lluvia / Chubascos
    if (condition.includes('lluvia') || condition.includes('chubascos') || condition.includes('moderada')) {
        return <CloudRain className={finalClassName} />; 
    }

    // 3. 🌩️ Tormenta
    if (condition.includes('tormenta') || condition.includes('eléctrica')) {
        return <Zap className={finalClassName} />;
    }

    // 4. 🌥️ Nubes Dispersas / Algo de nubes / Parcialmente nublado
    if (condition.includes('dispersas') || condition.includes('algo de nubes')) {
        return <CloudSun className={finalClassName} />;
    }
    
    // 5. ☁️ Muy Nuboso / Nubes / Cubierto
    if (condition.includes('nuboso') || condition.includes('nubes') || condition.includes('cubierto')) {
        return <Cloud className={finalClassName} />;
    }

    // Por defecto 
    return <Cloud className={finalClassName} />;
};