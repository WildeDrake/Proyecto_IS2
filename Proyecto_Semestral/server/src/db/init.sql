-- Verificar si la base de datos existe y crearla si no
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM pg_database WHERE datname = 'weather_app') THEN
        CREATE DATABASE weather_app;
    END IF;
END
$$;



-- Create users table if not exists
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create interests table if not exists
CREATE TABLE IF NOT EXISTS interests (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

-- Create user_interests junction table if not exists
CREATE TABLE IF NOT EXISTS user_interests (
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    interest_id INTEGER REFERENCES interests(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, interest_id)
);

-- Insert default interests if they don't exist
INSERT INTO interests (name) 
VALUES 
    ('Deporte al aire Libre'),
    ('Salir a Caminar'),
    ('Jugar Futbol'),
    ('Ir a la Playa'),
    ('Hacer Picnic'),
    ('Correr'),
    ('Hacer Senderismo'),
    ('Jugar Tenis'),
    ('Jugar Basquetbol'),
    ('Jugar Golf'),
    ('Jugar Beisbol'),
    ('Hacer Surf'),
    ('Hacer Escalada'),
    ('Hacer Ciclismo'),
    ('Hacer Yoga'),
    ('Hacer Ejercicio en Casa'),
    ('Ciclismo'),
    ('Senderismo'),
    ('Escalada'),
    ('Surf'),
    ('Yoga'),
    ('Natación')

ON CONFLICT (name) DO NOTHING;