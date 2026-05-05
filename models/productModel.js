const { getDbConnection } = require('../config/database');

async function getAllProducts(limit, offset, search = '') {
  const db = await getDbConnection();
  let query = 'SELECT products.*, categories.name as category_name FROM products LEFT JOIN categories ON products.category_id = categories.id';
  let params = [];
  
  if (search) {
    query += ' WHERE products.name LIKE ?';
    params.push(`%${search}%`);
  }
  
  query += ' ORDER BY products.id DESC';
  
  if (limit !== undefined && offset !== undefined) {
    query += ' LIMIT ? OFFSET ?';
    params.push(limit, offset);
  }
  
  return db.all(query, params);
}

async function countProducts(search = '') {
  const db = await getDbConnection();
  if (search) {
    const row = await db.get('SELECT COUNT(*) as count FROM products WHERE name LIKE ?', [`%${search}%`]);
    return row.count;
  } else {
    const row = await db.get('SELECT COUNT(*) as count FROM products');
    return row.count;
  }
}

async function getProductsByCategory(categoryId) {
  const db = await getDbConnection();
  return db.all('SELECT * FROM products WHERE category_id = ? ORDER BY id DESC', [categoryId]);
}

async function getProductById(id) {
  const db = await getDbConnection();
  return db.get('SELECT * FROM products WHERE id = ?', [id]);
}

async function createProduct(name, category_id, price, description, image) {
  const db = await getDbConnection();
  return db.run(
    'INSERT INTO products (name, category_id, price, description, image) VALUES (?, ?, ?, ?, ?)',
    [name, category_id, price, description, image]
  );
}

async function updateProduct(id, name, category_id, price, description, image) {
  const db = await getDbConnection();
  if (image) {
    return db.run(
      'UPDATE products SET name = ?, category_id = ?, price = ?, description = ?, image = ? WHERE id = ?',
      [name, category_id, price, description, image, id]
    );
  } else {
    return db.run(
      'UPDATE products SET name = ?, category_id = ?, price = ?, description = ? WHERE id = ?',
      [name, category_id, price, description, id]
    );
  }
}

async function deleteProduct(id) {
  const db = await getDbConnection();
  return db.run('DELETE FROM products WHERE id = ?', [id]);
}

module.exports = {
  getAllProducts,
  countProducts,
  getProductsByCategory,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
