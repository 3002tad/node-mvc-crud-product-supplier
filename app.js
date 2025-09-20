const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const path = require('path');
const engine = require('ejs-mate');
require('dotenv').config();

// Import routes
const supplierRoutes = require('./routes/supplierRoutes');
const productRoutes  = require('./routes/productRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// ===== View engine (EJS + ejs-mate) =====
app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ===== Static assets =====
app.use(express.static(path.join(__dirname, 'public')));

// ===== Middleware =====
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Method override via hidden input _method
app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    const method = req.body._method;
    delete req.body._method;
    return method;
  }
}));
// Optional query string override (?_method=DELETE)
app.use(methodOverride('_method'));

// Logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  if (['POST','PUT','DELETE'].includes(req.method)) {
    console.log('Body:', req.body);
  }
  next();
});
// Active nav helper
app.use((req,res,next)=>{
  res.locals.active = req.path.startsWith('/products') ? 'products'
                    : req.path.startsWith('/suppliers') ? 'suppliers' : '';
  next();
});


// ===== MongoDB =====
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/product_supplier_db', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB error:', err));

// ===== Routes =====
app.get('/', (req, res) => {
  res.render('index', { title: 'Trang chủ' });
});
app.get('/debug', (req, res) => {
  res.render('debug', { title: 'API Debug Page' });
});

app.use('/suppliers', supplierRoutes);
app.use('/products', productRoutes);

// ===== Error handling =====
app.use((req, res) => {
  res.status(404).render('error', {
    title: 'Trang không tìm thấy',
    message: 'Trang bạn đang tìm kiếm không tồn tại',
    error: 'Error 404 - Page Not Found'
  });
});

app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).render('error', {
    title: 'Lỗi hệ thống',
    message: 'Đã xảy ra lỗi trong hệ thống',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal Server Error'
  });
});

// ===== Start server =====
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});

module.exports = app;
