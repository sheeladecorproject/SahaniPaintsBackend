import { prisma } from "../db/prisma.js";
import type { ContractorWorkLog, ContractorWorkLogData } from "../dto/contractorWorkLog.dto.js";
import { BaseRepository } from "./base.repository.js";

class ContractorWorkLogRepository extends BaseRepository<ContractorWorkLog, ContractorWorkLogData, any> {
    constructor() {
        // @ts-ignore
        super(prisma.contractor_work_logs, "CONTRACTOR_WORK_LOG");
    }

    fetchAll = async (
        data: any,
        filters: any,
        searchFields: string[] = []
    ): Promise<any[]> => {
        let where: any = {};
        
        if (data.search) {
            where.contractor = {
                name: {
                    contains: data.search,
                    mode: "insensitive"
                }
            };
        }

        if (filters.projectId) {
            where.projectId = filters.projectId;
        }

        if (filters.contractorId) {
            where.contractorId = filters.contractorId;
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
        return await prisma.contractor_work_logs.findMany({
            take: data.limit || 1000,
            where,
            include: {
                project: {
                    select: {
                        name: true
                    }
                },
                contractor: {
                    select: {
                        name: true
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

export { ContractorWorkLogRepository };
