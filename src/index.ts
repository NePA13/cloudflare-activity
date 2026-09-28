export interface Env {
  p6: D1Database; // Cambiado para coincidir con el binding
}

async function queryDatabase(db: D1Database) {
  const { results } = await db.prepare("SELECT * FROM users").all();
  return results;
}

export default {
  async fetch(request, env, ctx): Promise<Response> {
    // Usamos env.p6 en lugar de env.practica6
    const data = await queryDatabase(env.p6);
    return Response.json({ message: "Hello world 3!", dbData: data });
  },
} satisfies ExportedHandler<Env>;

