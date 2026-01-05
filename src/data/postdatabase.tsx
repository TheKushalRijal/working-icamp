import SQLite from 'react-native-sqlite-storage';

SQLite.enablePromise(true);

const dbPromise = SQLite.openDatabase({
  name: 'events.db',
  location: 'default',
});

/**
 * Matches Django Post model
 */
export interface PostEntity {
  id: number;
  title: string;
  description: string;

}

/**
 * Initialize Post table
 */
export const initPostDB = async () => {
  const db = await dbPromise;

  await db.executeSql(`
    CREATE TABLE IF NOT EXISTS post (
      id INTEGER PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,

    );
  `);

  return db;
};

/**
 * Get all posts (latest first)
 */
export const getAllPosts = async (): Promise<PostEntity[]> => {
  const db = await dbPromise;
  const [res] = await db.executeSql(
    `SELECT * FROM post ORDER BY created_at DESC`
  );

  const posts: PostEntity[] = [];
  for (let i = 0; i < res.rows.length; i++) {
    const row = res.rows.item(i);
    posts.push({
      id: Number(row.id),
      title: row.title,
      description: row.description,

    });
  }

  return posts;
};

/**
 * Get latest post ID (for incremental sync if needed)
 */
export const getLatestPostId = async (): Promise<number> => {
  const db = await dbPromise;
  const [res] = await db.executeSql(
    `SELECT MAX(id) as maxId FROM post`
  );

  return res.rows.item(0)?.maxId ?? 0;
};

/**
 * Save posts from backend
 */
export const savePosts = async (posts: PostEntity[]) => {
  if (!posts.length) return;

  const db = await dbPromise;

  await db.transaction(tx => {
    posts.forEach(post => {
      tx.executeSql(
        `INSERT OR REPLACE INTO post
         (id, title, description, visibility, created_at)
         VALUES (?, ?, ?, ?, ?)`,
        [
          post.id,
          post.title,
          post.description,
         
        ]
      );
    });
  });
};
