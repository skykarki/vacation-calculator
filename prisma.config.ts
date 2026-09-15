import "dotenv/config";
import { defineConfig, env } from "prisma/config";

const directUrl =
  process.env.DATABASE_URL_UNPOOLED ??
  process.env.POSTGRES_URL_NON_POOLING ??
  process.env.DATABASE_URL;

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic",
  datasource: {
    url: directUrl ? directUrl : env("DATABASE_URL"),
  },
});
