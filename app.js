const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const path = require('path');

// Import routes
const supplierRoutes = require('./routes/supplierRoutes');
const productRoutes = require('./routes/productRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/product_supplier_db', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// Support both query string and form body method override
app.use(methodOverride('_method')); // form body
//app.use(methodOverride('_method', { methods: ['GET', 'POST'] })); // query string
app.use(express.static(path.join(__dirname, 'public')));

// Logging middleware for debugging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    if (req.method === 'POST' || req.method === 'PUT' || req.method === 'DELETE') {
        console.log('Body:', req.body);
    }
    next();
});

// Routes
app.get('/', (req, res) => {
    res.render('index', { 
        title: 'Trang chủ' 
    });
});

// Debug route
app.get('/debug', (req, res) => {
    res.render('debug', {
        title: 'API Debug Page'
    });
});

app.use('/suppliers', supplierRoutes);
app.use('/products', productRoutes);

// Error handling middleware
app.use((req, res, next) => {
    res.status(404).render('error', {
        title: 'Trang không tìm thấy',
        message: 'Trang bạn đang tìm kiếm không tồn tại',
        error: 'Error 404 - Page Not Found'
    });
});

app.use((error, req, res, next) => {
    console.error('Error:', error);
    res.status(500).render('error', {
        title: 'Lỗi hệ thống',
        message: 'Đã xảy ra lỗi trong hệ thống',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal Server Error'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;