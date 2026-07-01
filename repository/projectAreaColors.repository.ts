import { prisma } from "../db/prisma.js";
import type { ProjectAreaColors, ProjectAreaColorsData } from "../dto/projectAreaColors.dto.js";
import { BaseRepository } from "./base.repository.js";
import { serverUtils } from "../utils/server.utils.js";

class ProjectAreaColorsRepository extends BaseRepository<ProjectAreaColors, ProjectAreaColorsData, any> {
    constructor() {
        // @ts-ignore
        super(prisma.project_area_colors, "PROJECT_AREA_COLOR");
    }

    fetchAll = async (
        data: any,
        filters: any,
        searchFields: string[] = []
    ): Promise<any[]> => {
        let where: any = {};
        where = serverUtils.buildWhere(where, filters, data, searchFields, this.config.hasCreatedAt);

        return await prisma.project_area_colors.findMany({
            take: data.limit || 100,
            where,
            include: {
                area: true,
                color: true
            },
            orderBy: [
                { createdAt: "desc" as const },
                { id: "desc" as const }
            ]
        });
    }
}

export { ProjectAreaColorsRepository };
