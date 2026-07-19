import { prisma } from "../db/prisma.js";
import type { ProjectPayment, ProjectPaymentData } from "../dto/projectPayment.dto.js";
import { BaseRepository } from "./base.repository.js";

class ProjectPaymentRepository extends BaseRepository<ProjectPayment, ProjectPaymentData, any> {
    constructor() {
        // @ts-ignore
        super(prisma.project_payments, "PROJECT_PAYMENT");
    }

    create = async (data: any): Promise<any> => {
        try {
            return await prisma.$transaction(async (tx) => {
                const isIncoming = data.type !== "OUTGOING";
                const payment = await tx.project_payments.create({
                    data: {
                        projectId: data.projectId,
                        amount: Number(data.amount),
                        type: isIncoming ? "INCOMING" : "OUTGOING",
                        paymentMode: data.paymentMode || "CASH",
                        paymentDate: data.paymentDate ? new Date(data.paymentDate) : new Date(),
                        remarks: data.remarks || null,
                    },
                    include: {
                        project: {
                            select: {
                                name: true
                            }
                        }
                    }
                });

                // Update paid field on projects
                await tx.projects.update({
                    where: { id: data.projectId },
                    data: {
                        paid: {
                            [isIncoming ? "increment" : "decrement"]: Number(data.amount)
                        }
                    }
                });

                return payment;
            });
        } catch (error) {
            this.handlePrismaError(error);
        }
    }

    delete = async (id: string): Promise<any> => {
        try {
            return await prisma.$transaction(async (tx) => {
                const payment = await tx.project_payments.findUnique({
                    where: { id }
                });

                if (!payment) {
                    throw new Error("Project payment record not found.");
                }

                const isIncoming = payment.type !== "OUTGOING";

                // Update paid field on projects
                await tx.projects.update({
                    where: { id: payment.projectId },
                    data: {
                        paid: {
                            [isIncoming ? "decrement" : "increment"]: Number(payment.amount)
                        }
                    }
                });

                await tx.project_payments.delete({
                    where: { id }
                });

                return payment;
            });
        } catch (error) {
            this.handlePrismaError(error);
        }
    }

    fetchAll = async (
        data: any,
        filters: any,
        searchFields: string[] = []
    ): Promise<any[]> => {
        let where: any = {};
        
        if (data.search) {
            where.project = {
                name: {
                    contains: data.search,
                    mode: "insensitive"
                }
            };
        }

        if (filters.projectId) {
            where.projectId = filters.projectId;
        }

        // @ts-ignore
        return await prisma.project_payments.findMany({
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

export { ProjectPaymentRepository };
