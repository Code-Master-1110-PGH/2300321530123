import 'dotenv/config';
import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import Logger from '../common/middleware/logger';
import { BACKEND_PORT, NODE_ENV } from '../common/config/constants';

const app: Express = express();
const logger = new Logger();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

// API Routes (To be implemented)
app.use('/api/auth', (req: Request, res: Response) => {
  res.status(501).json({ error: 'Not implemented yet' });
});

app.use('/api/logs', (req: Request, res: Response) => {
  res.status(501).json({ error: 'Not implemented yet' });
});

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error'
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
const PORT = BACKEND_PORT as number;
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  console.log(`📝 Environment: ${NODE_ENV}`);
});
