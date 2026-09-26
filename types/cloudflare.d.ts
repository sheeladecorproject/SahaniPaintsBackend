// Ambient type declarations for Cloudflare Workers virtual modules.
// These modules only exist at Wrangler bundle time.

declare module "cloudflare:workers" {
    const env: {
        DB: D1Database;
        [key: string]: unknown;
    };
    export { env };
}

declare module "cloudflare:node" {
    export function httpServerHandler(options: { port: number | string }): unknown;
}

// D1Database global type (subset used by Prisma adapter)
interface D1Database {
    prepare(query: string): D1PreparedStatement;
    dump(): Promise<ArrayBuffer>;
    batch<T = unknown>(statements: D1PreparedStatement[]): Promise<D1Result<T>[]>;
    exec(query: string): Promise<D1ExecResult>;
}

interface D1PreparedStatement {
    bind(...values: unknown[]): D1PreparedStatement;
    first<T = unknown>(colName?: string): Promise<T | null>;
    run<T = unknown>(): Promise<D1Result<T>>;
    all<T = unknown>(): Promise<D1Result<T>>;
    raw<T = unknown[]>(): Promise<T[]>;
}

interface D1Result<T = unknown> {
    results: T[];
    success: boolean;
    error?: string;
    meta: Record<string, unknown>;
}

interface D1ExecResult {
    count: number;
    duration: number;
}
