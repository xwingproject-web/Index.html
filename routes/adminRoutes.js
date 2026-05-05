const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const adminController = require('../controllers/adminController');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../public/uploads/products'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Public admin routes (Login)
router.get('/login', adminController.getLogin);
router.post('/login', adminController.postLogin);
router.get('/logout', adminController.logout);

// Protected admin routes
router.use(adminController.requireLogin);

router.get('/', adminController.getDashboard);

// Categories
router.get('/categories', adminController.getCategories);
router.post('/categories/create', upload.single('image'), adminController.createCategory);
router.post('/categories/update', upload.single('image'), adminController.updateCategory);
router.get('/categories/delete/:id', adminController.deleteCategory);

// Products
router.get('/products', adminController.getProducts);
router.post('/products/create', upload.single('image'), adminController.createProduct);
router.post('/products/update', upload.single('image'), adminController.updateProduct);
router.get('/products/delete/:id', adminController.deleteProduct);

// Store Config
router.get('/settings', adminController.getConfig);
router.post('/settings/update', upload.single('hero_image'), adminController.updateConfig);

module.exports = router;
