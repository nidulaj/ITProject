const express = require('express');
require('dotenv').config();
const cors = require('cors');
const {connectDB} = require('./db/dbConnect');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');


const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.use('/api/products', productRoutes);
app.use('/api/orders',orderRoutes);

app.listen(5000, () => {
  console.log('Server started on http://localhost:5000');
});

