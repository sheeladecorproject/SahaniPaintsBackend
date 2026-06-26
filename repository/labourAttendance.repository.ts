import { prisma } from "../db/prisma.js";
import type { LabourAttendance, LabourAttendanceData } from "../dto/labourAttendance.dto.js";
import { BaseRepository } from "./base.repository.js";

class LabourAttendanceRepository extends BaseRepository<LabourAttendance, LabourAttendanceData, any> {
    constructor() {
        // @ts-ignore
        super(prisma.labour_attendance, "LABOUR_ATTENDANCE");
    }

    fetchAll = async (
        data: any,
        filters: any,
        searchFields: string[] = []
    ): Promise<any[]> => {
        let where: any = {};
        
        if (data.search) {
            where.labour = {
                name: {
                    contains: data.search,
                    mode: "insensitive"
                }
            };
        }

        if (filters.projectId) {
            where.projectId = filters.projectId;
        }

        if (filters.labourId) {
            where.labourId = filters.labourId;
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
        return await prisma.labour_attendance.findMany({
            take: data.limit || 1000,
            where,
            include: {
                project: {
                    select: {
                        name: true
                    }
                },
                labour: {
                    select: {
                        name: true,
                        paymentPerDay: true,
                        phonenumber: true
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

export { LabourAttendanceRepository };
