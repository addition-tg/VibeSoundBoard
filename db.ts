import { openDB, DBSchema } from 'idb';

interface SoundboardDB extends DBSchema {
  sounds: {
    key: string;
    value: File | Blob;
  };
}

const DB_NAME = 'soundboard-db';
const DB_VERSION = 1;
const STORE_NAME = 'sounds';

const dbPromise = openDB<SoundboardDB>(DB_NAME, DB_VERSION, {
  upgrade(db) {
    if (!db.objectStoreNames.contains(STORE_NAME)) {
      db.createObjectStore(STORE_NAME);
    }
  },
});

export const getSound = async (key: string) => {
  return (await dbPromise).get(STORE_NAME, key);
};

export const setSound = async (key: string, val: File | Blob) => {
  return (await dbPromise).put(STORE_NAME, val, key);
};

export const clearSounds = async () => {
  return (await dbPromise).clear(STORE_NAME);
};
