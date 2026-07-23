const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const sampleProducts = [
  {
    name: 'Wireless Bluetooth Headphones',
    price: 99.99,
    description: 'High quality noise cancelling headphones.',
    stockQuantity: 25,
  },
  {
    name: 'Gaming Mouse',
    price: 49.99,
    description: 'RGB ergonomic wired gaming mouse.',
    stockQuantity: 50,
  },
  {
    name: 'Mechanical Keyboard',
    price: 89.99,
    description: 'Customizable tactile mechanical switches.',
    stockQuantity: 15,
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Product.deleteMany(); // Clear existing products
    await Product.insertMany(sampleProducts);
    console.log('Sample Products Added Successfully!');
    process.exit();
  } catch (error) {
    console.error('Error seeding database:', error.message);
    process.exit(1);
  }
};

seedDB();