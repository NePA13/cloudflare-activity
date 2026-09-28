export interface Env {
  practica6: D1Database;
}

export default{
  async fetch(request, env, ctx): Promise<Response> {

    const data = await this.queryDatabase(env.practica6);
    return Response.json({ message: "Hello world 3!", dbData: data });
},
  async queryDatabase(db: D1Database){
    const {results} = await db.prepare("SELECT * FROM users").all();
    return results;
  }



} satisfies ExportedHandler<Env>;


