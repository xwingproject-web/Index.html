const { getDbConnection } = require('../config/database');

async function getConfig() {
  const db = await getDbConnection();
  return db.get('SELECT * FROM store_config LIMIT 1');
}

async function updateConfig(data) {
  const db = await getDbConnection();
  const { store_name, store_description, whatsapp_number, instagram, facebook, tiktok, hero_image } = data;
  
  if (hero_image !== undefined) {
    return db.run(
      `UPDATE store_config SET 
        store_name = ?, 
        store_description = ?, 
        whatsapp_number = ?, 
        instagram = ?, 
        facebook = ?, 
        tiktok = ?,
        hero_image = ?
      WHERE id = (SELECT id FROM store_config LIMIT 1)`,
      [store_name, store_description, whatsapp_number, instagram, facebook, tiktok, hero_image]
    );
  } else {
    return db.run(
      `UPDATE store_config SET 
        store_name = ?, 
        store_description = ?, 
        whatsapp_number = ?, 
        instagram = ?, 
        facebook = ?, 
        tiktok = ? 
      WHERE id = (SELECT id FROM store_config LIMIT 1)`,
      [store_name, store_description, whatsapp_number, instagram, facebook, tiktok]
    );
  }
}

module.exports = {
  getConfig,
  updateConfig
};
