import { prisma } from "../db/prisma.js";
import type { Authorization, AuthorizationData } from "../dto/authorization.dto.js";
import type { PaginationData } from "../dto/pagination.dto.js";
import { logger } from "../utils/logger.util.js";
import { serverUtils } from "../utils/server.utils.js";
import { BaseRepository } from "./base.repository.js";

class AuthorizationRepository extends BaseRepository<any, any, any> {
    constructor() {
        super(prisma.authorizations, "AUTHORIZATION", { hasCreatedAt: false });
    }

    create = async (data: any) => {
        await prisma.authorizations.deleteMany({
            where: {
                userId: data.userId,
            },
        });

        const records = (data.access || []).map((accessItem: any) => ({
            userId: data.userId,
            access: accessItem,
        }));

        if (!records.length) return [];

        return await prisma.authorizations.createMany({
            data: records,
            skipDuplicates: true,
        });
    };

    fetchAll = async (data: PaginationData, filters: any, searchFields: string[] = []) => {
        let where: any = {};
        where = serverUtils.buildWhere(where, filters, data, searchFields, false);
        return await prisma.authorizations.findMany({
            where,
            orderBy: [
                { id: (data.sort ?? "desc") as 'asc' | 'desc' }
            ]
        });
    };

    update = async (data: any, id: string, userId?: string) => {
        try {
            await prisma.authorizations.deleteMany({
                where: {
                    userId: data.userId || userId,
                },
            });

            const records = (data.access || []).map((accessItem: any) => ({
                userId: data.userId || userId,
                access: accessItem,
            }));

            if (!records.length) return [];

            return await prisma.authorizations.createMany({
                data: records,
                skipDuplicates: true,
            });
        } catch (error: any) {
            logger.warn(error.message);
        }
    };

    fetchAuth = async (userId: string) => {
        const data = await prisma.authorizations.findMany({
            where: {
                userId
            },
            select: {
                access: true
            }
        });
        return data.map((item: any) => item.access);
    }
}

export { AuthorizationRepository };
