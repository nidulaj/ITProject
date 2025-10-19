require('dotenv').config();
const express = require('express');
const cors = require('cors');
const {connectDB} = require('./db/dbConnect');
const { createServer } = require("http");
const { initSocket } = require("./utils/socket");


const app = express();
const server = createServer(app);
initSocket(server);
const cookieParser = require('cookie-parser')
const path = require("path");

const discountRoutes = require('./routes/discountRoutes')
const ingredientRoutes = require('./routes/ingredientRoutes');
const specialRoutes=require('./routes/specialRoutes');
const finalRoutes=require('./routes/finalRoutes');
const storeRoutes=require('./routes/storeRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const customerAuthRoute = require('./routes/customerAuthRoute')
const paymentRoutes = require("./routes/paymentRoutes");
const financeRoutes = require("./routes/financeRoutes");


const notificationRoutes = require('./routes/notificationRoutes');
const recipeRoutes = require("./routes/recipeRoutes");  //Rashmika
const reqIngredientsRoutes = require('./routes/reqIngredientsRoutes');  //Rashmika
const productionRoutes = require('./routes/productionRoutes'); //Rashmika
const returnsRoute = require("./routes/returns");  //Rashmika
const customizedOrdersRoute = require("./routes/customizedOrders"); //Rashmika
const staffAuthRoutes = require("./routes/staffAuthRoutes");
const userManagementAuditRoutes = require("./routes/userManagementAuditLogRoutes");
const userRoleRoutes = require("./routes/userRoleRoutes");
const icodeRoutes = require("./routes/icodeRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const chatSystemRoutes = require("./routes/chatSystemRoutes");


const ingredientTotalsRoutes = require("./routes/ingredientTotalsRoutes");


const notificationProductionRoutes = require('./routes/notificationProductionRoutes'); //Rahmika




app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true,              
}));

app.use(express.json());
app.use(cookieParser());
app.set("trust proxy", true);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
connectDB();

require('./utils/scheduledJobs');


app.use('/api/auth', customerAuthRoute);
app.use('/api/staff/auth', staffAuthRoutes);
app.use('/api/user-roles', userRoleRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders',orderRoutes);
app.use("/api/recipe", recipeRoutes);  //Rashmika
app.use('/api/ingredient', ingredientRoutes);
app.use('/api/special',specialRoutes);
app.use('/api/final',finalRoutes);
app.use('/api/store',storeRoutes);
app.use('/api/discounts', discountRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/finance", financeRoutes);
app.use('/api/chat', chatSystemRoutes);


app.use('/api/notifications', notificationRoutes);
app.use('/api/req_ingredients', reqIngredientsRoutes);  //Rashmika
app.use('/api/productions', productionRoutes);  //Rashmika
app.use("/api/returns", returnsRoute);  //Rashmika
app.use("/api/customized_orders", customizedOrdersRoute); //Rashmika
app.use('/api/user-management/audit', userManagementAuditRoutes);
app.use("/api/icodes", icodeRoutes);// ingredient code
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/ingredient-totals", ingredientTotalsRoutes);

app.use('/api/notifications', notificationProductionRoutes); //Rashmika

const { sendPaymentStatusEmail } = require("./utils/emailService");

// ✅ Test Email Route (temporary)
app.get("/test-email", async (req, res) => {
  try {
    await sendPaymentStatusEmail(
      "minulijayasinghe04@gmail.com",   // replace with your personal email to test
      "Test User",
      500,
      "TEST1",
      "approved"
    );
    res.send("✅ Email test sent");
  } catch (e) {
    console.error("❌ Email failed:", e);
    res.status(500).send("❌ Email failed");
  }
});


server.listen(5000, () => {
  console.log("Server + Socket.IO running on http://localhost:5000");
});
