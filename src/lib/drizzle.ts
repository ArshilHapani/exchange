import { drizzle } from "drizzle-orm/neon-http";

import * as schema from "@/db/schema";

const db = drizzle(process.env.DATABASE_URL!, { schema });

export default db;

// import { Client } from "@neondatabase/serverless";
// import { drizzle } from "drizzle-orm/neon-serverless";

// const client = new Client(process.env.DATABASE_URL!);
// const db = drizzle(client);

// export default db;
