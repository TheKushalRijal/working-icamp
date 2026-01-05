import SQLite from 'react-native-sqlite-storage';

SQLite.enablePromise(true);

const dbPromise = SQLite.openDatabase({
  name: 'events.db',
  location: 'default',
});

export const initEventDB = async () => {
  const db = await dbPromise;
  await db.executeSql(`
    CREATE TABLE IF NOT EXISTS event (
      id INTEGER PRIMARY KEY,
      title TEXT,
      description TEXT
    );
  `);
  return db;
};

export const getAllEvents = async () => {
  const db = await dbPromise;
  const [res] = await db.executeSql(
    `SELECT * FROM event ORDER BY id DESC`
  );

  const events = [];
  for (let i = 0; i < res.rows.length; i++) {
    events.push(res.rows.item(i));
  }
  return events;
};

export const getLatestEventId = async () => {
  const db = await dbPromise;
  const [res] = await db.executeSql(
    `SELECT MAX(id) as maxId FROM event`
  );
  return res.rows.item(0).maxId || 0;
};

export const saveEvents = async (events: Event[]) => {
  if (!events.length) return;

  const db = await dbPromise;
  await db.transaction(tx => {
    events.forEach(e => {
      tx.executeSql(
        `INSERT OR REPLACE INTO event (id, title, description)
         VALUES (?, ?, ?)`,
        [e.id, e.title, e.description]
      );
    });
  });
};
