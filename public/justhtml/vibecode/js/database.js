// IndexedDB Storage Module
const DB_NAME = 'VibeDevDB_v7';
const STORE_CHATS = 'chats';

const db = {
    open: () => new Promise((res, rej) => {
        const req = indexedDB.open(DB_NAME, 1);
        req.onupgradeneeded = (e) => {
            if (!e.target.result.objectStoreNames.contains(STORE_CHATS))
                e.target.result.createObjectStore(STORE_CHATS, { keyPath: 'id' });
        };
        req.onsuccess = () => res(req.result);
        req.onerror = () => rej(req.error);
    }),

    put: async (chat) => {
        const d = await db.open();
        return new Promise(res => {
            const tx = d.transaction(STORE_CHATS, 'readwrite');
            tx.objectStore(STORE_CHATS).put(chat);
            tx.oncomplete = () => res();
        });
    },

    getAll: async () => {
        const d = await db.open();
        return new Promise(res => {
            const req = d.transaction(STORE_CHATS, 'readonly').objectStore(STORE_CHATS).getAll();
            req.onsuccess = () => res(req.result);
        });
    },

    delete: async (id) => {
        const d = await db.open();
        return new Promise(res => {
            const tx = d.transaction(STORE_CHATS, 'readwrite');
            tx.objectStore(STORE_CHATS).delete(id);
            tx.oncomplete = () => res();
        });
    }
};

// Export for use in other modules
window.db = db;
