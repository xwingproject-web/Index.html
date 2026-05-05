const { getDbConnection } = require('../config/database');
const bcrypt = require('bcrypt');

async function getAdminByUsername(username) {
  const db = await getDbConnection();
  return db.get('SELECT * FROM admin_users WHERE username = ?', [username]);
}

async function verifyAdmin(username, password) {
  const admin = await getAdminByUsername(username);
  if (!admin) return false;
  
  const match = await bcrypt.compare(password, admin.password_hash);
  if (match) {
    return admin;
  }
  return false;
}

module.exports = {
  getAdminByUsername,
  verifyAdmin
};

