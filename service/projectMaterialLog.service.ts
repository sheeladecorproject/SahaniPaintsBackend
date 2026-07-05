import type { ProjectMaterialLog, ProjectMaterialLogData } from "../dto/projectMaterialLog.dto.js";
import type { ProjectMaterialLogRepository } from "../repository/projectMaterialLog.repository.js";
import { BaseService } from "./base.service.js";

class ProjectMaterialLogService extends BaseService<ProjectMaterialLog, ProjectMaterialLogData, ProjectMaterialLogRepository> {
    constructor(methods: ProjectMaterialLogRepository){
        super(methods, "PROJECT_MATERIAL_LOG");
    }
}

export { ProjectMaterialLogService };
