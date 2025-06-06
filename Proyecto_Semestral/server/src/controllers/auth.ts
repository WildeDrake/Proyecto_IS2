import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/database';

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, interests } = req.body;
    
    // Validaciones básicas
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      // Verificar si el email ya existe
      const existingUser = await client.query(
        'SELECT id FROM users WHERE email = $1',
        [email]
      );
      
      if (existingUser.rows.length > 0) {
        await client.query('ROLLBACK');
        return res.status(400).json({ error: 'El email ya está registrado' });
      }
      
      // Crear usuario
      const userResult = await client.query(
        'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id',
        [name, email, hashedPassword]
      );
      
      const userId = userResult.rows[0].id;
      
      // Si hay intereses, insertarlos
      if (interests && interests.length > 0) {
        // Verificar que todos los intereses existan
        const interestsCheck = await client.query(
          'SELECT id FROM interests WHERE id = ANY($1::int[])',
          [interests]
        );
        
        if (interestsCheck.rows.length !== interests.length) {
          await client.query('ROLLBACK');
          return res.status(400).json({ error: 'Algunos intereses no son válidos' });
        }
        
        // Insertar los intereses del usuario
        for (const interestId of interests) {
          await client.query(
            'INSERT INTO user_interests (user_id, interest_id) VALUES ($1, $2)',
            [userId, interestId]
          );
        }
      }
      
      await client.query('COMMIT');
      
      res.status(201).json({
        user: {
          id: userId,
          name,
          email
        }
      });
    } catch (err: any) {
      await client.query('ROLLBACK');
      
      // Manejar errores específicos de base de datos
      if (err.code === '23505') { // Unique violation
        return res.status(400).json({ error: 'El email ya está registrado' });
      }
      
      throw err;
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('Error en registro:', err);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'default_secret',
      { expiresIn: '24h' }
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: 'Error al iniciar sesión' });
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

    const expiresAt = new Date(decoded.exp * 1000); // exp es en segundos

    await pool.query(
      'INSERT INTO blacklisted_tokens (token, expira_en) VALUES ($1, $2)',
      [token, expiresAt]
    );

    return res.status(200).json({ message: 'Sesión cerrada correctamente' });
  } catch (error) {
    return res.status(400).json({ message: 'Token inválido o expirado' });
  }
};