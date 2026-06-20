import type { Project, ProjectData } from "../dto/project.dto.js";
import type { ProjectRepository } from "../repository/project.repository.js";
import { BaseService } from "./base.service.js";

class ProjectService extends BaseService<Project, ProjectData, ProjectRepository> {
    constructor(methods: ProjectRepository){
        super(methods, "PROJECT");
    }
}

export { ProjectService };
