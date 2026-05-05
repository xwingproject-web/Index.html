const express = require('express');
const router = express.Router();
const publicController = require('../controllers/publicController');

router.get('/', publicController.getHomePage);
router.get('/category/:id', publicController.getCategoryPage);

module.exports = router;
