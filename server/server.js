const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const connectDB = require('./config/db.js');
const adminRoutes = require('./routes/adminRoutes.js');
const productRoutes = require('./routes/productRoutes.js');
const orderRoutes = require('./routes/orderRoutes.js');
const userRoutes = require('./routes/userRoutes.js');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/admin', adminRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


module.exports = {
express,
dotenv,
cors,
connectDB,
adminRoutes,
productRoutes,
orderRoutes,
userRoutes,
app,
PORT
};
