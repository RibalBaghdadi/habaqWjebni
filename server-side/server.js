const express = require('express');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');
const productRouter = require('./routes/productRouter');
const categoryRouter = require('./routes/categoryRouter');
const adminRouter = require('./routes/adminRouter'); // Assuming you have admin routes

const app = express();

// Database connection
mongoose.connect(process.env.MONGO_URL)
.then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('Error connecting to MongoDB:', err);
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.send('Welcome to the server!');
});
app.use('/api/products', productRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/admin', adminRouter); 


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});