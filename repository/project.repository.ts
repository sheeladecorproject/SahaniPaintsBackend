import { prisma } from "../db/prisma.js";
import type { Project, ProjectData } from "../dto/project.dto.js";
import { BaseRepository } from "./base.repository.js";

class ProjectRepository extends BaseRepository<Project, ProjectData, any> {
    constructor() {
        super(prisma.projects, "PROJECT");
    }

    fetch = async (id: string, userId?: string): Promise<any> => {
        const project = await prisma.projects.findFirst({
            where: {
                id,
                ...(userId ? { creatorId: userId } : {})
            },
            include: {
                customer: {
                    select: {
                        name: true
                    }
                },
                creator: {
                    select: {
                        username: true
                    }
                }
            }
        });
        return project ?? ({} as any);
    }

    fetchAll = async (data: any, filters: any, searchFields: string[] = []): Promise<any[]> => {
        let where: any = {};
        // Set hasCreatedAt filter to true as default
        where = this.config.statusField ? { [this.config.statusField]: null } : {};
        
        // We override this to fetch relations
        return await prisma.projects.findMany({
            take: data.limit || 10,
            where,
            include: {
                customer: {
                    select: {
                        name: true
                    }
                },
                creator: {
                    select: {
                        username: true
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

export { ProjectRepository };
