import { prisma } from "../db/prisma.js";
import type { Task, TaskData } from "../dto/tasks.dto.js";
import type { TaskRepository } from "../repository/task.repository.js";
import { BaseService } from "./base.service.js";
import { ServerError } from "../utils/error.utils.js";

class TaskService extends BaseService<Task, TaskData, TaskRepository> {
    constructor(methods: TaskRepository){
        super(methods, "TASK");
    }

    create = async (data: any): Promise<Task> => {
        if (!data.projectId && (data.project || data.projectName)) {
            const pName = (data.project || data.projectName).toString().trim();
            const proj = await prisma.projects.findFirst({
                where: { name: { equals: pName, mode: 'insensitive' } }
            });
            if (proj) {
                data.projectId = proj.id;
            } else {
                throw new ServerError({
                    status: 400,
                    message: `Project "${pName}" not found. Please create or specify a valid project.`
                });
            }
        }
        delete data.project;
        delete data.projectName;
        return await this.method.create(data);
    };

    createMany = async (data: any[]): Promise<Task[]> => {
        const projects = await prisma.projects.findMany();
        const projMap = new Map(projects.map(p => [p.name.toLowerCase().trim(), p.id]));

        for (const item of data) {
            if (!item.projectId && (item.project || item.projectName)) {
                const pName = (item.project || item.projectName).toString().trim().toLowerCase();
                const foundId = projMap.get(pName);
                if (foundId) {
                    item.projectId = foundId;
                } else {
                    throw new ServerError({
                        status: 400,
                        message: `Project "${item.project || item.projectName}" not found for task "${item.title}".`
                    });
                }
            }
            delete item.project;
            delete item.projectName;
        }
        return await this.method.createMany(data);
    };
}

export { TaskService };
