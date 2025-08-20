const express = require('express');
require('dotenv').config();
const cors = require('cors');
const {connectDB} = require('./db/dbConnect');
const app = express();
const cookieParser = require('cookie-parser')
const customerAuthRoute = require('./routes/customerAuthRoute')

app.use(cors());
app.use(express.json());
app.use(cookieParser());

connectDB();

app.use('/auth/customer', customerAuthRoute);

app.listen(5000, () => {
  console.log('Server started on http://localhost:5000');
});
