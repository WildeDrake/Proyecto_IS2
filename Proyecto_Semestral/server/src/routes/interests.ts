import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { getAllInterests, updateUserInterests } from '../controllers/interests';

const router = express.Router();

router.get('/getAllInterests', getAllInterests);
router.post('/updateUserInterests', authenticateToken, updateUserInterests);

export default router;