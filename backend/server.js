const express = require('express');
require('dotenv').config();
const cors = require('cors');
const {connectDB} = require('./db/dbConnect');
const ingredientRoutes = require('./routes/ingredientRoutes');
const specialRoutes=require('./routes/specialRoutes')

const app = express();
app.use(cors());
app.use(express.json());

connectDB();
app.use('/api/ingredient', ingredientRoutes);
app.use('/api/special',specialRoutes)
app.listen(5000, () => {
  console.log('Server started on http://localhost:5000');
});


 