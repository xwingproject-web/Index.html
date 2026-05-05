const express = require('express');
const path = require('path');
const session = require('express-session');
const { initDb } = require('./config/database');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Set up EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'my-super-secret-key', // In a real app, use environment variables
  resave: false,
  saveUninitialized: false
}));

// Routes
const publicRoutes = require('./routes/publicRoutes');
const adminRoutes = require('./routes/adminRoutes');

app.use('/', publicRoutes);
app.use('/admin', adminRoutes);

// Make sure upload directories exist
const uploadDir = path.join(__dirname, 'public', 'uploads', 'products');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Initialize database and start server
initDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('Failed to initialize database:', err);
});
