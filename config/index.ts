import dotenv from "dotenv";
import path from "path";

dotenv.config({
    path: path.resolve(process.cwd(), `.env.${process.env.NODE_ENV || "development"}`)
});

interface Config {
    port: number;
    jwtSecret: string;
    directDbConnection: string;
    databaseUrl: string;
    cronKey: string;
    cloudflareD1DatabaseName?: string;
    cloudflareD1DatabaseId?: string;
}

const config: Config = {
    port: Number(process.env.PORT || 3001), // Default to 3001 for Paints project to avoid collision
    jwtSecret: process.env.JWT_SECRET ?? "default_paints_secret",
    directDbConnection: process.env.DIRECT_URL ?? "",
    databaseUrl: process.env.DATABASE_URL ?? "",
    cronKey: process.env.CRON_KEY ?? "",
    cloudflareD1DatabaseName: process.env.CLOUDFLARE_DATABASE_NAME ?? "sahani-paints",
    cloudflareD1DatabaseId: process.env.CLOUDFLARE_DATABASE_ID ?? "4de15c22-2810-4e49-b5b2-12c3b6f7f55b"
};

export { config };
