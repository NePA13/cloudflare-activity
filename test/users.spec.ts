import { env } from "cloudflare:test";
import { describe, it, expect, beforeEach } from "vitest";
import { isValidUserName, normalizeUserName, getUsers } from "../src/users";

describe("isValidUserName", () => {
	it("acepta un nombre válido", () => {
		expect(isValidUserName("Nestor")).toBe(true);
	});

	it("rechaza nombres vacíos o muy cortos", () => {
		expect(isValidUserName("")).toBe(false);
		expect(isValidUserName("   ")).toBe(false);
		expect(isValidUserName("N")).toBe(false);
	});

	it("rechaza nombres de más de 50 caracteres", () => {
		expect(isValidUserName("a".repeat(51))).toBe(false);
	});

	it("rechaza valores que no son string", () => {
		expect(isValidUserName(123)).toBe(false);
		expect(isValidUserName(null)).toBe(false);
	});
});

describe("normalizeUserName", () => {
	it("quita espacios extra", () => {
		expect(normalizeUserName("  Nestor   Perez ")).toBe("Nestor Perez");
	});

	it("lanza error con un nombre inválido", () => {
		expect(() => normalizeUserName("")).toThrow("Nombre de usuario inválido");
	});
});

describe("getUsers (D1)", () => {
	beforeEach(async () => {
		await env.p6.exec("DROP TABLE IF EXISTS users");
		await env.p6.exec("CREATE TABLE users (users TEXT)");
		await env.p6.exec("INSERT INTO users (users) VALUES ('Nestor'), ('Carlos')");
	});

	it("regresa los usuarios de la base de datos", async () => {
		const users = await getUsers(env.p6);
		expect(users).toHaveLength(2);
		expect(users[0]).toEqual({ users: "Nestor" });
	});
});
