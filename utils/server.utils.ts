import type { PaginationData } from "../dto/pagination.dto.js";

class ServerUtils {
    parseFilterValue = (value: any) => {
        if (typeof value === 'string' && value.includes(":")) {
            const [operator, rawValue] = value.split(":");
            const numericValue = Number(rawValue);

            if (['gt', 'gte', 'lt', 'lte'].includes(operator ?? "") && !isNaN(numericValue)) {
                return { [operator ?? ""]: numericValue };
            }
        }
        return value;
    }

    buildWhere = (
        baseWhere: any,
        filters: any,
        data: PaginationData,
        searchFields: string[],
        hasCreatedAt: boolean = true
    ) => {
        const AND: any[] = [{ ...baseWhere }];

        Object.entries(baseWhere).forEach(([key, value]) => {
            AND.push({ [key]: value });
        });

        Object.entries(filters || {}).forEach(([key, value]) => {
            if (value != null && value !== "undefined" && value !== "") {
                AND.push({ [key]: this.parseFilterValue(value) });
            }
        });

        if (data.search && searchFields.length > 0) {
            AND.push({
                OR: searchFields.map((field) => ({
                    [field]: {
                        contains: data.search,
                        mode: "insensitive",
                    },
                })),
            });
        }

        if (hasCreatedAt !== false) {
            if (data.lastCreatedAt && data.lastId) {
                AND.push({
                    OR: [
                        { createdAt: { lt: data.lastCreatedAt } },
                        {
                            AND: [
                                { createdAt: data.lastCreatedAt },
                                { id: { lt: data.lastId } },
                            ],
                        },
                    ],
                });
            }
        } else {
            if (data.lastId) {
                AND.push({ id: { lt: data.lastId } });
            }
        }

        if (data.minPrice != null || data.maxPrice != null) {
            AND.push({
                price: {
                    ...(data.minPrice != null ? { gte: Number(data.minPrice) } : {}),
                    ...(data.maxPrice != null ? { lte: Number(data.maxPrice) } : {}),
                },
            });
        }

        if (data.startDate || data.endDate) {
            const dateFilter: any = {};

            if (data.startDate) {
                dateFilter.gte = new Date(data.startDate);
            }

            if (data.endDate) {
                dateFilter.lte = new Date(data.endDate);
            }

            const dateField = hasCreatedAt !== false ? "createdAt" : null;

            if (dateField) {
                AND.push({
                    [dateField]: dateFilter,
                });
            }
        }

        return { AND };
    };
}

const serverUtils = new ServerUtils();

export { serverUtils };
