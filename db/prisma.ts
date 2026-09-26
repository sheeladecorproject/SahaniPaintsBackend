import { PrismaClient } from '../generated/prisma/client.js';
import { PrismaD1 } from '@prisma/adapter-d1';
import { env } from 'cloudflare:workers';

// Initialize Prisma Client using the Cloudflare D1 database adapter
const adapter = new PrismaD1((env as any).DB as any);
export const prisma = new PrismaClient({ adapter });
