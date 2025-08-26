const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { connectDB, sequelize } = require('./config/db');

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Test DB connection
connectDB();

// Sync Sequelize models
sequelize.sync()
  .then(() => console.log("All models synced"))
  .catch(err => console.log("Model sync error:", err));

// Routes
app.use('/api/auth', require('./routes/authRoute'));
app.use('/api/products', require('./routes/productRoutes'));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
