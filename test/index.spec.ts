import {
	env,
	createExecutionContext,
	waitOnExecutionContext,
	SELF,
} from "cloudflare:test";
import { describe, it, expect, beforeEach } from "vitest";
import worker from "../src/index";

const IncomingRequest = Request<unknown, IncomingRequestCfProperties>;

async function crearTablaUsers() {
	await env.p6.exec("DROP TABLE IF EXISTS users");
	await env.p6.exec("CREATE TABLE users (users TEXT)");
	await env.p6.exec("INSERT INTO users (users) VALUES ('Nestor')");
}

describe("Worker con D1", () => {
	beforeEach(crearTablaUsers);

	it("GET / regresa el mensaje y los usuarios (unit style)", async () => {
		const request = new IncomingRequest("http://example.com/");
		const ctx = createExecutionContext();
		const response = await worker.fetch(request, env, ctx);
		await waitOnExecutionContext(ctx);

		expect(response.status).toBe(200);
		const body = await response.json<{ message: string; dbData: unknown[] }>();
		expect(body.message).toBe("Hello world 3!");
		expect(body.dbData).toHaveLength(1);
	});

	it("GET / funciona de punta a punta (integration style)", async () => {
		const response = await SELF.fetch("https://example.com/");
		expect(response.status).toBe(200);
		const body = await response.json<{ dbData: { users: string }[] }>();
		expect(body.dbData[0].users).toBe("Nestor");
	});

	it("GET /health regresa ok", async () => {
		const response = await SELF.fetch("https://example.com/health");
		expect(await response.json()).toEqual({ status: "ok" });
	});

	it("POST regresa 405", async () => {
		const response = await SELF.fetch("https://example.com/", { method: "POST" });
		expect(response.status).toBe(405);
	});

	it("regresa 500 si la tabla no existe", async () => {
		await env.p6.exec("DROP TABLE users");
		const response = await SELF.fetch("https://example.com/");
		expect(response.status).toBe(500);
	});
});
