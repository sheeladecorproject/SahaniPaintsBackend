import { prisma } from "../db/prisma.js";
import type { PaginationData } from "../dto/pagination.dto.js";
import type { LowMaterial, LowMaterialData } from "../dto/lowMaterials.dto.js";
import { serverUtils } from "../utils/server.utils.js";
import { BaseRepository } from "./base.repository.js";

class LowMaterialsRepository extends BaseRepository<LowMaterial, LowMaterialData, any> {
    constructor() {
        super(prisma.low_materials, "LOW_MATERIALS");
    }

    create = async (data: LowMaterialData): Promise<LowMaterial> => {
        try {
            const record = await this.model.create({
                data: {
                    ...data,
                    date: data.date ? new Date(data.date) : new Date(),
                },
                include: {
                    project: {
                        select: { id: true, name: true }
                    }
                }
            });
            return record as LowMaterial;
        } catch (error) {
            this.handlePrismaError(error);
        }
    };

    fetch = async (id: string) => {
        const where: any = {
            id
        };
        const record = await this.model.findFirst({
            where,
            include: {
                project: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });
        return record ?? ({} as LowMaterial);
    };

    fetchAll = async (data: PaginationData, filters: any, searchFields: string[] = []) => {
        let where: any = {};
        where = serverUtils.buildWhere(where, filters, data, searchFields);

        return await this.model.findMany({
            take: data.limit,
            where,
            orderBy: [
                { createdAt: (data.sort ?? "desc") as 'asc' | 'desc' },
                { id: (data.sort ?? "desc") as 'asc' | 'desc' }
            ],
            include: {
                project: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });
    };
}

export { LowMaterialsRepository };
