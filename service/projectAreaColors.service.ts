import type { ProjectAreaColors, ProjectAreaColorsData } from "../dto/projectAreaColors.dto.js";
import type { ProjectAreaColorsRepository } from "../repository/projectAreaColors.repository.js";
import { BaseService } from "./base.service.js";

class ProjectAreaColorsService extends BaseService<ProjectAreaColors, ProjectAreaColorsData, ProjectAreaColorsRepository> {
    constructor(methods: ProjectAreaColorsRepository){
        super(methods, "PROJECT_AREA_COLOR");
    }
}

export { ProjectAreaColorsService };
