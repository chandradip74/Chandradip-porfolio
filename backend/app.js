import express from 'express';
import cors from 'cors';
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


const app = express();

app.use(cors({
  origin: (origin, callback) => {
    // Allow all localhost origins (any port) and requests with no origin (e.g. mobile/curl)
    if (!origin || /^http:\/\/localhost(:\d+)?$/.test(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
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


app.use(notFound);
app.use(errorHandler);

export default app;
