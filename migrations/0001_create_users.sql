-- Crea la tabla users (igual que la de Dev) para la base de datos de Producción
CREATE TABLE IF NOT EXISTS users (
	users TEXT
);

INSERT INTO users (users)
SELECT 'Nestor'
WHERE NOT EXISTS (SELECT 1 FROM users);
