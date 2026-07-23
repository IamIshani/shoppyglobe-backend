const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Body Parser Middleware
app.use(express.json());

// Routes
app.use('/api', require('./routes/authRoutes'));
app.use('/products', require('./routes/productRoutes'));
app.use('/cart', require('./routes/cartRoutes'));

// 404 Route Not Found Handler
app.use((req, res, next) => {
  res.status(404).json({ message: 'API Route Not Found' });
});

// Centralized Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});