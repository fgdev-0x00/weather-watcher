// src/utils/LocalCache.js

import * as fs from 'fs';
import * as path from 'path';

// ============================================
// CONFIGURACIÓN DE PERSISTENCIA
// ============================================
const CACHE_FILE_PATH = path.join(process.cwd(), 'local_cache_store.json');
// Un retraso pequeño para evitar escrituras excesivas y agrupar las peticiones rápidas
const WRITE_DELAY_MS = 500; 
let writeTimeout = null;

/**
 * Almacenamiento local en memoria (Map)
 * Key: string, Value: { data: any, expiresAt: number }
 */
const cacheStore = new Map();

// La duración por defecto de la caché (10 minutos * 60 segundos * 1000 ms)
const DEFAULT_TTL_MS = 10 * 60 * 1000;

// ============================================
// FUNCIONES DE PERSISTENCIA
// ============================================

/**
 * Carga el estado de la caché desde el archivo JSON al inicio.
 */
const loadCacheFromFile = () => {
    if (!fs.existsSync(CACHE_FILE_PATH)) {
        console.log(`[Cache] Archivo no encontrado. Iniciando caché vacía.`);
        return;
    }

    try {
        const fileContent = fs.readFileSync(CACHE_FILE_PATH, 'utf8');
        const rawObject = JSON.parse(fileContent);
        
        // Reconstruye el Map desde el objeto cargado
        for (const [key, value] of Object.entries(rawObject)) {
            // Se cargan todos, el chequeo de expiración ocurre en getCache/hasCache
            cacheStore.set(key, value);
        }
        console.log(`[Cache] Cargados ${cacheStore.size} elementos desde el archivo.`);

        // Opcional: Limpieza inmediata de elementos expirados al cargar
        // cleanExpiredEntries(); 

    } catch (error) {
        console.error(`[Cache Error] Error al cargar el caché: ${error.message}`);
    }
};

/**
 * Guarda el estado actual de la caché en el archivo JSON.
 * Utiliza un retardo (debounce) para optimizar escrituras.
 */
const saveCacheToFile = () => {
    // Si ya hay un proceso de guardado pendiente, lo cancelamos.
    if (writeTimeout) {
        clearTimeout(writeTimeout);
    }
    
    // Programamos un nuevo guardado después de un breve retraso
    writeTimeout = setTimeout(() => {
        try {
            // Convertir el Map a un objeto plano para JSON
            const plainObject = Object.fromEntries(cacheStore);
            
            // Escribir en el archivo de forma sincrónica (para simplicidad y seguridad)
            fs.writeFileSync(CACHE_FILE_PATH, JSON.stringify(plainObject, null, 2), 'utf8');
            
            if (process.env.NODE_ENV !== 'production') {
                console.log(`[Cache] Estado guardado en ${CACHE_FILE_PATH}`);
            }
        } catch (error) {
            console.error(`[Cache Error] Error al guardar el caché: ${error.message}`);
        }
    }, WRITE_DELAY_MS);
};

// ============================================
// LÓGICA DE LA CACHÉ
// ============================================

/**
 * Verifica si un elemento en caché ha expirado.
 */
const isExpired = (item) => {
    return item.expiresAt < Date.now();
};

/**
 * Establece un valor en la caché con un TTL y **activa el guardado**.
 */
export const setCache = (key, data, ttlMs = DEFAULT_TTL_MS) => {
    const expiresAt = Date.now() + ttlMs;
    cacheStore.set(key, { data, expiresAt });
    
    // 💡 Persistencia: Activar el guardado después de modificar
    saveCacheToFile(); 

    if (process.env.NODE_ENV !== 'production') {
        console.log(`[Cache] SET: ${key}. Expira en ${ttlMs / 1000}s.`);
    }
};

/**
 * Obtiene un valor de la caché. Si está expirado, lo elimina y retorna null.
 */
export const getCache = (key) => {
    const cachedItem = cacheStore.get(key);

    if (!cachedItem) {
        return null;
    }

    if (isExpired(cachedItem)) {
        // Expiró: eliminarlo y activar guardado
        cacheStore.delete(key);
        saveCacheToFile(); // Persistencia: Guardar el cambio de eliminación
        
        if (process.env.NODE_ENV !== 'production') {
            console.log(`[Cache] EXPIRED & DELETED: ${key}`);
        }
        return null;
    }

    return cachedItem.data;
};

/**
 * Verifica si una clave existe y es válida (no expirada) en la caché.
 */
export const hasCache = (key) => {
    const cachedItem = cacheStore.get(key);

    if (!cachedItem) {
        return false;
    }

    if (isExpired(cachedItem)) {
        // Expiró: limpiamos la clave y activamos guardado
        cacheStore.delete(key);
        saveCacheToFile(); // Persistencia: Guardar el cambio de eliminación
        return false;
    }

    return true;
};

/**
 * Elimina una clave de la caché y **activa el guardado**.
 */
export const deleteCache = (key) => {
    if (cacheStore.delete(key)) {
        saveCacheToFile(); // Persistencia: Guardar solo si se eliminó algo
    }
    if (process.env.NODE_ENV !== 'production') {
        console.log(`[Cache] DELETED: ${key}`);
    }
};

// ============================================
// INICIALIZACIÓN
// ============================================
// ⚠️ Importante: Cargar la caché al cargar el módulo
loadCacheFromFile(); 

export const CACHE_TTL = DEFAULT_TTL_MS;