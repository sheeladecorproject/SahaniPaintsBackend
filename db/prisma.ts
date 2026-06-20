import { PrismaClient } from '../generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';
import pkg from 'pg';
const { Pool } = pkg;
import { config } from '../config/index.js';

// Setup connection pooling with postgres adapter as used in the root project
const pool = new Pool({ connectionString: config.databaseUrl });
const adapter = new PrismaPg(pool);

export const prisma = new PrismaClient({ adapter });
