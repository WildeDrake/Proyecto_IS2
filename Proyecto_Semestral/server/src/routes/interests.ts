import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { getAllInterests, updateUserInterests, getUserInterests, getUserInterestsById } from '../controllers/interests';

const router = express.Router();

// Rutas públicas
router.get('/', getAllInterests);  // GET /api/interests

// Rutas protegidas
router.put('/', authenticateToken, updateUserInterests);  // PUT /api/interests
router.get('/user', authenticateToken, getUserInterests); // GET /api/interests/user
router.get('/user/:userId', authenticateToken, getUserInterestsById); // GET /api/interests/user/:userId

export default router;