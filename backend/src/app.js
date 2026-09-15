import path from 'path';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env.js';
import { generalLimiter } from './middlewares/rateLimiter.js';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler.js';
import apiRouter from './routes/index.js';

const app = express();

// Security Middlewares
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' }
  })
);
app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

// Serve static uploads
app.use('/uploads', express.static(path.resolve('uploads')));

// General Rate Limiting
app.use(generalLimiter);

// HTTP Request Logger
if (env.NODE_ENV !== 'test') {
  app.use(morgan(env.NODE_ENV === 'development' ? 'dev' : 'combined'));
}

// Body Parsing Middlewares
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Root welcome route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to HerSpace API. Check /api/v1/health for service health.',
    documentation: '/api/v1'
  });
});

// Mount /api/v1 routes
app.use('/api/v1', apiRouter);

// 404 Handler
app.use(notFoundHandler);

// Centralized Error Handler
app.use(errorHandler);

export default app;
