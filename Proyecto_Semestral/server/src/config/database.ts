import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

class Database {
    private static instance: Pool;
    private static isInitialized: boolean = false;

    public static getInstance(): Pool {
        if (!Database.instance) {
            Database.instance = new Pool({
                user: process.env.DB_USER || 'postgres',
                password: process.env.DB_PASSWORD || '3434',
                host: process.env.DB_HOST || 'localhost',
                port: parseInt(process.env.DB_PORT || '5432'),
                database: 'weather_app',
                ssl: false
            });

            // Verificar conexión
            if (!Database.isInitialized) {
                Database.instance.connect()
                    .then(client => {
                        console.log('Conexión exitosa a la base de datos');
                        client.release();
                        Database.isInitialized = true;
                    })
                    .catch(err => {
                        console.error('Error conectando a la base de datos:', err.message);
                    });
            }
        }
        return Database.instance;
    }
}

export default Database.getInstance();