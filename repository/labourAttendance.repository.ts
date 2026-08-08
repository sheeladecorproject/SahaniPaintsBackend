import { prisma } from "../db/prisma.js";
import type { LabourAttendance, LabourAttendanceData } from "../dto/labourAttendance.dto.js";
import { BaseRepository } from "./base.repository.js";

class LabourAttendanceRepository extends BaseRepository<LabourAttendance, LabourAttendanceData, any> {
    constructor() {
        // @ts-ignore
        super(prisma.labour_attendance, "LABOUR_ATTENDANCE");
    }

    create = async (data: LabourAttendanceData): Promise<any> => {
        try {
            const dateObj = new Date(data.date);
            // Look for existing record
            const existing = await prisma.labour_attendance.findUnique({
                where: {
                    date_projectId_labourId: {
                        date: dateObj,
                        projectId: data.projectId,
                        labourId: data.labourId,
                    }
                }
            });

            if (existing) {
                // If it exists, merge the shifts
                let mergedType = existing.workDayType;
                let mergedValue = Number(existing.workDayValue);

                const newType = data.workDayType;

                if (newType && newType !== existing.workDayType) {
                    if (
                        (existing.workDayType === "DAY" && newType === "NIGHT") ||
                        (existing.workDayType === "NIGHT" && newType === "DAY") ||
                        existing.workDayType === "BOTH" ||
                        newType === "BOTH"
                    ) {
                        mergedType = "BOTH";
                        mergedValue = 1.5;
                    }
                }

                // Update the existing record
                const updated = await prisma.labour_attendance.update({
                    where: {
                        id: existing.id
                    },
                    data: {
                        workDayType: mergedType,
                        workDayValue: mergedValue,
                        markedById: data.markedById !== undefined ? data.markedById : existing.markedById,
                    }
                });

                return {
                    id: updated.id,
                    createdAt: updated.createdAt,
                    workDayType: updated.workDayType,
                    workDayValue: Number(updated.workDayValue),
                };
            }

            // Otherwise, perform normal create
            const created = await prisma.labour_attendance.create({
                data: {
                    date: dateObj,
                    projectId: data.projectId,
                    labourId: data.labourId,
                    workDayType: data.workDayType || "DAY",
                    workDayValue: data.workDayValue !== undefined ? data.workDayValue : 1.0,
                    markedById: data.markedById ?? null,
                }
            });

            return {
                id: created.id,
                createdAt: created.createdAt,
                workDayType: created.workDayType,
                workDayValue: Number(created.workDayValue),
            };
        } catch (error) {
            this.handlePrismaError(error);
        }
    };

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
                },
                markedBy: {
                    select: {
                        id: true,
                        username: true
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
