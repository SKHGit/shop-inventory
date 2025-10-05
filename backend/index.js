const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// DB Config
const db = process.env.MONGO_URI || 'mongodb://localhost:27017/shop-inventory';

// Connect to MongoDB
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB Connected...');
    seedDatabase();
  })
  .catch(err => console.log(err));

const Product = require('./models/Product');

const seedDatabase = async () => {
  try {
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      console.log('No products found, seeding database...');
      const defaultProducts = [
        { name: 'Switch', category: 'Electrical', brand: 'Ketko', costPrice: 50, sellingPrice: 70, stockQuantity: 100, reorderLevel: 20 },
        { name: 'Switch', category: 'Electrical', brand: 'Anchor', costPrice: 60, sellingPrice: 80, stockQuantity: 100, reorderLevel: 20 },
        { name: 'Socket', category: 'Electrical', brand: 'Ketko', costPrice: 80, sellingPrice: 100, stockQuantity: 100, reorderLevel: 20 },
        { name: 'Socket', category: 'Electrical', brand: 'Anchor', costPrice: 90, sellingPrice: 110, stockQuantity: 100, reorderLevel: 20 },
        { name: 'Two Pin', category: 'Electrical', brand: 'Ketko', costPrice: 30, sellingPrice: 40, stockQuantity: 100, reorderLevel: 30 },
        { name: 'Two Pin', category: 'Electrical', brand: 'Anchor', costPrice: 35, sellingPrice: 45, stockQuantity: 100, reorderLevel: 30 },
        { name: 'Three Pin', category: 'Electrical', brand: 'Ketko', costPrice: 40, sellingPrice: 55, stockQuantity: 100, reorderLevel: 30 },
        { name: 'Three Pin', category: 'Electrical', brand: 'Anchor', costPrice: 45, sellingPrice: 60, stockQuantity: 100, reorderLevel: 30 },
      ];
      await Product.insertMany(defaultProducts);
      console.log('Database seeded with default products.');
    }
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

// Use Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/products', require('./routes/api/products'));
app.use('/api/reports', require('./routes/api/reports'));

app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});

const port = process.env.PORT || 5000;

// Start the server only if this file is run directly
if (require.main === module) {
  app.listen(port, () => console.log(`Server started on port ${port}`));
}

// Export the app for use in other files
module.exports = app;
