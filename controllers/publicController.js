const categoryModel = require('../models/categoryModel');
const productModel = require('../models/productModel');
const configModel = require('../models/configModel');

async function getHomePage(req, res) {
  try {
    const config = await configModel.getConfig();
    const categories = await categoryModel.getAllCategories();
    res.render('public/index', { config, categories });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
}

async function getCategoryPage(req, res) {
  try {
    const categoryId = req.params.id;
    const config = await configModel.getConfig();
    const category = await categoryModel.getCategoryById(categoryId);
    const products = await productModel.getProductsByCategory(categoryId);
    
    if (!category) {
      return res.status(404).send('Category not found');
    }
    
    res.render('public/products', { config, category, products });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
}

module.exports = {
  getHomePage,
  getCategoryPage
};

