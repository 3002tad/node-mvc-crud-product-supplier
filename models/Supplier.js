const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Supplier name is required'],
        trim: true,
        maxlength: [100, 'Supplier name cannot exceed 100 characters']
    },
    address: {
        type: String,
        required: [true, 'Supplier address is required'],
        trim: true,
        maxlength: [255, 'Address cannot exceed 255 characters']
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        trim: true,
        match: [/^[0-9\-\+\s\(\)]+$/, 'Please enter a valid phone number']
    }
}, {
    timestamps: true
});

// Virtual for products of this supplier
supplierSchema.virtual('products', {
    ref: 'Product',
    localField: '_id',
    foreignField: 'supplierId'
});

// Enable virtual fields when converting to JSON
supplierSchema.set('toJSON', { virtuals: true });
supplierSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Supplier', supplierSchema);