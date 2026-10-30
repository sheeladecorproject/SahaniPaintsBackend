import { prisma } from "../db/prisma.js";

class ReportRepository {
    private parseDateRange(data: any) {
        if (data?.allTime === true || data?.allTime === "true") {
            return undefined;
        }
        if (!data?.startDate && !data?.endDate) {
            const now = new Date();
            const currentYear = now.getFullYear();
            const start = now.getMonth() >= 3 ? new Date(currentYear, 3, 1, 0, 0, 0) : new Date(currentYear - 1, 3, 1, 0, 0, 0);
            const end = now.getMonth() >= 3 ? new Date(currentYear + 1, 2, 31, 23, 59, 59, 999) : new Date(currentYear, 2, 31, 23, 59, 59, 999);
            return { gte: start, lte: end };
        }
        const range: any = {};
        if (data.startDate) {
            const start = new Date(data.startDate);
            start.setHours(0, 0, 0, 0);
            range.gte = start;
        }
        if (data.endDate) {
            const end = new Date(data.endDate);
            end.setHours(23, 59, 59, 999);
            range.lte = end;
        }
        return range;
    }

    private buildDateRange(data: any) {
        return this.parseDateRange(data);
    }

    fetchDashData = async (data: any) => {
        const dateRange = this.parseDateRange(data);
        const whereDate = dateRange ? { createdAt: dateRange } : {};

        const [payments, projectsForRevenue, projects] = await Promise.all([
            prisma.project_payments.aggregate({
                _sum: { amount: true },
                where: whereDate
            }),
            prisma.projects.findMany({
                where: whereDate,
                select: { totalAmount: true, agreedPrice: true }
            }),
            prisma.projects.count({
                where: {
                    ...whereDate,
                    status: { not: "COMPLETED" }
                }
            })
        ]);

        const totalRevenue = projectsForRevenue.reduce((sum, p) => {
            const val = p.agreedPrice != null ? Number(p.agreedPrice) : Number(p.totalAmount ?? 0);
            return sum + val;
        }, 0);
        const totalPayments = Number(payments._sum.amount ?? 0);
        const totalDue = Math.max(0, totalRevenue - totalPayments);

        return [
            {
                totalPayments,
                totalRevenue,
                totalDue,
                totalProjects: projects
            }
        ];
    }

    getCardDetails = async (data: any) => {
        const { cardType } = data;
        const dateRange = this.parseDateRange(data);
        const whereDate = dateRange ? { createdAt: dateRange } : {};
        const STAGES = ["Putty", "Primer", "1st Coat", "2nd Coat"];

        if (cardType === "running-projects") {
            const projects = await prisma.projects.findMany({
                where: {
                    ...whereDate,
                    status: { not: "COMPLETED" }
                },
                include: {
                    customer: {
                        select: { id: true, name: true, phonenumber: true, email: true, address: true }
                    },
                    supervisor: {
                        select: { id: true, username: true, phonenumber: true }
                    },
                    creator: {
                        select: { id: true, username: true }
                    },
                    projectAreaColors: {
                        select: { stage: true }
                    }
                },
                orderBy: { createdAt: "desc" }
            });

            const formatted = projects.map(p => {
                const valuation = p.agreedPrice != null ? Number(p.agreedPrice) : Number(p.totalAmount ?? 0);
                const paid = Number(p.paid ?? 0);
                const due = Math.max(0, valuation - paid);

                let progress = 0;
                if (p.projectAreaColors && p.projectAreaColors.length > 0) {
                    const sum = p.projectAreaColors.reduce((acc, m) => {
                        const idx = m.stage ? STAGES.indexOf(m.stage) : -1;
                        return acc + (idx >= 0 ? ((idx + 1) / STAGES.length) * 100 : 0);
                    }, 0);
                    progress = Math.round(sum / p.projectAreaColors.length);
                }

                return {
                    id: p.id,
                    name: p.name,
                    status: p.status,
                    customerName: p.customer?.name ?? "—",
                    customerPhone: p.customer?.phonenumber ?? null,
                    customerAddress: p.customer?.address ?? null,
                    supervisorName: p.supervisor?.username ?? "—",
                    creatorName: p.creator?.username ?? "—",
                    valuation,
                    totalAmount: Number(p.totalAmount ?? 0),
                    agreedPrice: p.agreedPrice != null ? Number(p.agreedPrice) : null,
                    paid,
                    due,
                    progress,
                    projectDate: p.projectDate,
                    createdAt: p.createdAt
                };
            });

            const totalValuation = formatted.reduce((sum, p) => sum + p.valuation, 0);
            const totalPaid = formatted.reduce((sum, p) => sum + p.paid, 0);
            const totalDue = formatted.reduce((sum, p) => sum + p.due, 0);

            const statusCounts: Record<string, number> = {};
            formatted.forEach(p => {
                statusCounts[p.status] = (statusCounts[p.status] || 0) + 1;
            });

            return {
                cardType: "running-projects",
                summary: {
                    totalCount: formatted.length,
                    totalValuation,
                    totalPaid,
                    totalDue,
                    statusCounts
                },
                items: formatted
            };
        }

        if (cardType === "total-value") {
            const projects = await prisma.projects.findMany({
                where: whereDate,
                include: {
                    customer: {
                        select: { id: true, name: true, phonenumber: true, email: true, address: true }
                    },
                    supervisor: {
                        select: { id: true, username: true, phonenumber: true }
                    },
                    creator: {
                        select: { id: true, username: true }
                    },
                    projectAreaColors: {
                        select: { stage: true }
                    }
                },
                orderBy: { createdAt: "desc" }
            });

            const formatted = projects.map(p => {
                const valuation = p.agreedPrice != null ? Number(p.agreedPrice) : Number(p.totalAmount ?? 0);
                const paid = Number(p.paid ?? 0);
                const due = Math.max(0, valuation - paid);

                let progress = 0;
                if (p.projectAreaColors && p.projectAreaColors.length > 0) {
                    const sum = p.projectAreaColors.reduce((acc, m) => {
                        const idx = m.stage ? STAGES.indexOf(m.stage) : -1;
                        return acc + (idx >= 0 ? ((idx + 1) / STAGES.length) * 100 : 0);
                    }, 0);
                    progress = Math.round(sum / p.projectAreaColors.length);
                }

                return {
                    id: p.id,
                    name: p.name,
                    status: p.status,
                    customerName: p.customer?.name ?? "—",
                    customerPhone: p.customer?.phonenumber ?? null,
                    customerAddress: p.customer?.address ?? null,
                    supervisorName: p.supervisor?.username ?? "—",
                    creatorName: p.creator?.username ?? "—",
                    valuation,
                    totalAmount: Number(p.totalAmount ?? 0),
                    agreedPrice: p.agreedPrice != null ? Number(p.agreedPrice) : null,
                    paid,
                    due,
                    progress,
                    projectDate: p.projectDate,
                    createdAt: p.createdAt
                };
            });

            // sort by valuation descending
            formatted.sort((a, b) => b.valuation - a.valuation);

            const totalValuation = formatted.reduce((sum, p) => sum + p.valuation, 0);
            const totalPaid = formatted.reduce((sum, p) => sum + p.paid, 0);
            const totalDue = formatted.reduce((sum, p) => sum + p.due, 0);
            const avgValuation = formatted.length > 0 ? totalValuation / formatted.length : 0;
            const highestValuation = formatted.length > 0 ? (formatted[0]?.valuation ?? 0) : 0;

            const statusCounts: Record<string, number> = {};
            formatted.forEach(p => {
                statusCounts[p.status] = (statusCounts[p.status] || 0) + 1;
            });

            return {
                cardType: "total-value",
                summary: {
                    totalCount: formatted.length,
                    totalValuation,
                    avgValuation,
                    highestValuation,
                    totalPaid,
                    totalDue,
                    statusCounts
                },
                items: formatted
            };
        }

        if (cardType === "revenue-received") {
            const payments = await prisma.project_payments.findMany({
                where: whereDate,
                include: {
                    project: {
                        select: {
                            id: true,
                            name: true,
                            status: true,
                            customer: {
                                select: { id: true, name: true, phonenumber: true }
                            }
                        }
                    }
                },
                orderBy: { createdAt: "desc" }
            });

            const formatted = payments.map(p => ({
                id: p.id,
                projectId: p.projectId,
                projectName: p.project?.name ?? "—",
                projectStatus: p.project?.status ?? "—",
                customerName: p.project?.customer?.name ?? "—",
                customerPhone: p.project?.customer?.phonenumber ?? null,
                amount: Number(p.amount ?? 0),
                paymentMode: (p.paymentMode || "CASH").toUpperCase(),
                type: p.type || "INCOMING",
                paymentDate: p.paymentDate || p.createdAt,
                remarks: p.remarks ?? "—",
                createdAt: p.createdAt
            }));

            const totalAmount = formatted.reduce((sum, p) => sum + p.amount, 0);
            const avgAmount = formatted.length > 0 ? totalAmount / formatted.length : 0;

            const modeMap: Record<string, { count: number; total: number }> = {};
            formatted.forEach(p => {
                const mode = p.paymentMode;
                if (!modeMap[mode]) modeMap[mode] = { count: 0, total: 0 };
                modeMap[mode].count += 1;
                modeMap[mode].total += p.amount;
            });

            return {
                cardType: "revenue-received",
                summary: {
                    totalCount: formatted.length,
                    totalAmount,
                    avgAmount,
                    modes: Object.entries(modeMap).map(([mode, val]) => ({
                        mode,
                        count: val.count,
                        total: val.total
                    }))
                },
                items: formatted
            };
        }

        if (cardType === "revenue-due") {
            const projects = await prisma.projects.findMany({
                where: whereDate,
                include: {
                    customer: {
                        select: { id: true, name: true, phonenumber: true, email: true, address: true }
                    },
                    supervisor: {
                        select: { id: true, username: true, phonenumber: true }
                    },
                    projectAreaColors: {
                        select: { stage: true }
                    }
                },
                orderBy: { createdAt: "desc" }
            });

            const formatted = projects.map(p => {
                const valuation = p.agreedPrice != null ? Number(p.agreedPrice) : Number(p.totalAmount ?? 0);
                const paid = Number(p.paid ?? 0);
                const due = Math.max(0, valuation - paid);
                const duePercent = valuation > 0 ? Math.round((due / valuation) * 100) : 0;

                let progress = 0;
                if (p.projectAreaColors && p.projectAreaColors.length > 0) {
                    const sum = p.projectAreaColors.reduce((acc, m) => {
                        const idx = m.stage ? STAGES.indexOf(m.stage) : -1;
                        return acc + (idx >= 0 ? ((idx + 1) / STAGES.length) * 100 : 0);
                    }, 0);
                    progress = Math.round(sum / p.projectAreaColors.length);
                }

                return {
                    id: p.id,
                    name: p.name,
                    status: p.status,
                    customerName: p.customer?.name ?? "—",
                    customerPhone: p.customer?.phonenumber ?? null,
                    customerAddress: p.customer?.address ?? null,
                    supervisorName: p.supervisor?.username ?? "—",
                    valuation,
                    totalAmount: Number(p.totalAmount ?? 0),
                    agreedPrice: p.agreedPrice != null ? Number(p.agreedPrice) : null,
                    paid,
                    due,
                    duePercent,
                    progress,
                    projectDate: p.projectDate,
                    createdAt: p.createdAt
                };
            }).filter(p => p.due > 0);

            // Sort by due descending
            formatted.sort((a, b) => b.due - a.due);

            const totalDue = formatted.reduce((sum, p) => sum + p.due, 0);
            const totalValuation = formatted.reduce((sum, p) => sum + p.valuation, 0);
            const totalPaid = formatted.reduce((sum, p) => sum + p.paid, 0);
            const overallDuePercent = totalValuation > 0 ? Math.round((totalDue / totalValuation) * 100) : 0;

            const statusCounts: Record<string, number> = {};
            formatted.forEach(p => {
                statusCounts[p.status] = (statusCounts[p.status] || 0) + 1;
            });

            return {
                cardType: "revenue-due",
                summary: {
                    totalDueProjects: formatted.length,
                    totalDue,
                    totalValuation,
                    totalPaid,
                    overallDuePercent,
                    statusCounts
                },
                items: formatted
            };
        }

        return {
            cardType: "running-projects",
            summary: { totalCount: 0, totalValuation: 0, totalPaid: 0, totalDue: 0 },
            items: []
        };
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
                            pricePerSqFt: true,
                            material: true,
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
                    const packPrice = Number(pp.product?.price || 0);
                    const packSizeL = this.getProductSizeInLitres(pp.product?.size);
                    const priceLitre = packSizeL > 0 ? packPrice / packSizeL : packPrice;

                    // Find the logged litres used for this product in this project
                    const loggedProducts = p.materialLogs.filter((log: any) => log.productId === pp.productId);
                    const totalLoggedQuantity = loggedProducts.reduce((s: number, log: any) => s + Number(log.quantity || 0), 0);

                    if (totalLoggedQuantity > 0) {
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
                    const rate = Number(log.pricePerSqFt ?? 0);
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

        const [totalCataloguedProducts, topUsedProducts] = await Promise.all([
            prisma.products.count(),
            /* Product category breakdown disabled - see SPEC_PRODUCT_CATEGORY.md
            prisma.products.groupBy({
                by: ["category"],
                _count: { id: true },
            }),
            */
            prisma.project_products.findMany({
                where: projectProductsWhere,
                take: 100,
                include: {
                    product: true,
                },
            }),
        ]);

        // Aggregate top used products by product name
        const productStatsMap: Record<string, { name: string; type: string; /* category?: string; */ count: number; totalQty: number; totalValue: number }> = {};

        topUsedProducts.forEach((item) => {
            if (!item.product) return;
            const key = item.product.id;
            if (!productStatsMap[key]) {
                productStatsMap[key] = {
                    name: item.product.name,
                    type: "GENERAL",
                    // category: item.product.category || "Uncategorized", // Disabled - see SPEC_PRODUCT_CATEGORY.md
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
            /* Product category breakdown disabled - see SPEC_PRODUCT_CATEGORY.md
            categoryBreakdown: categoryGroup.map((c) => ({
                category: c.category || "Uncategorized",
                count: c._count.id,
            })),
            */
            categoryBreakdown: [],
            topProducts,
        };
    }
}

export { ReportRepository };
