import SQLite from 'react-native-sqlite-storage';

// IMPORTANT: must match your existing DB name
const DB_NAME = 'university.db';

type SyncMetaMap = Record<string, string>;

const openDB = () =>
  SQLite.openDatabase(
    { name: DB_NAME, location: 'default' },
    () => {},
    (err) => console.log('DB open error:', err)
  );

/** Read all sync keys + timestamps from sync_meta */
export const getLocalSyncMeta = (): Promise<SyncMetaMap> => {
  return new Promise((resolve, reject) => {
    const db = openDB();

    db.transaction(
      (tx) => {
        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS sync_meta (
            key TEXT PRIMARY KEY,
            last_updated TEXT
          );`
        );

        tx.executeSql(
          `SELECT key, last_updated FROM sync_meta`,
          [],
          (_, res) => {
            const meta: SyncMetaMap = {};
            for (let i = 0; i < res.rows.length; i++) {
              const row = res.rows.item(i);
              meta[row.key] = row.last_updated;
            }
            resolve(meta);
          },
          (_, err) => {
            reject(err);
            return false;
          }
        );
      },
      (txErr) => reject(txErr)
    );
  });
};

/** Send local sync_meta to backend and return backend response */
export const sendSyncMetaToBackend = (
  baseUrl: string
): Promise<any> => {
  return getLocalSyncMeta().then((localMeta) => {
    return fetch(`${baseUrl}/sync/check`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_last_updated: localMeta,
      }),
    }).then(async (res) => {
      const text = await res.text();
      try {
        return JSON.parse(text);
      } catch {
        // if backend returns plain 0
        return text === '0' ? 0 : text;
      }
    });
  });
};
