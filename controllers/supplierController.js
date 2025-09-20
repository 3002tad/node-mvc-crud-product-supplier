const Supplier = require('../models/Supplier');
const Product = require('../models/Product');
const mongoose = require('mongoose');

// Helper function for error rendering
const renderError = (res, status, message, error) => {
    res.status(status).render('error', {
        title: 'Lỗi hệ thống',
        message,
        error
    });
};

const supplierController = {
    // GET /suppliers - Display all suppliers
    index: async (req, res) => {
        try {
            const suppliers = await Supplier.find().sort({ createdAt: -1 });
            res.render('suppliers/index', { 
                suppliers,
                title: 'All Suppliers'
            });
        } catch (error) {
            console.error('Error fetching suppliers:', error);
            renderError(res, 500, 'Error fetching suppliers', error.message);
        }
    },

    // GET /suppliers/new - Show form to create new supplier
    new: (req, res) => {
        res.render('suppliers/new', { 
            title: 'Add New Supplier',
            supplier: {}
        });
    },

    // POST /suppliers - Create new supplier
    create: async (req, res) => {
        try {
            const { name, address, phone } = req.body;
            const supplier = new Supplier({ name, address, phone });
            await supplier.save();
            res.redirect('/suppliers');
        } catch (error) {
            console.error('Error creating supplier:', error);
            res.status(400).render('suppliers/new', {
                title: 'Add New Supplier',
                supplier: req.body,
                error: error.message
            });
        }
    },

    // GET /suppliers/:id - Show single supplier
    show: async (req, res) => {
        try {
            console.log('Show supplier request for ID:', req.params.id);
            
            // Validate ObjectId
            if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
                console.log('Invalid ObjectId format:', req.params.id);
                return renderError(res, 404, 'Trang bạn đang tìm kiếm không tồn tại', 'Error 404 - Page Not Found');
            }
            
            const supplier = await Supplier.findById(req.params.id);
            if (!supplier) {
                console.log('Supplier not found for ID:', req.params.id);
                return renderError(res, 404, 'Trang bạn đang tìm kiếm không tồn tại', 'Error 404 - Page Not Found');
            }
            
            // Get products for this supplier
            const products = await Product.find({ supplierId: supplier._id });
            console.log('Found supplier:', supplier.name, 'with', products.length, 'products');
            
            res.render('suppliers/show', { 
                supplier,
                products,
                title: `Supplier: ${supplier.name}`
            });
        } catch (error) {
            console.error('Error fetching supplier:', error);
            renderError(res, 500, 'Lỗi hệ thống', error.message);
        }
    },

    // GET /suppliers/:id/edit - Show form to edit supplier
    edit: async (req, res) => {
        try {
            console.log('Edit supplier request for ID:', req.params.id);
            
            // Validate ObjectId
            if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
                console.log('Invalid ObjectId format:', req.params.id);
                return renderError(res, 404, 'Trang bạn đang tìm kiếm không tồn tại', 'Error 404 - Page Not Found');
            }
            
            const supplier = await Supplier.findById(req.params.id);
            if (!supplier) {
                console.log('Supplier not found for edit:', req.params.id);
                return renderError(res, 404, 'Trang bạn đang tìm kiếm không tồn tại', 'Error 404 - Page Not Found');
            }
            
            console.log('Rendering edit form for supplier:', supplier.name);
            res.render('suppliers/edit', { 
                supplier,
                title: `Edit Supplier: ${supplier.name}`
            });
        } catch (error) {
            console.error('Error fetching supplier for edit:', error);
            renderError(res, 500, 'Lỗi hệ thống', error.message);
        }
    },

    // PUT /suppliers/:id - Update supplier
    update: async (req, res) => {
        try {
            console.log('Update supplier request:', req.params.id, req.body);
            console.log('Request method:', req.method);
            
            // Validate ObjectId
            if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
                console.log('Invalid ObjectId format:', req.params.id);
                return renderError(res, 404, 'Trang bạn đang tìm kiếm không tồn tại', 'Error 404 - Page Not Found');
            }
            
            const { name, address, phone } = req.body;
            const supplier = await Supplier.findByIdAndUpdate(
                req.params.id,
                { name, address, phone },
                { new: true, runValidators: true }
            );
            
            if (!supplier) {
                console.log('Supplier not found for update:', req.params.id);
                return renderError(res, 404, 'Supplier not found', 'Supplier not found');
            }
            
            console.log('Supplier updated successfully:', supplier._id);
            res.redirect(`/suppliers/${supplier._id}`);
        } catch (error) {
            console.error('Error updating supplier:', error);
            res.status(400).render('suppliers/edit', {
                supplier: { _id: req.params.id, ...req.body },
                title: 'Edit Supplier',
                error: error.message
            });
        }
    },

    // DELETE /suppliers/:id - Delete supplier
    delete: async (req, res) => {
        try {
            console.log('Delete supplier request:', req.params.id);
            console.log('Request method:', req.method);
            
            // Validate ObjectId
            if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
                console.log('Invalid ObjectId format:', req.params.id);
                return renderError(res, 404, 'Trang bạn đang tìm kiếm không tồn tại', 'Error 404 - Page Not Found');
            }
            
            // Check if supplier has products
            const productCount = await Product.countDocuments({ supplierId: req.params.id });
            
            if (productCount > 0) {
                console.log('Cannot delete supplier with products:', productCount);
                return renderError(res, 400, 'Cannot delete supplier', `This supplier has ${productCount} product(s). Please delete all products first.`);
            }
            
            const supplier = await Supplier.findByIdAndDelete(req.params.id);
            
            if (!supplier) {
                console.log('Supplier not found for deletion:', req.params.id);
                return renderError(res, 404, 'Supplier not found', 'Supplier not found');
            }
            
            console.log('Supplier deleted successfully:', supplier._id);
            res.redirect('/suppliers');
        } catch (error) {
            console.error('Error deleting supplier:', error);
            renderError(res, 500, 'Error deleting supplier', error.message);
        }
    }
};

module.exports = supplierController;