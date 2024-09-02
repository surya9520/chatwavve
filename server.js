require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const googleAuthRoutes = require('./routes/googleauth'); 

const app = express();

// Connect to the database
connectDB();

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
}));

app.use(express.json());

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/auth/google', googleAuthRoutes);

app.listen(5000, () => {
  console.log('Server running on port 5000');
});
