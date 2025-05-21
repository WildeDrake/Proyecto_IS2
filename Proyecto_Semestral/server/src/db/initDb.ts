import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

async function initializeDatabase() {
    // First, connect to default postgres database
    const mainPool = new Pool({
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || '2347',
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432'),
        database: 'postgres'
    });

    try {
        // Check if database exists
        const dbResult = await mainPool.query(
            "SELECT 1 FROM pg_database WHERE datname = $1",
            ['weather_app']
        );

        // Create database if it doesn't exist
        if (dbResult.rows.length === 0) {
            await mainPool.query('CREATE DATABASE weather_app');
        }

        // Close connection to postgres database
        await mainPool.end();

        // Connect to weather_app database
        const appPool = new Pool({
            user: process.env.DB_USER || 'postgres',
            password: process.env.DB_PASSWORD || '2347',
            host: process.env.DB_HOST || 'localhost',
            port: parseInt(process.env.DB_PORT || '5432'),
            database: 'weather_app'
        });

        // Read and execute the SQL file for creating tables
        const sqlPath = path.join(__dirname, 'init.sql');
        const sqlFile = fs.readFileSync(sqlPath, 'utf8');
        await appPool.query(sqlFile);
        
        console.log('Base de datos inicializada correctamente');
        await appPool.end();
    } catch (error) {
        console.error('Error inicializando la base de datos:', error);
        throw error;
    }
}

// Run initialization
initializeDatabase().catch(console.error);