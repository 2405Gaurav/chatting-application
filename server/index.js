import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoute from './routes/auth.route.js';

// Load environment variables
dotenv.config({ path: './.env' });

const app = express();

// Get environment variables
const PORT = process.env.PORT || 3001;
const DATABASE_URL = process.env.DATABASE_URL;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
}));

app.use(cookieParser());
app.use(express.json());

// Routes
app.use('/api/auth', authRoute); // Make sure this matches frontend config

// Test route
app.get('/', (req, res) => {
  res.json('✅ Hello from Express Server!');
});

// Connect to MongoDB and start server only if successful
const startServer = async () => {
  try {
    await mongoose.connect(DATABASE_URL);
    console.log('✅ MongoDB connection successful');

    app.listen(PORT, () => {
      console.log(`🚀 Server running at: http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1); // Stop execution if DB fails
  }
};

startServer();
