import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import compression from 'compression';
import connectdb from './config/mongodb.js';
import { trackAPIStats } from './middleware/statsMiddleware.js';
import propertyrouter from './routes/ProductRouter.js';
import userrouter from './routes/UserRoute.js';
import formrouter from './routes/formrouter.js';
import newsrouter from './routes/newsRoute.js';
import appointmentRouter from './routes/appointmentRoute.js';
import adminRouter from './routes/adminRoute.js';
import propertyRoutes from './routes/propertyRoutes.js';
import adminProperties from './routes/adminProperties.js';
import luckyrouter from './routes/luckydrawRoutes.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();

// Get directory paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Rate limiting to prevent abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // Limit each IP to 500 requests per window
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: { success: false, message: 'Too many requests, please try again later.' }
});

// Security middlewares
app.use(limiter);
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "blob:"],
      connectSrc: ["'self'", ...process.env.ALLOWED_ORIGINS?.split(',') || []]
    }
  }
}));
app.use(compression());

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(trackAPIStats);

// CORS Configuration
app.use(cors({
  origin: [
    'http://localhost:4000',
    'http://localhost:5174',
    'http://localhost:5173',
    'https://Hybrid Realty.vercel.app',
    'https://real-estate-website-admin.onrender.com',
    'https://real-estate-website-backend-zfu7.onrender.com',
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'HEAD'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Database connection
connectdb().then(() => {
  console.log('Database connected successfully');
}).catch(err => {
  console.error('Database connection error:', err);
});

// Create a temporary directory for file exports if it doesn't exist
const tempDir = path.join(__dirname, 'temp');
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir);
}

// API Routes
app.use('/api/products', propertyrouter);
app.use('/api/users', userrouter);
app.use('/api/forms', formrouter);
app.use('/api/news', newsrouter);
app.use('/api/appointments', appointmentRouter);
app.use('/api/admin', adminRouter);
app.use('/api/properties', adminProperties);
app.use('/api', propertyRoutes);
app.use('/api', luckyrouter); // Add lucky draw routes

// Status check endpoint
app.get('/api/status', (req, res) => {
  res.status(200).json({ status: 'OK', time: new Date().toISOString() });
});

// Serve static files from frontend builds
app.use('/admin', express.static(path.join(__dirname, 'admin_dist')));
app.use(express.static(path.join(__dirname, 'user_dist')));

// Handle API errors
app.use('/api', (err, req, res, next) => {
  console.error('API Error:', err);
  const statusCode = err.status || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal server error',
    statusCode,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    timestamp: new Date().toISOString()
  });
});

// Route handler for admin frontend
app.get('/admin/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin_dist', 'index.html'));
});

// Route handler for user frontend - must be the last route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'user_dist', 'index.html'));
});

// Handle unhandled rejections
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.error(err);
  process.exit(1);
});

const port = process.env.PORT || 4000;

// Start server
if (process.env.NODE_ENV !== 'test') {
  app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on port ${port}`);
    console.log(`User frontend: http://localhost:${port}`);
    console.log(`Admin frontend: http://localhost:${port}/admin`);
  });
}

export default app;