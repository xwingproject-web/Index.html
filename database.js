const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const bcrypt = require('bcrypt');
const path = require('path');

const dbPath = path.resolve(__dirname, '../database.sqlite');

async function getDbConnection() {
  return open({
    filename: dbPath,
    driver: sqlite3.Database
  });
}

async function initDb() {
  const db = await getDbConnection();

  await db.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      image TEXT
    );

    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category_id INTEGER,
      price REAL,
      description TEXT,
      image TEXT,
      FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS store_config (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      store_name TEXT,
      store_description TEXT,
      whatsapp_number TEXT,
      instagram TEXT,
      facebook TEXT,
      tiktok TEXT,
      hero_image TEXT
    );

    CREATE TABLE IF NOT EXISTS admin_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password_hash TEXT
    );
  `);

  // Check if hero_image column exists in store_config, add if missing
  try {
    const tableInfo = await db.all("PRAGMA table_info(store_config)");
    const hasHeroImage = tableInfo.some(col => col.name === 'hero_image');
    if (!hasHeroImage) {
      await db.exec("ALTER TABLE store_config ADD COLUMN hero_image TEXT");
      console.log("Added hero_image column to store_config");
    }
  } catch(e) {
    console.error("Error altering table", e);
  }

  // Check if store_config exists, if not, insert default
  const config = await db.get('SELECT * FROM store_config LIMIT 1');
  if (!config) {
    await db.run(`
      INSERT INTO store_config (store_name, store_description, whatsapp_number, instagram, facebook, tiktok)
      VALUES ('My Store', 'Welcome to our online shop', '1234567890', '', '', '')
    `);
  }

  // Check if admin user exists, if not, create default admin:admin
  const admin = await db.get('SELECT * FROM admin_users LIMIT 1');
  if (!admin) {
    const defaultPasswordHash = await bcrypt.hash('admin', 10);
    await db.run('INSERT INTO admin_users (username, password_hash) VALUES (?, ?)', ['admin', defaultPasswordHash]);
    console.log('Default admin created with username: admin, password: admin');
  }

  return db;
}

module.exports = {
  getDbConnection,
  initDb
};
