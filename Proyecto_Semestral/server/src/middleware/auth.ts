import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import pool from '../config/database'; 

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  try {
    // Verificar si el token está en la blacklist
    const result = await pool.query(
      'SELECT id FROM blacklisted_tokens WHERE token = $1',
      [token]
    );

    if (result.rows.length > 0) {
      return res.status(401).json({ error: 'Token invalidado (logout)' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret');
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Token inválido' });
  }
};
export const logout = async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(400).json({ message: 'Token no proporcionado' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const secret = process.env.JWT_SECRET || 'default_secret';
    const decoded: any = jwt.verify(token, secret);

    const expiresAt = new Date(decoded.exp * 1000);
    // Insertamos el token en la tabla de blacklist
    await pool.query(
      'INSERT INTO blacklisted_tokens (token, expires_en) VALUES ($1, $2)',
      [token, expiresAt]
    );

    return res.status(200).json({ message: 'Sesión cerrada correctamente' });
  } catch (error) {
    return res.status(400).json({ message: 'Token inválido o expirado' });
  }
};