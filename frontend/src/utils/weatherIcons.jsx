import { Sun, CloudRain, CloudSun, Cloud, Zap } from 'lucide-react';

export const getWeatherIcon = (condition, baseClassName = "w-12 h-12 text-indigo-500 mb-6") => {
    condition = condition.toLowerCase();
    
    const UNIFORM_COLOR_CLASS = 'text-gray-500';

    const getFinalClassName = () => {
        return baseClassName.replace(/text-\w+-\d{3}/, UNIFORM_COLOR_CLASS);
    };

    const finalClassName = getFinalClassName();

    if (condition.includes('claro') || condition.includes('soleado')) {
        return <Sun className={finalClassName} />; 
    }
    
    if (condition.includes('lluvia') || condition.includes('chubascos') || condition.includes('moderada')) {
        return <CloudRain className={finalClassName} />; 
    }

    if (condition.includes('tormenta') || condition.includes('eléctrica')) {
        return <Zap className={finalClassName} />;
    }

    if (condition.includes('dispersas') || condition.includes('algo de nubes')) {
        return <CloudSun className={finalClassName} />;
    }
    
    if (condition.includes('nuboso') || condition.includes('nubes') || condition.includes('cubierto')) {
        return <Cloud className={finalClassName} />;
    }

    return <Cloud className={finalClassName} />;
};