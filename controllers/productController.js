const Product = require('../models/Product');
const Supplier = require('../models/Supplier');
const mongoose = require('mongoose');

// Helper function for error rendering
const renderError = (res, status, message, error) => {
    res.status(status).render('error', {
        title: 'Lỗi hệ thống',
        message,
        error
    });
};

const productController = {
    // GET /products - Display all products
    index: async (req, res) => {
        try {
            const products = await Product.find()
                .populate('supplierId', 'name address phone')
                .sort({ createdAt: -1 });
            res.render('products/index', { 
                products,
                title: 'All Products'
            });
        } catch (error) {
            console.error('Error fetching products:', error);
            res.status(500).render('error', { 
                message: 'Error fetching products',
                error: error.message 
            });
        }
    },

    // GET /products/new - Show form to create new product
    new: async (req, res) => {
        try {
            const suppliers = await Supplier.find().sort({ name: 1 });
            res.render('products/new', { 
                title: 'Add New Product',
                product: {},
                suppliers
            });
        } catch (error) {
            console.error('Error fetching suppliers for new product:', error);
            res.status(500).render('error', { 
                message: 'Error loading form',
                error: error.message 
            });
        }
    },

    // POST /products - Create new product
    create: async (req, res) => {
        try {
            const { name, price, quantity, supplierId } = req.body;
            const product = new Product({ name, price, quantity, supplierId });
            await product.save();
            res.redirect('/products');
        } catch (error) {
            console.error('Error creating product:', error);
            try {
                const suppliers = await Supplier.find().sort({ name: 1 });
                res.status(400).render('products/new', {
                    title: 'Add New Product',
                    product: req.body,
                    suppliers,
                    error: error.message
                });
            } catch (supplierError) {
                res.status(500).render('error', { 
                    message: 'Error creating product',
                    error: error.message 
                });
            }
        }
    },

    // GET /products/:id - Show single product
    show: async (req, res) => {
        try {
            console.log('Show product request for ID:', req.params.id);
            
            // Validate ObjectId
            if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
                console.log('Invalid ObjectId format:', req.params.id);
                return renderError(res, 404, 'Trang bạn đang tìm kiếm không tồn tại', 'Error 404 - Page Not Found');
            }
            
            const product = await Product.findById(req.params.id)
                .populate('supplierId', 'name address phone');
            
            if (!product) {
                console.log('Product not found for ID:', req.params.id);
                return renderError(res, 404, 'Trang bạn đang tìm kiếm không tồn tại', 'Error 404 - Page Not Found');
            }
            
            console.log('Found product:', product.name);
            res.render('products/show', { 
                product,
                title: `Product: ${product.name}`
            });
        } catch (error) {
            console.error('Error fetching product:', error);
            renderError(res, 500, 'Lỗi hệ thống', error.message);
        }
    },

    // GET /products/:id/edit - Show form to edit product
    edit: async (req, res) => {
        try {
            console.log('Edit product request for ID:', req.params.id);
            
            // Validate ObjectId
            if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
                console.log('Invalid ObjectId format:', req.params.id);
                return renderError(res, 404, 'Trang bạn đang tìm kiếm không tồn tại', 'Error 404 - Page Not Found');
            }
            
            const [product, suppliers] = await Promise.all([
                Product.findById(req.params.id).populate('supplierId', 'name address phone'),
                Supplier.find().sort({ name: 1 })
            ]);
            
            if (!product) {
                console.log('Product not found for edit:', req.params.id);
                return renderError(res, 404, 'Trang bạn đang tìm kiếm không tồn tại', 'Error 404 - Page Not Found');
            }
            
            console.log('Rendering edit form for product:', product.name);
            res.render('products/edit', { 
                product,
                suppliers,
                title: `Edit Product: ${product.name}`
            });
        } catch (error) {
            console.error('Error fetching product for edit:', error);
            renderError(res, 500, 'Lỗi hệ thống', error.message);
        }
    },

    // PUT /products/:id - Update product
    update: async (req, res) => {
        try {
            const { name, price, quantity, supplierId } = req.body;
            const product = await Product.findByIdAndUpdate(
                req.params.id,
                { name, price, quantity, supplierId },
                { new: true, runValidators: true }
            );
            
            if (!product) {
                return res.status(404).render('error', { 
                    message: 'Product not found' 
                });
            }
            
            res.redirect(`/products/${product._id}`);
        } catch (error) {
            console.error('Error updating product:', error);
            try {
                const suppliers = await Supplier.find().sort({ name: 1 });
                res.status(400).render('products/edit', {
                    product: { _id: req.params.id, ...req.body },
                    suppliers,
                    title: 'Edit Product',
                    error: error.message
                });
            } catch (supplierError) {
                res.status(500).render('error', { 
                    message: 'Error updating product',
                    error: error.message 
                });
            }
        }
    },

    // DELETE /products/:id - Delete product
    delete: async (req, res) => {
        try {
            const product = await Product.findByIdAndDelete(req.params.id);
            
            if (!product) {
                return res.status(404).render('error', { 
                    message: 'Product not found' 
                });
            }
            
            res.redirect('/products');
        } catch (error) {
            console.error('Error deleting product:', error);
            res.status(500).render('error', { 
                message: 'Error deleting product',
                error: error.message 
            });
        }
    }
};

module.exports = productController;