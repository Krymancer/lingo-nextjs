import "dotenv/config";
import type { Config } from "drizzle-kit";
import { connect } from "http2";

export default {
  schema: "./database/schema.ts",
  out: "./drizzle",
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  }
} satisfies Config;