import dotenv from "dotenv";
import path from "path";

if (typeof process !== "undefined" && process.versions?.node) {
    dotenv.config({ path: path.resolve(process.cwd(), `.env.${process.env.NODE_ENV || "development"}`) });
    dotenv.config();
}

interface Config {
    port: number;
    jwtSecret: string;
    directDbConnection: string;
    databaseUrl: string;
    cronKey: string;
}

const config: Config = {
    get port() { return Number(process.env.PORT || 4000); },
    get jwtSecret() { return process.env.JWT_SECRET || "sheeladecor"; },
    get directDbConnection() { return process.env.DIRECT_URL ?? ""; },
    get databaseUrl() { return process.env.DATABASE_URL ?? ""; },
    get cronKey() { return process.env.CRON_KEY ?? "cronjobvalue"; }
};

export { config };
