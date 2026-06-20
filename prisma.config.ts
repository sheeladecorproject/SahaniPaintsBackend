import "dotenv/config";
import { defineConfig } from "prisma/config";
import { config } from "./config/index.js";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: config.databaseUrl,
    // @ts-ignore
    directUrl: config.directDbConnection,
  },
});
