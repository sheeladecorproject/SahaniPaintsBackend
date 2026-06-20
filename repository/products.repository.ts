import { prisma } from "../db/prisma.js";
import type { Products, ProductsData } from "../dto/products.dto.js";
import type { PaginationData } from "../dto/pagination.dto.js";
import { serverUtils } from "../utils/server.utils.js";
import { BaseRepository } from "./base.repository.js";

class ProductsRepository extends BaseRepository<Products, ProductsData, any> {
    constructor() {
        // @ts-ignore
        super(prisma.products, "PRODUCT");
    }

    fetch = async (id: string, userId?: string) => {
        const where: any = {
            [this.config.primaryKey]: id,
            ...(userId ? { userId } : {})
        };

        if (this.config.statusField) {
            where[this.config.statusField] = null;
        }

        const record = await this.model.findFirst({
            where,
            include: {
                brand: true
            }
        });

        return record ?? ({} as Products);
    };

    fetchAll = async (data: PaginationData, filters: any, searchFields: string[] = []) => {
        let where: any = {};

        if (this.config.statusField) {
            where[this.config.statusField] = null;
        }

        where = serverUtils.buildWhere(where, filters, data, searchFields, this.config.hasCreatedAt);

        return await this.model.findMany({
            take: data.limit || 10,
            where,
            include: {
                brand: true
            },
            orderBy: [
                ...(this.config.hasCreatedAt !== false
                    ? [{ createdAt: (data.sort ?? "desc") as 'asc' | 'desc' }]
                    : []
                ),
                { id: (data.sort ?? "desc") as 'asc' | 'desc' }
            ]
        });
    };
}

export { ProductsRepository };
