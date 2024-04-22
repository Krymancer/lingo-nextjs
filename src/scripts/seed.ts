import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

import * as schema from "@/database/schema";

const sql = neon(process.env.DATABASE_URL!);
const database = drizzle(sql, { schema });

const main = async () => {
  try {
    console.log("Seeding database");

    await database.delete(schema.courses);
    await database.delete(schema.userProgress);

    await database.insert(schema.courses).values([
      { id: 1, title: "Portuguse", imageSrc: "/br.svg" },
      { id: 2, title: "Spanish", imageSrc: "/es.svg" },
      { id: 3, title: "English", imageSrc: "/us.svg" },
      { id: 4, title: "German", imageSrc: "/de.svg" },
      { id: 5, title: "French", imageSrc: "/fr.svg" },
    ]);

    console.log("Seeding finish");
  } catch (error) {
    console.error(error);
    throw new Error("Failed to seed database");
  }
}

main();