const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true,
        maxlength: [100, 'Product name cannot exceed 100 characters']
    },
    price: {
        type: Number,
        required: [true, 'Product price is required'],
        min: [0, 'Price must be a positive number']
    },
    quantity: {
        type: Number,
        required: [true, 'Product quantity is required'],
        min: [0, 'Quantity must be a positive number'],
        default: 0
    },
    supplierId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Supplier',
        required: [true, 'Supplier is required']
    }
}, {
    timestamps: true
});

// Create index for better query performance
productSchema.index({ supplierId: 1 });
productSchema.index({ name: 1 });

// Populate supplier information when querying products
productSchema.pre(/^find/, function(next) {
    this.populate({
        path: 'supplierId',
        select: 'name address phone'
    });
    next();
});

module.exports = mongoose.model('Product', productSchema);