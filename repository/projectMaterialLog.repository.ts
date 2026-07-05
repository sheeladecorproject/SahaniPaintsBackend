import { prisma } from "../db/prisma.js";
import type { ProjectMaterialLog, ProjectMaterialLogData } from "../dto/projectMaterialLog.dto.js";
import { BaseRepository } from "./base.repository.js";

class ProjectMaterialLogRepository extends BaseRepository<ProjectMaterialLog, ProjectMaterialLogData, any> {
    constructor() {
        // @ts-ignore
        super(prisma.project_material_logs, "PROJECT_MATERIAL_LOG");
    }

    fetchAll = async (
        data: any,
        filters: any,
        searchFields: string[] = []
    ): Promise<any[]> => {
        let where: any = {};
        
        if (data.search) {
            where.product = {
                name: {
                    contains: data.search,
                    mode: "insensitive"
                }
            };
        }

        if (filters.projectId) {
            where.projectId = filters.projectId;
        }

        if (filters.productId) {
            where.productId = filters.productId;
        }

        if (filters.date) {
            const start = new Date(filters.date);
            start.setHours(0, 0, 0, 0);
            const end = new Date(filters.date);
            end.setHours(23, 59, 59, 999);
            where.date = {
                gte: start,
                lte: end
            };
        }

        // @ts-ignore
        return await prisma.project_material_logs.findMany({
            take: data.limit || 1000,
            where,
            include: {
                project: {
                    select: {
                        name: true
                    }
                },
                product: {
                    select: {
                        name: true,
                        price: true
                    }
                }
            },
            orderBy: [
                { date: "desc" as const },
                { createdAt: "desc" as const }
            ]
        });
    }
}

export { ProjectMaterialLogRepository };
