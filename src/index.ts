export interface Env {
  practica6: D1Database;
}

// Sacamos la función del objeto exportado
async function queryDatabase(db: D1Database) {
  const { results } = await db.prepare("SELECT * FROM users").all();
  return results;
}

export default {
  async fetch(request, env, ctx): Promise<Response> {
    // Llamamos a la función directamente sin el 'this'
    const data = await queryDatabase(env.practica6);
    return Response.json({ message: "Hello world 3!", dbData: data });
  },
} satisfies ExportedHandler<Env>;

