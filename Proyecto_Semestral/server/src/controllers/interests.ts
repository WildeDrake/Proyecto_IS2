import { Request, Response } from 'express';
import pool from '../config/database';

export const getAllInterests = async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM interests');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener las actividades' });
  }
};

export const updateUserInterests = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const { interests } = req.body;

  if (!userId || !Array.isArray(interests)) {
    return res.status(400).json({ error: 'Datos inválidos' });
  }

  try {
    // Eliminar intereses previos
    await pool.query('DELETE FROM user_interests WHERE user_id = $1', [userId]);

    // Insertar nuevos intereses si existen en la tabla
    for (const name of interests) {
      const result = await pool.query('SELECT id FROM interests WHERE name = $1', [name]);
      if (result.rows.length > 0) {
        const interestId = result.rows[0].id;
        await pool.query(
          'INSERT INTO user_interests (user_id, interest_id) VALUES ($1, $2)',
          [userId, interestId]
        );
      }
    }

    res.status(200).json({ message: 'Intereses actualizados correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar intereses' });
  }
};

export const getUserInterests = async (req: Request, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(400).json({ error: 'Usuario no autenticado' });
  }
  try {
    const result = await pool.query(
      `SELECT i.name FROM interests i
       JOIN user_interests ui ON i.id = ui.interest_id
       WHERE ui.user_id = $1`,
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener los intereses del usuario' });
  }
};