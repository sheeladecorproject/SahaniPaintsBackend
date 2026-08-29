import { prisma } from "../db/prisma.js";
import { BaseRepository } from "./base.repository.js";

export interface ActivityLogInput {
    userId?: string | undefined;
    userName?: string | undefined;
    userRole?: string | undefined;
    action: string;
    entity: string;
    details: string;
    ipAddress?: string | undefined;
}

export interface ActivityLogFilter {
    userId?: string | undefined;
    action?: string | undefined;
    entity?: string | undefined;
    startDate?: string | undefined;
    endDate?: string | undefined;
    search?: string | undefined;
    page?: number | undefined;
    limit?: number | undefined;
}

class ActivityLogRepository extends BaseRepository<any, any, any> {
    constructor() {
        super((prisma as any).activity_logs, "ACTIVITY_LOG");
    }

    createLog = async (input: ActivityLogInput): Promise<any> => {
        try {
            return await (prisma as any).activity_logs.create({
                data: {
                    userId: input.userId || null,
                    userName: input.userName || "System",
                    userRole: input.userRole || "USER",
                    action: input.action,
                    entity: input.entity,
                    details: input.details,
                    ipAddress: input.ipAddress || null,
                }
            });
        } catch (error) {
            console.error("Failed to write activity log:", error);
            return null;
        }
    };

    fetchLogs = async (filters: ActivityLogFilter = {}): Promise<{ data: any[]; total: number; page: number; limit: number }> => {
        try {
            const page = Number(filters.page || 1);
            const limit = Number(filters.limit || 50);
            const skip = (page - 1) * limit;

            const where: any = {};

            if (filters.userId) {
                where.userId = filters.userId;
            }

            if (filters.action && filters.action !== "ALL") {
                where.action = filters.action;
            }

            if (filters.entity && filters.entity !== "ALL") {
                where.entity = filters.entity;
            }

            if (filters.startDate || filters.endDate) {
                where.createdAt = {};
                if (filters.startDate) {
                    const start = new Date(filters.startDate);
                    start.setHours(0, 0, 0, 0);
                    where.createdAt.gte = start;
                }
                if (filters.endDate) {
                    const end = new Date(filters.endDate);
                    end.setHours(23, 59, 59, 999);
                    where.createdAt.lte = end;
                }
            }

            if (filters.search) {
                where.OR = [
                    { userName: { contains: filters.search, mode: "insensitive" } },
                    { entity: { contains: filters.search, mode: "insensitive" } },
                    { action: { contains: filters.search, mode: "insensitive" } },
                    { details: { contains: filters.search, mode: "insensitive" } },
                ];
            }

            const [data, total] = await Promise.all([
                (prisma as any).activity_logs.findMany({
                    where,
                    orderBy: { createdAt: "desc" },
                    skip,
                    take: limit,
                    include: {
                        user: {
                            select: {
                                id: true,
                                username: true,
                                email: true,
                                role: true,
                            }
                        }
                    }
                }),
                (prisma as any).activity_logs.count({ where })
            ]);

            return { data, total, page, limit };
        } catch (error) {
            console.error("Error fetching activity logs:", error);
            return { data: [], total: 0, page: 1, limit: 50 };
        }
    };
}

export { ActivityLogRepository };
