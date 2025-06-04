import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { getAllInterests, updateUserInterests, getUserInterests } from '../controllers/interests';

const router = express.Router();

router.get('/getAllInterests', getAllInterests);
router.post('/updateUserInterests', authenticateToken, updateUserInterests);
router.get('/getUserInterests', authenticateToken, getUserInterests);

export default router;