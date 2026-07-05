import { prisma } from "../db/prisma.js";
import type { ContractorPayment, ContractorPaymentData } from "../dto/contractorPayment.dto.js";
import { BaseRepository } from "./base.repository.js";

class ContractorPaymentRepository extends BaseRepository<ContractorPayment, ContractorPaymentData, any> {
    constructor() {
        // @ts-ignore
        super(prisma.contractor_payments, "CONTRACTOR_PAYMENT");
    }

    fetchAll = async (
        data: any,
        filters: any,
        searchFields: string[] = []
    ): Promise<any[]> => {
        let where: any = {};
        
        if (data.search) {
            where.remarks = {
                contains: data.search,
                mode: "insensitive"
            };
        }

        if (filters.contractorId) {
            where.contractorId = filters.contractorId;
        }

        if (filters.projectId) {
            where.projectId = filters.projectId;
        }

        // @ts-ignore
        return await prisma.contractor_payments.findMany({
            take: data.limit || 1000,
            where,
            include: {
                contractor: {
                    select: {
                        name: true
                    }
                },
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

export { ContractorPaymentRepository };
