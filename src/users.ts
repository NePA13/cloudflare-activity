// Lógica de negocio separada del handler para poder probarla con pruebas unitarias.

// La tabla users de D1 tiene una sola columna: users (TEXT)
export interface User {
	users: string;
}

/** Valida un nombre de usuario: string, sin espacios en los extremos vacíos, de 2 a 50 caracteres. */
export function isValidUserName(value: unknown): value is string {
	if (typeof value !== "string") return false;
	const name = value.trim();
	return name.length >= 2 && name.length <= 50;
}

/** Limpia un nombre de usuario (quita espacios extra). Lanza error si no es válido. */
export function normalizeUserName(value: unknown): string {
	if (!isValidUserName(value)) {
		throw new Error("Nombre de usuario inválido");
	}
	return value.trim().replace(/\s+/g, " ");
}

/** Consulta todos los usuarios de la base de datos D1. */
export async function getUsers(db: D1Database): Promise<User[]> {
	const { results } = await db.prepare("SELECT * FROM users").all<User>();
	return results;
}
