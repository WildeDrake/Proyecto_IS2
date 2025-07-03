import { Request, Response } from 'express';
import pool from '../config/database';

export const getFavorites = async (req: Request, res: Response) => {
  const userId = req.user.id;
  const result = await pool.query(
    'SELECT city FROM user_favorites WHERE user_id = $1',
    [userId]
  );
  res.json(result.rows.map(r => r.city));
};

export const addFavorite = async (req: Request, res: Response) => {
  const userId = req.user.id;
  const { city } = req.body;
  if (!city) return res.status(400).json({ error: 'Ciudad requerida' });
  await pool.query(
    'INSERT INTO user_favorites (user_id, city) VALUES ($1, $2) ON CONFLICT DO NOTHING',
    [userId, city]
  );
  res.json({ success: true });
};

export const removeFavorite = async (req: Request, res: Response) => {
  const userId = req.user.id;
  const { city } = req.body;
  if (!city) return res.status(400).json({ error: 'Ciudad requerida' });
  await pool.query(
    'DELETE FROM user_favorites WHERE user_id = $1 AND city = $2',
    [userId, city]
  );
  res.json({ success: true });
};