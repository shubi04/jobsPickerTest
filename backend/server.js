const express = require('express');
const app = express();
const cors = require('cors');
const Connectdb = require('./connectdb/db');
const Userroute = require("./Routes/Userroute");

const PORT = process.env.PORT || 5000;

// Load environment variables
require("dotenv").config();

// Trust proxy for proper IP handling
app.set('trust proxy', 1);

// Basic CORS configuration
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API routes
app.use("/api", Userroute);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'NOT_FOUND',
    message: 'The requested resource was not found'
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Error:', error.message);
  res.status(500).json({
    error: 'INTERNAL_SERVER_ERROR',
    message: 'Something went wrong'
  });
});

// Connect to database
Connectdb();

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Smart Hire server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`⏰ Started at: ${new Date().toISOString()}`);
});