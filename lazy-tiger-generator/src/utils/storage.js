const getStorage = (type = 'session') => {
    try {
        const storage = type === 'session' ? window.sessionStorage : window.localStorage;
        const x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return storage;
    } catch (e) {
        return null;
    }
};

const sessionStorageWrapper = {
    getItem: (key) => {
        const storage = getStorage('session');
        if (storage) return storage.getItem(key);
        // Fallback or just return null
        return window.__sessionData ? window.__sessionData[key] : null;
    },
    setItem: (key, value) => {
        const storage = getStorage('session');
        if (storage) {
            storage.setItem(key, value);
        } else {
            if (!window.__sessionData) window.__sessionData = {};
            window.__sessionData[key] = value;
        }
    },
    removeItem: (key) => {
        const storage = getStorage('session');
        if (storage) {
            storage.removeItem(key);
        } else {
            if (window.__sessionData) delete window.__sessionData[key];
        }
    }
};

const localStorageWrapper = {
    getItem: (key) => {
        const storage = getStorage('local');
        if (storage) return storage.getItem(key);
        return window.__localData ? window.__localData[key] : null;
    },
    setItem: (key, value) => {
        const storage = getStorage('local');
        if (storage) {
            storage.setItem(key, value);
        } else {
            if (!window.__localData) window.__localData = {};
            window.__localData[key] = value;
        }
    },
    removeItem: (key) => {
        const storage = getStorage('local');
        if (storage) {
            storage.removeItem(key);
        } else {
            if (window.__localData) delete window.__localData[key];
        }
    }
};

export { sessionStorageWrapper as sessionStorage, localStorageWrapper as localStorage };
