import express from 'express';
import { getFavorites, addFavorite, removeFavorite } from '../controllers/favorites';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.get('/', authenticateToken, getFavorites);
router.post('/', authenticateToken, addFavorite);
router.delete('/', authenticateToken, removeFavorite);

export default router;