-- Insertar los 14 intereses predefinidos solo si la tabla está vacía
INSERT INTO interests (name, climas_permitidos, temp_min, temp_max, viento_min, viento_max, humedad_min, humedad_max, vis_min_km, requiere_sin_lluvia, descripcion, estado) 
SELECT * FROM (VALUES
('Caminar', ARRAY[800, 801, 802, 803, 804], 10, 30, 0, 20, 0, 80, 2, false, 'Actividad de caminar al aire libre', true),
('Correr', ARRAY[800, 801], 5, 25, 0, 15, 0, 70, 3, true, 'Actividad de correr', true),
('Natación', ARRAY[800, 801, 802], 20, 35, 0, 25, 0, 90, 1, false, 'Natación en piscina o mar', true),
('Ciclismo', ARRAY[800, 801, 802], 10, 30, 0, 20, 0, 75, 5, true, 'Andar en bicicleta', true),
('Gimnasio', ARRAY[200, 300, 500, 600, 700, 800, 801, 802, 803, 804], -10, 40, 0, 50, 0, 100, 0, false, 'Actividades en gimnasio interior', true),
('Tenis', ARRAY[800, 801], 15, 30, 0, 15, 0, 70, 5, true, 'Jugar tenis', true),
('Fútbol', ARRAY[800, 801, 802], 10, 30, 0, 20, 0, 80, 3, true, 'Jugar fútbol', true),
('Yoga', ARRAY[800, 801, 802, 803], 15, 35, 0, 15, 0, 85, 1, false, 'Práctica de yoga', true),
('Jardinería', ARRAY[800, 801, 802, 803], 10, 30, 0, 20, 0, 90, 2, false, 'Trabajo en el jardín', true),
('Fotografía', ARRAY[800, 801, 802, 803, 804], 5, 35, 0, 25, 0, 95, 3, false, 'Fotografía al aire libre', true),
('Picnic', ARRAY[800, 801], 18, 30, 0, 15, 0, 70, 5, true, 'Picnic al aire libre', true),
('Parrillada', ARRAY[800, 801], 15, 30, 0, 20, 0, 75, 3, true, 'Asado o barbacoa', true),
('Pesca', ARRAY[800, 801, 802, 803], 10, 30, 0, 25, 0, 90, 2, false, 'Pesca deportiva', true),
('Camping', ARRAY[800, 801], 10, 25, 0, 20, 0, 80, 5, true, 'Acampar al aire libre', true)
) AS v(name, climas_permitidos, temp_min, temp_max, viento_min, viento_max, humedad_min, humedad_max, vis_min_km, requiere_sin_lluvia, descripcion, estado)
WHERE NOT EXISTS (SELECT 1 FROM interests);

-- Nota sobre los códigos de clima:
-- 800: Cielo despejado
-- 801: Pocas nubes
-- 802: Nubes dispersas
-- 803: Nubes rotas
-- 804: Muy nublado
-- 200-299: Tormenta
-- 300-399: Llovizna
-- 500-599: Lluvia
-- 600-699: Nieve
-- 700-799: Atmósfera (niebla, polvo, etc.)