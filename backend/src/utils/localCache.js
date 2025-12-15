import * as fs from 'fs';
import * as path from 'path';

const CACHE_FILE_PATH = path.join(process.cwd(), 'local_cache_store.json');
const WRITE_DELAY_MS = 500; 
let writeTimeout = null;

const cacheStore = new Map();
const DEFAULT_TTL_MS = 10 * 60 * 1000;

const loadCacheFromFile = () => {
    if (!fs.existsSync(CACHE_FILE_PATH)) {
        console.log(`[Cache] Archivo no encontrado. Iniciando caché vacía.`);
        return;
    }

    try {
        const fileContent = fs.readFileSync(CACHE_FILE_PATH, 'utf8');
        const rawObject = JSON.parse(fileContent);
        
        for (const [key, value] of Object.entries(rawObject)) {
            cacheStore.set(key, value);
        }
        console.log(`[Cache] Cargados ${cacheStore.size} elementos desde el archivo.`);

    } catch (error) {
        console.error(`[Cache Error] Error al cargar el caché: ${error.message}`);
    }
};

const saveCacheToFile = () => {
    if (writeTimeout) {
        clearTimeout(writeTimeout);
    }
    
    writeTimeout = setTimeout(() => {
        try {
            const plainObject = Object.fromEntries(cacheStore);
            
            fs.writeFileSync(CACHE_FILE_PATH, JSON.stringify(plainObject, null, 2), 'utf8');
            
            if (process.env.NODE_ENV !== 'production') {
                console.log(`[Cache] Estado guardado en ${CACHE_FILE_PATH}`);
            }
        } catch (error) {
            console.error(`[Cache Error] Error al guardar el caché: ${error.message}`);
        }
    }, WRITE_DELAY_MS);
};

const isExpired = (item) => {
    return item.expiresAt < Date.now();
};

export const setCache = (key, data, ttlMs = DEFAULT_TTL_MS) => {
    const expiresAt = Date.now() + ttlMs;
    cacheStore.set(key, { data, expiresAt });
    
    saveCacheToFile(); 

    if (process.env.NODE_ENV !== 'production') {
        console.log(`[Cache] SET: ${key}. Expira en ${ttlMs / 1000}s.`);
    }
};

export const getCache = (key) => {
    const cachedItem = cacheStore.get(key);

    if (!cachedItem) {
        return null;
    }

    if (isExpired(cachedItem)) {
        cacheStore.delete(key);
        saveCacheToFile();
        
        if (process.env.NODE_ENV !== 'production') {
            console.log(`[Cache] EXPIRED & DELETED: ${key}`);
        }
        return null;
    }

    return cachedItem.data;
};

export const hasCache = (key) => {
    const cachedItem = cacheStore.get(key);

    if (!cachedItem) {
        return false;
    }

    if (isExpired(cachedItem)) {
        cacheStore.delete(key);
        saveCacheToFile();
        return false;
    }

    return true;
};

export const deleteCache = (key) => {
    if (cacheStore.delete(key)) {
        saveCacheToFile();
    }
    if (process.env.NODE_ENV !== 'production') {
        console.log(`[Cache] DELETED: ${key}`);
    }
};

loadCacheFromFile(); 

export const CACHE_TTL = DEFAULT_TTL_MS;