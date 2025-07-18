import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import userRoutes from './routes/user';
import interestsRoutes from './routes/interests';
import favoritesRoutes from './routes/favorites';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/interests', interestsRoutes);
app.use('/api/favorites', favoritesRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});