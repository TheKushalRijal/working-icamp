/**
 * This module manages the SQLite database for university-related data in the app.
 * It provides functions to initialize the database, save university data, retrieve data,
 * and close the database connection. Data includes housing, restaurants, videos, posts,
 * announcements, and resources for each university.
 */

import SQLite from 'react-native-sqlite-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEY } from '../Home';


export interface UniversityData {
  university_name: string;
  location: string;
  posts: any[];
  videos: any[];
  announcements: any[];
  restaurants: any[];
  housing: any[];
  resources: any[];
  scam_groups?: any[];

  community_groups?: any[];
  health_insurance?: any[];

}


const initDB = async () => {
  return await SQLite.openDatabase({ 
    name: 'university.db',
    location: 'default'
  });
};

/**
 * Saves all university data (housing, restaurants, videos, posts, resources) to SQLite.
 * The function requires a UniversityData object as its parameter.
 * When called, it will create tables and save the provided data (including restaurant data) into the database.
 * Example usage:
 *   await saveUniversityDataToSQLite(universityData);
 * @param {UniversityData} data - The university data to save.
 */

export const saveUniversityDataToSQLite = async (data: UniversityData) => {
  try {
    const db = await initDB();
    console.log("Database instance:");
    await db.transaction(async (tx) => {
      // Create and populate housing table
      await tx.executeSql(
        `CREATE TABLE IF NOT EXISTS housing (
          id INTEGER PRIMARY KEY,
          name TEXT,
          image TEXT,
          price REAL,
          website TEXT,
          campusType TEXT,
          university_name TEXT
        );`
      );
      if (data.housing?.length) {
        for (const housing of data.housing) {
          await tx.executeSql(
            `INSERT OR REPLACE INTO housing (id, name, image, price, website, campusType, university_name)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [housing.id, housing.name, housing.image, housing.price, housing.website, 
             housing.campusType, data.university_name]
          );
        }
      }

      // Save restaurant data - consolidated into single transaction
      await tx.executeSql(
        `CREATE TABLE IF NOT EXISTS restaurant (
          id INTEGER PRIMARY KEY,
          name TEXT,
          image TEXT,
          location TEXT,
          distance TEXT,
          rating REAL,
          review_count INTEGER,
          phone TEXT,
          open_status TEXT,
          hours TEXT,
          featured INTEGER,
          categories TEXT,
          university_name TEXT
        );`
      );
      if (data.restaurants?.length) {
        for (const restaurant of data.restaurants) {
          await tx.executeSql(
            `INSERT OR REPLACE INTO restaurant (id, name, image, location, distance, rating, review_count, phone, open_status, hours, featured, categories, university_name)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              restaurant.id,
              restaurant.name,
              restaurant.image,
              restaurant.location,
              restaurant.distance,
              restaurant.rating,
              restaurant.review_count,
              restaurant.phone,
              restaurant.open_status,
              restaurant.hours,
              restaurant.featured ? 1 : 0,
              JSON.stringify(restaurant.categories),
              data.university_name,
            ]
          );
        }
      }

      // Save video data
      await tx.executeSql(
        `CREATE TABLE IF NOT EXISTS video (
          id INTEGER PRIMARY KEY,
          url TEXT,
          author TEXT,
          university_name TEXT
        );`
      );
      if (data.videos?.length) {
        for (const video of data.videos) {
          await tx.executeSql(
            `INSERT OR REPLACE INTO video (id, url, author, university_name)
             VALUES (?, ?, ?, ?)`,
            [
              video.id,
              video.url,
              video.author,
              data.university_name,
            ]
          );
        }
      }

      // Save post data
      await tx.executeSql(
        `CREATE TABLE IF NOT EXISTS post (
          id INTEGER PRIMARY KEY,
          username TEXT,
          caption TEXT,
          imagefield BLOB,
          location TEXT,
          latitude REAL,
          longitude REAL,
          timestamp TEXT,
          university_name TEXT
        );`
      );
      if (data.posts?.length) {
        for (const post of data.posts) {
          await tx.executeSql(
            `INSERT OR REPLACE INTO post (id, username, caption, imagefield, location, latitude, longitude, timestamp, university_name)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              post.id,
              post.username,
              post.caption,
              post.imagefield,
              post.location,
              post.latitude,
              post.longitude,
              post.timestamp,
              data.university_name,
            ]
          );
        }
      }

      // Save announcement data (create table if needed)
      await tx.executeSql(
        `CREATE TABLE IF NOT EXISTS announcement (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT,
          content TEXT,
          university_name TEXT
        );`
      );
      if (data.announcements?.length) {
        for (const announcement of data.announcements) {
          await tx.executeSql(
            `INSERT OR REPLACE INTO announcement (title, content, university_name)
             VALUES (?, ?, ?)`,
            [announcement.title, announcement.content, data.university_name]
          );
        }
      }

      // Save resources data
      await tx.executeSql(
        `CREATE TABLE IF NOT EXISTS resource (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          icon TEXT,
          title TEXT,
          description TEXT,
          link TEXT,
          university_name TEXT
        );`
      );
      if (data.resources?.length) {
        for (const resource of data.resources) {
          await tx.executeSql(
            `INSERT OR REPLACE INTO resource (id, icon, title, description, link, university_name)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [
              resource.id,
              resource.icon,
              resource.title,
              resource.description,
              resource.link || null,
              data.university_name,
            ]
          );
        }
      }


await tx.executeSql(
  `CREATE TABLE IF NOT EXISTS scam_watch_group (
    id INTEGER PRIMARY KEY,
    name TEXT,
    platform TEXT,
    description TEXT,
    link TEXT,
    icon TEXT
  );`
);
if (data.scam_groups?.length) {
  for (const group of data.scam_groups) {
    await tx.executeSql(
      `INSERT OR REPLACE INTO scam_watch_group
       (id, name, platform, description, link, icon)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        group.id,
        group.name,
        group.platform,
        group.description,
        group.link,
        group.icon,
      ]
    );
  }
}







await tx.executeSql(
  `CREATE TABLE IF NOT EXISTS community_group (
    id INTEGER PRIMARY KEY,
    name TEXT,
    platform TEXT,
    description TEXT,
    link TEXT,
    icon TEXT,
    verified INTEGER,
    category TEXT,
    members TEXT
  );`
);
if (data.community_groups?.length) {
  for (const group of data.community_groups) {
    await tx.executeSql(
      `INSERT OR REPLACE INTO community_group
       (id, name, platform, description, link, icon, verified, category, members)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        group.id,
        group.name,
        group.platform,
        group.description,
        group.link,
        group.icon,
        group.verified ? 1 : 0,
        group.category,
        group.members,
      ]
    );
  }
}







await tx.executeSql(
  `CREATE TABLE IF NOT EXISTS health_insurance (
    id INTEGER PRIMARY KEY,
    universityid TEXT,
    insurancename TEXT,
    address TEXT,
    phonenumber TEXT,
    hours TEXT,
    services TEXT,
    description TEXT
  );`
);
if (data.health_insurance?.length) {
  for (const insurance of data.health_insurance) {
    await tx.executeSql(
      `INSERT OR REPLACE INTO health_insurance
       (id, universityid, insurancename, address, phonenumber, hours, services, description)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        insurance.id,
        insurance.universityid,
        insurance.insurancename,
        insurance.address,
        insurance.phonenumber,
        insurance.hours,
        insurance.services,
        insurance.description,
      ]
    );
  }
}




const savePostsToLocalStorage = (posts) => {
  try {
    if (!Array.isArray(posts)) return;

    // 🔹 Get existing posts (if any)
    const existingData = localStorage.getItem(STORAGE_KEY);
    let existingPosts = [];

    if (existingData) {
      existingPosts = JSON.parse(existingData);
      if (!Array.isArray(existingPosts)) {
        existingPosts = [];
      }
    }

    // 🔹 Merge posts by ID (backend is source of truth)
    const postMap = new Map();

    // existing first
    existingPosts.forEach(post => {
      if (post?.id != null) {
        postMap.set(post.id, post);
      }
    });

    // backend overwrites / adds
    posts.forEach(post => {
      if (post?.id != null) {
        postMap.set(post.id, post);
      }
    });

    const mergedPosts = Array.from(postMap.values());

    // 🔹 Save back to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mergedPosts));

    console.log('✅ Posts saved to localStorage:', mergedPosts.length);
  } catch (error) {
    console.error('❌ Failed to save posts to localStorage:', error);
  }
};








    });
    console.log('Successfully saved university data to SQLite=================== this is debugging right now', data);
    // After saving, log the saved data for verification
  } catch (error) {
    console.error('Error saving university data to SQLite:', error);
    throw error;
  }
};




/**
 * Alternative function to save university data to SQLite.
 * Similar to saveUniversityDataToSQLite, but uses a different db instance.
 
export const handleUniversityDataSave = async (data: UniversityData) => {
    try {
      const dbInstance = await initDB(); // Fix: use initDB() instead of undefined db
      await dbInstance.transaction(async (tx) => {
        // Create and populate tables
        await tx.executeSql(`
          CREATE TABLE IF NOT EXISTS housing (
            id INTEGER PRIMARY KEY,
            name TEXT,
            image TEXT,
            price REAL,
            website TEXT,
            campusType TEXT,
            university_name TEXT
          );
        `);

        if (data.housing?.length) {
          for (const housing of data.housing) {
            await tx.executeSql(
              `INSERT OR REPLACE INTO housing (id, name, image, price, website, campusType, university_name)
               VALUES (?, ?, ?, ?, ?, ?, ?)`,
              [housing.id, housing.name, housing.image, housing.price, housing.website, 
               housing.campusType, data.university_name]
            );
          }
        }

        // Create and populate restaurant table
        await tx.executeSql(
          `CREATE TABLE IF NOT EXISTS restaurant (
            id INTEGER PRIMARY KEY,
            name TEXT,
            image TEXT,
            location TEXT,
            distance TEXT,
            rating REAL,
            review_count INTEGER,
            phone TEXT,
            open_status TEXT,
            hours TEXT,
            featured INTEGER,
            categories TEXT,
            university_name TEXT
          );`
        );

        if (data.restaurants && Array.isArray(data.restaurants)) {
          for (const restaurant of data.restaurants) {
            await tx.executeSql(
              `INSERT OR REPLACE INTO restaurant (id, name, image, location, distance, rating, review_count, phone, open_status, hours, featured, categories, university_name)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
              [
                restaurant.id,
                restaurant.name,
                restaurant.image,
                restaurant.location,
                restaurant.distance,
                restaurant.rating,
                restaurant.review_count,
                restaurant.phone,
                restaurant.open_status,
                restaurant.hours,
                restaurant.featured ? 1 : 0,
                JSON.stringify(restaurant.categories),
                data.university_name,
              ]
            );
          }
        }

        // Create and populate video table
        await tx.executeSql(
          `CREATE TABLE IF NOT EXISTS video (
            id INTEGER PRIMARY KEY,
            url TEXT,
            author TEXT,
            university_name TEXT
          );`
        );

        if (data.videos && Array.isArray(data.videos)) {
          for (const video of data.videos) {
            await tx.executeSql(
              `INSERT OR REPLACE INTO video (id, url, author, university_name)
               VALUES (?, ?, ?, ?)`,
              [video.id, video.url, video.author, data.university_name]
            );
          }
        }

        // Create and populate post table
        await tx.executeSql(
          `CREATE TABLE IF NOT EXISTS post (
            id INTEGER PRIMARY KEY,
            username TEXT,
            caption TEXT,
            imagefield BLOB,
            location TEXT,
            latitude REAL,
            longitude REAL,
            timestamp TEXT,
            university_name TEXT
          );`
        );

        if (data.posts && Array.isArray(data.posts)) {
          for (const post of data.posts) {
            await tx.executeSql(
              `INSERT OR REPLACE INTO post (id, username, caption, imagefield, location, latitude, longitude, timestamp, university_name)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
              [
                post.id,
                post.username,
                post.caption,
                post.imagefield,
                post.location,
                post.latitude,
                post.longitude,
                post.timestamp,
                data.university_name,
              ]
            );
          }
        }

        // Create and populate announcement table
        await tx.executeSql(
          `CREATE TABLE IF NOT EXISTS announcement (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT,
            content TEXT,
            university_name TEXT
          );`
        );

        if (data.announcements && Array.isArray(data.announcements)) {
          for (const announcement of data.announcements) {
            await tx.executeSql(
              `INSERT OR REPLACE INTO announcement (title, content, university_name)
               VALUES (?, ?, ?)`,
              [announcement.title, announcement.content, data.university_name]
            );
          }
        }

        // Create and populate resource table
        await tx.executeSql(
          `CREATE TABLE IF NOT EXISTS resource (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            icon TEXT,
            title TEXT,
            description TEXT,
            link TEXT,
            university_name TEXT
          );`
        );

        if (data.resources && Array.isArray(data.resources)) {
          for (const resource of data.resources) {
            await tx.executeSql(
              `INSERT OR REPLACE INTO resource (id, icon, title, description, link, university_name)
               VALUES (?, ?, ?, ?, ?, ?)`,
              [
                resource.id,
                resource.icon,
                resource.title,
                resource.description,
                resource.link || null,
                data.university_name,
              ]
            );
          }
        }
      });
      console.log('Successfully saved university data');
    } catch (error) {
      console.error('Error saving university data:', error);
    }
  };

*/







/**
 * Stores the latest university data in memory for later use.
 * @param {UniversityData} data - The university data to store.
 */
let currentUniversityData: UniversityData | null = null;
export const setUniversityData = (data: UniversityData) => {
  currentUniversityData = data;
};

/**
 * Populates the database with the latest university data stored in memory.
 * Calls saveUniversityDataToSQLite with the stored data.
 */
export const populateUniversityData = async () => {
  try {
    if (currentUniversityData) {
      console.log('Populating database with university data:', currentUniversityData);
      await saveUniversityDataToSQLite(currentUniversityData);
      console.log('Successfully populated database');
    } else {
      console.warn('No university data available to populate database');
    }
  } catch (error) {
    console.error('Error populating database:', error);
    throw error;
  }
};



// --- Explanation ---
//
// This module provides a complete interface for storing and retrieving university-related data in a local SQLite database.
// 
// - Data Structure: The UniversityData interface defines the shape of all university-related data (housing, restaurants, videos, posts, announcements, resources).
// - Database Initialization: The initDB function opens (or creates) the database file.
// - Saving Data: saveUniversityDataToSQLite and handleUniversityDataSave create tables and insert/update records for all data types.
// - In-Memory Data: setUniversityData and populateUniversityData allow you to temporarily store and later save university data.
// - Closing Database: closeDatabase safely closes the database connection.
// - Querying Data: getUniversityData retrieves all data for a university; getUniversityDataByType retrieves a specific data type (e.g., housing).
//
// Usage:
// 1. Call saveUniversityDataToSQLite(data) to save all data after receiving it from the backend.
// 2. Use getUniversityData(universityName) or getUniversityDataByType(universityName, type) to fetch data for display in your app.
// 3. Use setUniversityData(data) and populateUniversityData() for workflows where you need to save data later.
// 4. Call closeDatabase() when you want to close the database connection.
//
// This approach ensures your app can work offline and efficiently access university-related information.

// No, you do not always need to call populateUniversityData.
// Use setUniversityData(data) and populateUniversityData() only if you want to save university data later (not immediately).