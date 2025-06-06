-- Script para insertar los intereses en la base de datos
-- Ejecutar con: psql -U postgres -d weather_app -f insert_interests.sql

INSERT INTO interests (
    name, climas_permitidos, temp_min, temp_max, viento_min, viento_max, humedad_min, humedad_max, vis_min_km, requiere_sin_lluvia
) VALUES
    ('Salir a caminar', ARRAY[0,2], 16, 26, 0, 20, 0, 100, 5, false),
    ('Jugar fútbol', ARRAY[0,1], 16, 28, 0, 25, 0, 80, 6, false),
    ('Salir en bicicleta', ARRAY[0,1], 15, 30, 0, 30, 0, 75, 7, false),
    ('Senderismo', ARRAY[0,1], 10, 25, 0, 25, 0, 80, 5, false),
    ('Nadar', ARRAY[2,1], 26, 35, 0, 20, 0, 80, 5, false),
    ('Ir a la playa', ARRAY[0], 25, 35, 0, 25, 0, 75, 5, false),
    ('Correr al aire libre', ARRAY[0,1,5], 15, 28, 0, 20, 0, 70, 5, false),
    ('Ir al parque con amigos', ARRAY[0,1], 18, 30, 0, 25, 0, 80, 5, false),
    ('Escalar al aire libre', ARRAY[0], 10, 25, 0, 20, 0, 60, 5, false),
    ('Jugar tenis', ARRAY[0,1], 15, 28, 0, 15, 0, 75, 6, false),
    ('Hacer picnic', ARRAY[0,1], 18, 30, 0, 20, 0, 100, 5, false),
    ('Fotografía al aire libre', ARRAY[0,1,6], 5, 25, 0, 20, 0, 100, 3, false),
    ('Volar drone', ARRAY[0], 10, 30, 0, 20, 0, 70, 7, false),
    ('Ciclismo de montaña', ARRAY[0,1,9], 10, 28, 0, 25, 0, 70, 5, false),
    ('Patinaje o skate', ARRAY[0,1], 15, 28, 0, 20, 0, 80, 5, false),
    ('Paseo en bote', ARRAY[0], 18, 30, 0, 15, 0, 80, 6, false),
    ('Camping', ARRAY[0,1], 10, 28, 0, 25, 0, 80, 5, false),
    ('Noche de estrellas', ARRAY[0], 0, 40, 0, 15, 0, 90, 8, false),
    ('Barbacoa en el patio', ARRAY[0,1], 20, 32, 0, 25, 0, 80, 5, false),
    ('Juegos en plaza', ARRAY[9,4], 18, 30, 0, 20, 0, 80, 5, false)
ON CONFLICT (name) DO NOTHING;

-- Verificar que se insertaron correctamente
SELECT COUNT(*) as total_intereses FROM interests;
SELECT id, name FROM interests ORDER BY id;