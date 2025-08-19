const express = require('express');
require('dotenv').config();
const cors = require('cors');
const {connectDB} = require('./db/dbConnect');
const productRoutes = require('./routes/productRoutes');

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

// Use the product routes
app.use('/api/products', productRoutes);

app.listen(5000, () => {
  console.log('Server started on http://localhost:5000');
});

