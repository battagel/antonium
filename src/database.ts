import { openDB, DBSchema } from 'idb';

interface AntoniumDB extends DBSchema {
  acronyms: {
    value: {
      definition: string;
      reference: string;
    };
    key: string;
  };
}

export async function demo() {
  console.log("Demo function");
  const db = await openDB<AntoniumDB>('ant_db', 1, {
    upgrade(db) {
      console.log("Upgrade needed");
      // db.deleteObjectStore('acronyms');
      db.createObjectStore('acronyms');
      console.log("Creating object store");
      const acronymStore = db.createObjectStore('acronyms', {
        keyPath: 'acronym',
      });
    },
  });
  console.log("Completed demo function");
  await db.put('acronyms', {definition: 'Hewlett Packard Enterprise', reference: 'hpe.com'}, 'HPE',);
  console.log('Put complete!')
  return db;
}