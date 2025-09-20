const mongoose = require('mongoose');
const Supplier = require('./models/Supplier');
const Product = require('./models/Product');

// MongoDB connection
const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/product_supplier_db', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

// Sample suppliers data
const sampleSuppliers = [
    {
        name: 'Tech Solutions Vietnam',
        address: '123 Nguyen Hue Street, District 1, Ho Chi Minh City',
        phone: '+84 28 1234 5678'
    },
    {
        name: 'Global Electronics Co.',
        address: '456 Le Loi Avenue, Hai Ba Trung District, Hanoi',
        phone: '+84 24 9876 5432'
    },
    {
        name: 'Smart Devices Ltd.',
        address: '789 Tran Hung Dao Street, District 5, Ho Chi Minh City',
        phone: '+84 28 5555 1234'
    },
    {
        name: 'Innovation Hardware',
        address: '321 Ba Trieu Street, Dong Da District, Hanoi',
        phone: '+84 24 7777 8888'
    },
    {
        name: 'Digital World Corp.',
        address: '654 Vo Van Tan Street, District 3, Ho Chi Minh City',
        phone: '+84 28 3333 9999'
    }
];

// Sample products data (will be populated with supplier IDs after suppliers are created)
const sampleProductsTemplate = [
    {
        name: 'iPhone 15 Pro',
        price: 999.99,
        quantity: 50
    },
    {
        name: 'Samsung Galaxy S24',
        price: 849.99,
        quantity: 75
    },
    {
        name: 'MacBook Pro 16"',
        price: 2399.99,
        quantity: 25
    },
    {
        name: 'Dell XPS 13',
        price: 1299.99,
        quantity: 40
    },
    {
        name: 'iPad Air',
        price: 599.99,
        quantity: 60
    },
    {
        name: 'Surface Pro 9',
        price: 1099.99,
        quantity: 30
    },
    {
        name: 'AirPods Pro',
        price: 249.99,
        quantity: 100
    },
    {
        name: 'Sony WH-1000XM5',
        price: 349.99,
        quantity: 45
    },
    {
        name: 'Nintendo Switch OLED',
        price: 349.99,
        quantity: 35
    },
    {
        name: 'Steam Deck',
        price: 649.99,
        quantity: 20
    },
    {
        name: 'Apple Watch Series 9',
        price: 399.99,
        quantity: 55
    },
    {
        name: 'Google Pixel 8 Pro',
        price: 899.99,
        quantity: 40
    },
    {
        name: 'ASUS ROG Laptop',
        price: 1799.99,
        quantity: 15
    },
    {
        name: 'LG OLED TV 55"',
        price: 1499.99,
        quantity: 25
    },
    {
        name: 'Mechanical Keyboard',
        price: 149.99,
        quantity: 80
    }
];

// Seed function
const seedDatabase = async () => {
    try {
        console.log('Starting database seeding...');

        // Clear existing data
        console.log('Clearing existing data...');
        await Product.deleteMany({});
        await Supplier.deleteMany({});
        console.log('Existing data cleared successfully');

        // Create suppliers
        console.log('Creating suppliers...');
        const createdSuppliers = await Supplier.insertMany(sampleSuppliers);
        console.log(`${createdSuppliers.length} suppliers created successfully`);

        // Create products with random supplier assignment
        console.log('Creating products...');
        const sampleProducts = sampleProductsTemplate.map(product => ({
            ...product,
            supplierId: createdSuppliers[Math.floor(Math.random() * createdSuppliers.length)]._id
        }));

        const createdProducts = await Product.insertMany(sampleProducts);
        console.log(`${createdProducts.length} products created successfully`);

        // Display summary
        console.log('\n=== SEEDING SUMMARY ===');
        console.log(`✅ ${createdSuppliers.length} suppliers created`);
        console.log(`✅ ${createdProducts.length} products created`);
        
        console.log('\n=== SUPPLIERS CREATED ===');
        createdSuppliers.forEach((supplier, index) => {
            console.log(`${index + 1}. ${supplier.name} - ${supplier.address} - ID: ${supplier._id}`);
        });

        console.log('\n=== PRODUCTS CREATED ===');
        createdProducts.forEach((product, index) => {
            const supplier = createdSuppliers.find(s => s._id.toString() === product.supplierId.toString());
            console.log(`${index + 1}. ${product.name} - $${product.price} (Qty: ${product.quantity}) - Supplier: ${supplier.name}`);
        });

        console.log('\n🎉 Database seeding completed successfully!');
        console.log('You can now start the server with: npm start');
        
    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        // Close database connection
        await mongoose.connection.close();
        console.log('Database connection closed');
    }
};

// Run the seed function
const runSeed = async () => {
    await connectDB();
    await seedDatabase();
};

// Execute if this file is run directly
if (require.main === module) {
    runSeed();
}

module.exports = { seedDatabase, connectDB };