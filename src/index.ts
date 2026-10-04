import { getUsers } from "./users";

export interface Env {
	p6: D1Database; // Binding de la base de datos D1 (ver wrangler.jsonc)
}

export default {
	async fetch(request, env, ctx): Promise<Response> {
		const url = new URL(request.url);

		if (request.method !== "GET") {
			return Response.json({ error: "Método no permitido" }, { status: 405 });
		}

		if (url.pathname === "/health") {
			return Response.json({ status: "ok" });
		}

		try {
			const data = await getUsers(env.p6);
			return Response.json({ message: "Hello world 3!", dbData: data });
		} catch (err) {
			return Response.json(
				{ error: "Error al consultar la base de datos" },
				{ status: 500 },
			);
		}
	},
} satisfies ExportedHandler<Env>;
