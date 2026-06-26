import { prisma } from "../db/prisma.js";
import { BaseRepository } from "./base.repository.js";
import type { LabourPayments, LabourPaymentsData } from "../dto/labourPayments.dto.js";

class LabourPaymentsRepository extends BaseRepository<LabourPayments, LabourPaymentsData, any> {
    constructor() {
        // @ts-ignore
        super(prisma.labour_payments, "LABOUR_PAYMENTS");
    }

    fetchAll = async (
        data: any,
        filters: any,
        searchFields: string[] = []
    ): Promise<any[]> => {
        let where: any = {};

        if (filters.labourId) {
            where.labourId = filters.labourId;
        }

        if (filters.projectId) {
            where.projectId = filters.projectId;
        }

        return await prisma.labour_payments.findMany({
            take: data.limit || 1000,
            where,
            include: {
                project: {
                    select: {
                        name: true
                    }
                }
            },
            orderBy: [
                { paymentDate: "desc" as const },
                { createdAt: "desc" as const }
            ]
        });
    }
}

export { LabourPaymentsRepository };
