export interface Env {
  practica6: D1Database;
}

// 1. Added the 'function' keyword here
async function queryDatabase(db: D1Database) {
  // Connect and execute a query
  const { results } = await db.prepare("SELECT * FROM users").all();
  return results;
}

export default {
  async fetch(request, env, ctx): Promise<Response> {
    // 2. Moved the database query inside the fetch handler 
    // where the 'env' object is actually available and valid.
    const data = await queryDatabase(env.practica6);
    
    // You can now use 'data' in your response
    return new Response("Hola desde el worker Soy Nestor. Datos: " + JSON.stringify(data));
  },
} satisfies ExportedHandler<Env>;


