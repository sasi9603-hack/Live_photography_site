import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import eventRoutes from './routes/eventRoutes.js';

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middlewares
app.use(cors({
  origin: '*', // For local testing; in production, configure to Vercel URL
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploaded files (Fallback local storage mode)
app.use('/uploads', express.static(path.join(process.cwd(), 'public', 'uploads')));

// Serve index file for home route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to the Photography Client Gallery Portal API',
    mode: process.env.MONGO_URI ? 'MongoDB Atlas' : 'In-Memory Mock Database'
  });
});

// Map Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Server Error'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
