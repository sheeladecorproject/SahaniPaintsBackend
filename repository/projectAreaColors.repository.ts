import { prisma } from "../db/prisma.js";
import type { ProjectAreaColors, ProjectAreaColorsData } from "../dto/projectAreaColors.dto.js";
import { BaseRepository } from "./base.repository.js";

class ProjectAreaColorsRepository extends BaseRepository<ProjectAreaColors, ProjectAreaColorsData, any> {
    constructor() {
        // @ts-ignore
        super(prisma.project_area_colors, "PROJECT_AREA_COLOR");
    }
}

export { ProjectAreaColorsRepository };
