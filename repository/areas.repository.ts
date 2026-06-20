import { prisma } from "../db/prisma.js";
import type { Areas, AreasData } from "../dto/areas.dto.js";
import { BaseRepository } from "./base.repository.js";
import { serverUtils } from "../utils/server.utils.js";

class AreasRepository extends BaseRepository<Areas, AreasData, any> {
    constructor() {
        // @ts-ignore
        super(prisma.areas, "AREA");
    }

    fetchAll = async (
        data: any,
        filters: any,
        searchFields: string[] = []
    ): Promise<any[]> => {
        let where: any = {};
        where = serverUtils.buildWhere(where, filters, data, searchFields, this.config.hasCreatedAt);

        // @ts-ignore
        return await prisma.areas.findMany({
            take: data.limit || 100,
            where,
            include: {
                projectAreaColors: {
                    include: {
                        color: true
                    }
                }
            },
            orderBy: [
                { createdAt: "desc" as const },
                { id: "desc" as const }
            ]
        });
    }
}

export { AreasRepository };
