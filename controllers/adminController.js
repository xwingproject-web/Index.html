const adminModel = require('../models/adminModel');
const categoryModel = require('../models/categoryModel');
const productModel = require('../models/productModel');
const configModel = require('../models/configModel');
const fs = require('fs');
const path = require('path');

// Authentication middleware
function requireLogin(req, res, next) {
  if (req.session && req.session.adminId) {
    return next();
  }
  res.redirect('/admin/login');
}

// Login
function getLogin(req, res) {
  if (req.session && req.session.adminId) {
    return res.redirect('/admin');
  }
  res.render('admin/login', { error: null });
}

async function postLogin(req, res) {
  const { username, password } = req.body;
  const admin = await adminModel.verifyAdmin(username, password);
  if (admin) {
    req.session.adminId = admin.id;
    return res.redirect('/admin');
  }
  res.render('admin/login', { error: 'Invalid username or password' });
}

function logout(req, res) {
  req.session.destroy();
  res.redirect('/admin/login');
}

// Dashboard
async function getDashboard(req, res) {
  const categories = await categoryModel.getAllCategories();
  const productsCount = await productModel.countProducts();
  res.render('admin/dashboard', { 
    totalCategories: categories.length, 
    totalProducts: productsCount 
  });
}

// Categories
async function getCategories(req, res) {
  const categories = await categoryModel.getAllCategories();
  res.render('admin/categories', { categories });
}

async function createCategory(req, res) {
  const { name } = req.body;
  const image = req.file ? `/uploads/products/${req.file.filename}` : null;
  await categoryModel.createCategory(name, image);
  res.redirect('/admin/categories');
}

async function updateCategory(req, res) {
  const { id, name } = req.body;
  const image = req.file ? `/uploads/products/${req.file.filename}` : null;
  await categoryModel.updateCategory(id, name, image);
  res.redirect('/admin/categories');
}

async function deleteCategory(req, res) {
  const id = req.params.id;
  await categoryModel.deleteCategory(id);
  res.redirect('/admin/categories');
}

// Products
async function getProducts(req, res) {
  const page = parseInt(req.query.page) || 1;
  const search = req.query.search || '';
  const limit = 10;
  const offset = (page - 1) * limit;

  const products = await productModel.getAllProducts(limit, offset, search);
  const totalProducts = await productModel.countProducts(search);
  const totalPages = Math.ceil(totalProducts / limit);
  const categories = await categoryModel.getAllCategories();

  res.render('admin/products', { 
    products, 
    categories, 
    search, 
    page, 
    totalPages 
  });
}

async function createProduct(req, res) {
  const { name, category_id, price, description } = req.body;
  const image = req.file ? `/uploads/products/${req.file.filename}` : null;
  await productModel.createProduct(name, category_id, price, description, image);
  res.redirect('/admin/products');
}

async function updateProduct(req, res) {
  const { id, name, category_id, price, description } = req.body;
  const image = req.file ? `/uploads/products/${req.file.filename}` : null;
  await productModel.updateProduct(id, name, category_id, price, description, image);
  res.redirect('/admin/products');
}

async function deleteProduct(req, res) {
  const id = req.params.id;
  await productModel.deleteProduct(id);
  res.redirect('/admin/products');
}

// Config
async function getConfig(req, res) {
  const config = await configModel.getConfig();
  res.render('admin/settings', { config });
}

async function updateConfig(req, res) {
  const data = { ...req.body };
  if (req.file) {
    data.hero_image = `/uploads/products/${req.file.filename}`;
  }
  await configModel.updateConfig(data);
  res.redirect('/admin/settings');
}

module.exports = {
  requireLogin,
  getLogin,
  postLogin,
  logout,
  getDashboard,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getConfig,
  updateConfig
};

