const express = require('express');
require('dotenv').config();
const cors = require('cors');
const {connectDB} = require('./db/dbConnect');
const app = express();


const discountRoutes = require('./routes/discountRoutes')

app.use(cors());
app.use(express.json());


connectDB();


app.use('/api/discounts', discountRoutes);

app.listen(5000, () => {
  console.log('Server started on http://localhost:5000');
});
