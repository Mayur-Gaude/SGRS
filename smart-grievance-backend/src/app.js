//app.js
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import dns from 'node:dns';

import connectDB from './config/db.js';
import routes from './routes.js';
import notFound from './middleware/notFound.middleware.js';
import errorHandler from './middleware/error.middleware.js';

const app = express();

// Force stable public DNS resolvers for Atlas SRV lookup reliability.
dns.setServers(['8.8.8.8', '1.1.1.1']);

// Connect Database
connectDB();

// Middlewares
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(morgan('dev'));

// Serve uploaded complaint media files
app.use('/uploads', express.static(path.resolve('uploads')));

// Routes
app.use('/api', routes);

// 404
app.use(notFound);

// Global Error Handler
app.use(errorHandler);

export default app;