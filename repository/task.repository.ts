import { prisma } from "../db/prisma.js";
import type { PaginationData } from "../dto/pagination.dto.js";
import type { Task, TaskData } from "../dto/tasks.dto.js";
import { serverUtils } from "../utils/server.utils.js";
import { BaseRepository } from "./base.repository.js";

class TaskRepository extends BaseRepository<Task, TaskData, any> {
    constructor() {
        super(prisma.tasks, "TASK");
    }

    create = async (data: TaskData): Promise<Task> => {
        return await this.model.create({
            data: {
                ...data,
                taskDate: new Date(data.taskDate)
            }
        });
    };

    fetch = async (id: string, userId?: string) => {
        const where: any = {
            [this.config.primaryKey]: id,
            ...(userId ? { userId } : {})
        };

        if (this.config.statusField) {
            where[this.config.statusField] = null;
        }
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
        return record ?? ({} as Task);
    };

    fetchAll = async (data: PaginationData, filters: any, searchFields: string[] = []) => {
        let where: any = {};

        if (this.config.statusField) {
            where[this.config.statusField] = null;
        }

        where = serverUtils.buildWhere(where, filters, data, searchFields);

        return await this.model.findMany({
            take: data.limit,
            where,
            orderBy: [
                ...(this.config.hasCreatedAt !== false
                    ? [{ createdAt: (data.sort ?? "desc") as 'asc' | 'desc' }]
                    : []
                ),
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

export { TaskRepository };
