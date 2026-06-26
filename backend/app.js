import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';

import profileRoutes from './routes/profileRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import achievementRoutes from './routes/achievementRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import journeyRoutes from './routes/journeyRoutes.js';
import technologyRoutes from './routes/technologyRoutes.js';
import statsRoutes from './routes/statsRoutes.js';
import authRoutes from './routes/authRoutes.js';
import resourceRoutes from './routes/resourceRoutes.js';
import interestRoutes from './routes/interestRoutes.js';
import processRoutes from './routes/processRoutes.js';
import socialMediaRoutes from './routes/socialMediaRoutes.js';
import blogRoutes from './routes/blogRoutes.js';

const app = express();

// Set security HTTP headers
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Prevent parameter pollution
app.use(hpp());

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. mobile apps, curl requests)
    if (!origin) return callback(null, true);
    
    // Check if the origin is localhost
    if (/^http:\/\/localhost(:\d+)?$/.test(origin)) {
      return callback(null, true);
    }

    // Check if the origin is in the allowed list from environment variables
    const allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : [];
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/journey', journeyRoutes);
app.use('/api/technologies', technologyRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/interests', interestRoutes);
app.use('/api/process', processRoutes);
app.use('/api/social-media', socialMediaRoutes);
app.use('/api/blogs', blogRoutes);


app.use(notFound);
app.use(errorHandler);

export default app;
