import { prisma } from "../db/prisma.js";

class ReportRepository {
    private buildDateRange(data: any) {
        if (!data?.startDate && !data?.endDate) return undefined;
        const range: any = {};
        if (data.startDate) range.gte = new Date(data.startDate);
        if (data.endDate) {
            const end = new Date(data.endDate);
            end.setHours(23, 59, 59, 999);
            range.lte = end;
        }
        return range;
    }

    fetchDashData = async (data: any) => {
        const now = new Date();
        const currentYear = now.getFullYear();

        const start = data?.startDate ? new Date(data.startDate) : (now.getMonth() >= 3 ? new Date(currentYear, 3, 1) : new Date(currentYear - 1, 3, 1));
        const end = data?.endDate ? new Date(data.endDate) : (now.getMonth() >= 3 ? new Date(currentYear + 1, 2, 31, 23, 59, 59) : new Date(currentYear, 2, 31, 23, 59, 59));

        const dateRange = { gte: start, lte: end };

        const [payments, revenue, projects] = await Promise.all([
            prisma.project_payments.aggregate({
                _sum: { amount: true },
                where: { createdAt: dateRange }
            }),
            prisma.projects.aggregate({
                _sum: { totalAmount: true },
                where: { createdAt: dateRange }
            }),
            prisma.projects.count({
                where: {
                    createdAt: dateRange,
                    status: { not: "COMPLETED" }
                }
            })
        ]);

        return [
            {
                totalPayments: Number(payments._sum.amount ?? 0),
                totalRevenue: Number(revenue._sum.totalAmount ?? 0),
                totalProjects: projects
            }
        ];
    }

    private getProductSizeInLitres(sizeStr?: string): number {
        if (!sizeStr) return 1;
        const normalized = sizeStr.toLowerCase().trim();
        if (normalized.endsWith("ml")) {
            const val = parseFloat(normalized);
            return isNaN(val) ? 1 : val / 1000;
        }
        if (normalized.endsWith("ltr")) {
            const val = parseFloat(normalized);
            return isNaN(val) ? 1 : val;
        }
        const val = parseFloat(normalized);
        return isNaN(val) ? 1 : val;
    }

    getProjectsReport = async (data: any) => {
        const dateRange = this.buildDateRange(data);
        const whereClause = dateRange ? { createdAt: dateRange } : {};

        const [totalCount, aggregates, statusGroup, topProjects] = await Promise.all([
            prisma.projects.count({ where: whereClause }),
            prisma.projects.aggregate({
                _sum: {
                    totalAmount: true,
                    paid: true,
                },
                where: whereClause,
            }),
            prisma.projects.groupBy({
                by: ["status"],
                _count: { id: true },
                _sum: { totalAmount: true, paid: true },
                where: whereClause,
            }),
            prisma.projects.findMany({
                where: whereClause,
                take: 15,
                orderBy: { totalAmount: "desc" },
                select: {
                    id: true,
                    name: true,
                    status: true,
                    totalAmount: true,
                    paid: true,
                    createdAt: true,
                    customer: { select: { id: true, name: true } },
                    attendance: {
                        select: {
                            id: true,
                            date: true,
                            workDayValue: true,
                            labour: {
                                select: {
                                    paymentPerDay: true,
                                }
                            }
                        }
                    },
                    contractorWorkLogs: {
                        select: {
                            id: true,
                            sqFt: true,
                            contractor: {
                                select: {
                                    pricePerSqFt: true,
                                }
                            }
                        }
                    },
                    projectProducts: {
                        select: {
                            id: true,
                            productId: true,
                            area: true,
                            rate: true,
                            product: {
                                select: {
                                    price: true,
                                    size: true,
                                }
                            }
                        }
                    },
                    materialLogs: {
                        select: {
                            id: true,
                            productId: true,
                            quantity: true,
                        }
                    },
                },
            }),
        ]);

        const totalValue = Number(aggregates._sum.totalAmount ?? 0);
        const totalPaid = Number(aggregates._sum.paid ?? 0);
        const totalDue = Math.max(0, totalValue - totalPaid);

        const statusBreakdown = statusGroup.map((g) => {
            const val = Number(g._sum.totalAmount ?? 0);
            const pd = Number(g._sum.paid ?? 0);
            return {
                status: g.status,
                count: g._count.id,
                totalAmount: val,
                paid: pd,
                due: Math.max(0, val - pd),
            };
        });

        return {
            summary: {
                totalProjects: totalCount,
                totalValue,
                totalPaid,
                totalDue,
                totalTax: 0,
            },
            statusBreakdown,
            topProjects: topProjects.map((p) => {
                // Compute Product Cost
                const productCost = p.projectProducts.reduce((sum: number, pp: any) => {
                    const priceLitre = Number(pp.product?.price || 0);

                    // Find the logged litres used for this product in this project
                    const loggedProducts = p.materialLogs.filter((log: any) => log.productId === pp.productId);
                    const totalLoggedQuantity = loggedProducts.reduce((s: number, log: any) => s + Number(log.quantity || 0), 0);

                    if (totalLoggedQuantity > 0) {
                        const packSizeL = this.getProductSizeInLitres(pp.product?.size);
                        return sum + (totalLoggedQuantity * packSizeL) * priceLitre;
                    }

                    // Fallback: area * rate
                    return sum + Number(pp.rate) * Number(pp.area);
                }, 0);

                // Compute Labour Cost
                const labourCost = p.attendance.reduce((sum: number, att: any) => {
                    const paymentRate = Number(att.labour?.paymentPerDay || 0);
                    const val = Number(att.workDayValue ?? 1.0);
                    return sum + val * paymentRate;
                }, 0);

                // Compute Contractor Cost
                const contractorCost = p.contractorWorkLogs.reduce((sum: number, log: any) => {
                    const rate = Number(log.contractor?.pricePerSqFt ?? 0);
                    return sum + Number(log.sqFt || 0) * rate;
                }, 0);

                const projectCost = productCost + labourCost + contractorCost;

                return {
                    id: p.id,
                    name: p.name,
                    status: p.status,
                    customerName: p.customer?.name ?? "—",
                    totalAmount: Number(p.totalAmount ?? 0),
                    paid: Number(p.paid ?? 0),
                    due: Math.max(0, Number(p.totalAmount ?? 0) - Number(p.paid ?? 0)),
                    deadlineDate: null,
                    createdAt: p.createdAt,
                    projectCost: projectCost,
                };
            }),
        };
    }

    getPaymentsReport = async (data: any) => {
        const dateRange = this.buildDateRange(data);
        const whereClause = dateRange ? { createdAt: dateRange } : {};

        const [totalCount, aggregates, modeGroup, typeGroup, recentPayments] = await Promise.all([
            prisma.project_payments.count({ where: whereClause }),
            prisma.project_payments.aggregate({
                _sum: { amount: true },
                _avg: { amount: true },
                where: whereClause,
            }),
            prisma.project_payments.groupBy({
                by: ["paymentMode"],
                _count: { id: true },
                _sum: { amount: true },
                where: whereClause,
            }),
            prisma.project_payments.groupBy({
                by: ["type"],
                _count: { id: true },
                _sum: { amount: true },
                where: whereClause,
            }),
            prisma.project_payments.findMany({
                where: whereClause,
                take: 25,
                orderBy: { createdAt: "desc" },
                select: {
                    id: true,
                    amount: true,
                    paymentMode: true,
                    type: true,
                    remarks: true,
                    createdAt: true,
                    project: { select: { name: true, customer: { select: { name: true } } } },
                },
            }),
        ]);

        const totalAmount = Number(aggregates._sum.amount ?? 0);
        const averageAmount = Number(aggregates._avg.amount ?? 0);

        const modeBreakdown = modeGroup.map((m) => ({
            mode: m.paymentMode,
            count: m._count.id,
            totalAmount: Number(m._sum.amount ?? 0),
        }));

        const typeBreakdown = typeGroup.map((t) => ({
            type: t.type,
            count: t._count.id,
            totalAmount: Number(t._sum.amount ?? 0),
        }));

        return {
            summary: {
                totalCount,
                totalAmount,
                averageAmount,
            },
            modeBreakdown,
            typeBreakdown,
            recentPayments: recentPayments.map((p) => ({
                id: p.id,
                amount: Number(p.amount ?? 0),
                paymentMode: p.paymentMode,
                type: p.type,
                remarks: p.remarks ?? "—",
                createdAt: p.createdAt,
                customerName: p.project?.customer?.name ?? "—",
                projectName: p.project?.name ?? "—",
            })),
        };
    }

    getInteriorsReport = async (data: any) => {
        const dateRange = this.buildDateRange(data);
        const projectWhere = dateRange ? { createdAt: dateRange } : {};

        const interiorsList = await prisma.interiors.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                phonenumber: true,
                commissionFeePercentage: true,
                projects: {
                    where: projectWhere,
                    select: {
                        id: true,
                        totalAmount: true,
                        paid: true,
                        status: true,
                    },
                },
            },
            orderBy: { name: "asc" },
        });

        let totalContractValue = 0;
        let totalCommissionsPayable = 0;
        let totalAssignedProjects = 0;

        const designerBreakdown = interiorsList.map((designer) => {
            const projectCount = designer.projects.length;
            const designerValue = designer.projects.reduce((acc, p) => acc + Number(p.totalAmount ?? 0), 0);
            const ratePct = Number(designer.commissionFeePercentage ?? 0);
            const earnedCommission = (designerValue * ratePct) / 100;

            totalAssignedProjects += projectCount;
            totalContractValue += designerValue;
            totalCommissionsPayable += earnedCommission;

            return {
                id: designer.id,
                name: designer.name,
                email: designer.email ?? "—",
                phone: designer.phonenumber ?? "—",
                commissionFeePercentage: ratePct,
                projectCount,
                totalValue: designerValue,
                earnedCommission,
            };
        });

        return {
            summary: {
                totalDesigners: interiorsList.length,
                totalAssignedProjects,
                totalContractValue,
                totalCommissionsPayable,
            },
            designerBreakdown,
        };
    }

    getProductsReport = async (data: any) => {
        const dateRange = this.buildDateRange(data);
        const projectProductsWhere = dateRange ? { project: { createdAt: dateRange } } : {};

        const [totalCataloguedProducts, categoryGroup, topUsedProducts] = await Promise.all([
            prisma.products.count(),
            prisma.products.groupBy({
                by: ["category"],
                _count: { id: true },
            }),
            prisma.project_products.findMany({
                where: projectProductsWhere,
                take: 100,
                include: {
                    product: true,
                },
            }),
        ]);

        // Aggregate top used products by product name
        const productStatsMap: Record<string, { name: string; type: string; category: string; count: number; totalQty: number; totalValue: number }> = {};

        topUsedProducts.forEach((item) => {
            if (!item.product) return;
            const key = item.product.id;
            if (!productStatsMap[key]) {
                productStatsMap[key] = {
                    name: item.product.name,
                    type: "GENERAL",
                    category: item.product.category ?? "CUSTOM",
                    count: 0,
                    totalQty: 0,
                    totalValue: 0,
                };
            }
            productStatsMap[key].count += 1;
            productStatsMap[key].totalQty += Number(item.area ?? 1);
            productStatsMap[key].totalValue += Number(item.rate ?? 0) * Number(item.area ?? 1);
        });

        const topProducts = Object.values(productStatsMap).sort((a, b) => b.totalValue - a.totalValue).slice(0, 15);

        return {
            summary: {
                totalCataloguedProducts,
                totalDeployedItems: topUsedProducts.length,
            },
            categoryBreakdown: categoryGroup.map((c) => ({
                category: c.category ?? "UNKNOWN",
                count: c._count.id,
            })),
            topProducts,
        };
    }
}

export { ReportRepository };
