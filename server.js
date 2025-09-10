const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { connectDB, sequelize } = require('./config/db');

dotenv.config();

const app = express();

const uploadsPath = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
}

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static(uploadsPath));

connectDB();

sequelize.sync()
  .then(() => console.log("All models synced"))
  .catch(err => console.log("Model sync error:", err));

app.get('/', (req, res) => {
  res.send('Backend is running');
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', require('./routes/authRoute'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/activities', require('./routes/activityRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
