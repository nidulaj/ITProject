const express = require('express');
require('dotenv').config();
const cors = require('cors');
const {connectDB} = require('./db/dbConnect');

const discountRoutes = require('./routes/discountRoutes')
const ingredientRoutes = require('./routes/ingredientRoutes');
const specialRoutes=require('./routes/specialRoutes');
const finalRoutes=require('./routes/finalRoutes');
const storeRoutes=require('./routes/storeRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const customerAuthRoute = require('./routes/customerAuthRoute')
const recipeRoutes = require("./routes/recipeRoutes");
const staffAuthRoutes = require("./routes/staffAuthRoutes");
const userManagementAuditLogRoutes = require("./routes/userManagementAuditLogRoutes");

const app = express();
const cookieParser = require('cookie-parser')


app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true,              
}));

app.use(express.json());
app.use(cookieParser());
app.set("trust proxy", true);
connectDB();


app.use('/api/auth', customerAuthRoute);
app.use('/api/staff/auth', staffAuthRoutes);
app.use('/api/user/audit', userManagementAuditLogRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders',orderRoutes);
app.use("/api/recipe", recipeRoutes);
app.use('/api/ingredient', ingredientRoutes);
app.use('/api/special',specialRoutes);
app.use('/api/final',finalRoutes);
app.use('/api/store',storeRoutes);
app.use('/api/discounts', discountRoutes);

app.listen(5000, () => {
  console.log("Server started on http://localhost:5000");
});