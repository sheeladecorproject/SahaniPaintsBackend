import { prisma } from "../db/prisma.js";
import type { Project, ProjectData } from "../dto/project.dto.js";
import { BaseRepository } from "./base.repository.js";
import { serverUtils } from "../utils/server.utils.js";

class ProjectRepository extends BaseRepository<Project, ProjectData, any> {
    constructor() {
        super(prisma.projects, "PROJECT");
    }

    create = async (data: any): Promise<any> => {
        try {
            return await prisma.$transaction(async (tx) => {
                let customerId = data.customerId;
                if (data._ && typeof data._ === "object") {
                    const customer = await tx.customers.create({
                        data: {
                            name: data._.name,
                            phonenumber: data._.phonenumber || null,
                            alternatePhonenumber: data._.alternatePhonenumber || null,
                            email: data._.email || null,
                            address: data._.address || null,
                        }
                    });
                    customerId = customer.id;
                }

                const project = await tx.projects.create({
                    data: {
                        name: data.name,
                        customerId: customerId || null,
                        interiorId: data.interiorId || null,
                        totalAmount: data.totalAmount != null ? Number(data.totalAmount) : null,
                        paid: data.paid != null ? Number(data.paid) : 0,
                        discount: data.discount != null ? Number(data.discount) : null,
                        discountType: data.discountType || null,
                        tax: data.tax != null ? Number(data.tax) : null,
                        agreedPrice: data.agreedPrice != null ? Number(data.agreedPrice) : null,
                        projectDate: data.projectDate ? new Date(data.projectDate) : null,
                        status: data.status || "PENDING",
                        creatorId: data.creatorId,
                        supervisorId: data.supervisorId || null,
                    } as any,
                    select: {
                        id: true,
                        name: true,
                        createdAt: true,
                        status: true,
                        paid: true,
                        totalAmount: true,
                        agreedPrice: true,
                        discount: true,
                        discountType: true,
                        tax: true,
                        projectDate: true,
                        supervisorId: true,
                        customerId: true,
                        interiorId: true,
                        creator: { select: { username: true } },
                        supervisor: { select: { id: true, username: true, email: true, phonenumber: true } },
                        customer: { select: { id: true, name: true, phonenumber: true, email: true, address: true } },
                    }
                });

                if (data.paid && Number(data.paid) > 0) {
                    await tx.project_payments.create({
                        data: {
                            projectId: project.id,
                            amount: Number(data.paid),
                            type: "INCOMING",
                            paymentMode: "CASH",
                            paymentDate: data.projectDate ? new Date(data.projectDate) : new Date(),
                            remarks: "Initial payment recorded during project creation",
                        }
                    });
                }

                const projectProducts = data.projectProducts ?? [];
                const productRows = projectProducts.map((item: any) => ({
                    projectId: project.id,
                    productId: item.productId,
                    area: Number(item.area),
                    unit: item.unit,
                    rate: Number(item.rate),
                    litresUsed: item.litresUsed != null ? Number(item.litresUsed) : null,
                }));

                if (productRows.length > 0) {
                    await tx.project_products.createMany({
                        data: productRows,
                    });
                }

                return project;
            }, { maxWait: 15000, timeout: 20000 });
        } catch (error) {
            this.handlePrismaError(error);
        }
    };

    update = async (data: any, id: string, userId?: string): Promise<any> => {
        try {
            return await prisma.$transaction(async (tx) => {
                let customerId = data.customerId;
                if (data._ && typeof data._ === "object") {
                    const customer = await tx.customers.create({
                        data: {
                            name: data._.name,
                            phonenumber: data._.phonenumber || null,
                            alternatePhonenumber: data._.alternatePhonenumber || null,
                            email: data._.email || null,
                            address: data._.address || null,
                        }
                    });
                    customerId = customer.id;
                }

                const updatePayload: any = {};
                if (data.name !== undefined) updatePayload.name = data.name;
                if (customerId !== undefined) updatePayload.customerId = customerId;
                if (data.interiorId !== undefined) updatePayload.interiorId = data.interiorId || null;
                if (data.totalAmount !== undefined) updatePayload.totalAmount = data.totalAmount != null ? Number(data.totalAmount) : null;
                if (data.paid !== undefined) updatePayload.paid = data.paid != null ? Number(data.paid) : 0;
                if (data.discount !== undefined) updatePayload.discount = data.discount != null ? Number(data.discount) : null;
                if (data.discountType !== undefined) updatePayload.discountType = data.discountType;
                if (data.tax !== undefined) updatePayload.tax = data.tax != null ? Number(data.tax) : null;
                if (data.agreedPrice !== undefined) updatePayload.agreedPrice = data.agreedPrice != null ? Number(data.agreedPrice) : null;
                if (data.projectDate !== undefined) updatePayload.projectDate = data.projectDate ? new Date(data.projectDate) : null;
                if (data.status !== undefined) updatePayload.status = data.status;
                if (data.supervisorId !== undefined) updatePayload.supervisorId = data.supervisorId || null;

                const project = await tx.projects.update({
                    where: { id },
                    data: updatePayload,
                    select: { id: true }
                });

                if (data.projectProducts !== undefined) {
                    await tx.project_products.deleteMany({
                        where: { projectId: id }
                    });

                    const productRows = data.projectProducts.map((item: any) => ({
                        projectId: id,
                        productId: item.productId,
                        area: Number(item.area),
                        unit: item.unit,
                        rate: Number(item.rate),
                        litresUsed: item.litresUsed != null ? Number(item.litresUsed) : null,
                    }));

                    if (productRows.length > 0) {
                        await tx.project_products.createMany({
                            data: productRows,
                        });
                    }
                }

                return project;
            }, { maxWait: 15000, timeout: 20000 });
        } catch (error) {
            this.handlePrismaError(error);
        }
    };

    fetch = async (id: string, userId?: string): Promise<any> => {
        const project = await prisma.projects.findFirst({
            where: {
                id,
                ...(userId ? { creatorId: userId } : {})
            },
            include: {
                customer: {
                    select: {
                        id: true,
                        name: true,
                        phonenumber: true,
                        email: true,
                        address: true
                    }
                },
                interior: {
                    select: {
                        id: true,
                        name: true,
                        commissionFeePercentage: true
                    }
                },
                creator: {
                    select: {
                        username: true
                    }
                },
                supervisor: {
                    select: {
                        id: true,
                        username: true,
                        email: true,
                        phonenumber: true
                    }
                },
                projectProducts: {
                    include: {
                        product: {
                            include: {
                                brand: {
                                    select: {
                                        name: true
                                    }
                                }
                            }
                        }
                    }
                },
                attendance: {
                    include: {
                        labour: true
                    }
                },
                tasks: true,
                labourPayments: {
                    include: {
                        labour: true
                    }
                },
                materialLogs: {
                    include: {
                        product: true
                    }
                },
                projectPayments: true,
                contractorPayments: true,
                lowMaterials: true,
                contractorWorkLogs: {
                    include: {
                        contractor: true
                    }
                }
            }
        });
        return project ?? ({} as any);
    }

    fetchAll = async (data: any, filters: any, searchFields: string[] = []): Promise<any[]> => {
        let where: any = {};
        where = this.config.statusField ? { [this.config.statusField]: null } : {};
        
        const { startDate, endDate, ...restData } = data;
        const { ...restFilters } = filters || {};
        where = serverUtils.buildWhere(where, restFilters, restData, searchFields, this.config.hasCreatedAt);

        if (startDate || endDate) {
            const projectDateFilter: any = {};
            if (startDate) {
                projectDateFilter.gte = new Date(startDate);
            }
            if (endDate) {
                projectDateFilter.lte = new Date(endDate);
            }
            if (!where.AND) {
                where.AND = [];
            }
            where.AND.push({
                projectDate: projectDateFilter
            });
        }

        return await prisma.projects.findMany({
            take: data.limit || 10,
            where,
            include: {
                customer: {
                    select: {
                        name: true
                    }
                },
                interior: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                creator: {
                    select: {
                        username: true
                    }
                },
                supervisor: {
                    select: {
                        id: true,
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
