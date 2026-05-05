const { getDbConnection } = require('../config/database');

async function getAllCategories() {
  const db = await getDbConnection();
  return db.all('SELECT * FROM categories');
}

async function getCategoryById(id) {
  const db = await getDbConnection();
  return db.get('SELECT * FROM categories WHERE id = ?', [id]);
}

async function createCategory(name, image) {
  const db = await getDbConnection();
  return db.run('INSERT INTO categories (name, image) VALUES (?, ?)', [name, image]);
}

async function updateCategory(id, name, image) {
  const db = await getDbConnection();
  if (image) {
    return db.run('UPDATE categories SET name = ?, image = ? WHERE id = ?', [name, image, id]);
  } else {
    return db.run('UPDATE categories SET name = ? WHERE id = ?', [name, id]);
  }
}

async function deleteCategory(id) {
  const db = await getDbConnection();
  return db.run('DELETE FROM categories WHERE id = ?', [id]);
}

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
};
