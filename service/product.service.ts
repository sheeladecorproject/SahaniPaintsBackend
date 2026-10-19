import { prisma } from "../db/prisma.js";
import type { Products, ProductsData } from "../dto/products.dto.js";
import type { ProductsRepository } from "../repository/products.repository.js";
import { BaseService } from "./base.service.js";
import { logger } from "../utils/logger.util.js";
import { ServerError } from "../utils/error.utils.js";

class ProductService extends BaseService<Products, ProductsData, ProductsRepository> {
    constructor(methods: ProductsRepository){
        super(methods, "PRODUCT");
    }

    create = async (data: any): Promise<Products> => {
        if (!data.brandId && (data.brand || data.brandName)) {
            const bName = (data.brand || data.brandName).toString().trim();
            const brand = await prisma.brands.findFirst({
                where: { name: { equals: bName, mode: 'insensitive' } }
            });
            if (brand) {
                data.brandId = brand.id;
            } else {
                throw new ServerError({
                    status: 400,
                    message: `Brand "${bName}" not found. Please create it under Brands master first.`
                });
            }
        }
        delete data.brand;
        delete data.brandName;
        delete data._brandName;

        if (data.price !== undefined && data.price !== null) data.price = Number(data.price);
        if (data.coverageSqFt !== undefined && data.coverageSqFt !== null && data.coverageSqFt !== "") {
            data.coverageSqFt = Number(data.coverageSqFt);
        } else {
            data.coverageSqFt = null;
        }
        if (data.coverageRnFt !== undefined && data.coverageRnFt !== null && data.coverageRnFt !== "") {
            data.coverageRnFt = Number(data.coverageRnFt);
        } else {
            data.coverageRnFt = null;
        }
        if (data.hasToken !== undefined) {
            data.hasToken = ["true", "yes", "1", true].includes(data.hasToken);
        }

        const record = await this.method.create(data);
        logger.info(`${this.modelName} created`, {
            id: record.id,
        });
        return record;
    };

    createMany = async (data: any[]): Promise<Products[]> => {
        const brands = await prisma.brands.findMany();
        const brandMap = new Map(brands.map(b => [b.name.toLowerCase().trim(), b.id]));

        for (const item of data) {
            if (!item.brandId && (item.brand || item.brandName)) {
                const bName = (item.brand || item.brandName).toString().trim().toLowerCase();
                const foundId = brandMap.get(bName);
                if (foundId) {
                    item.brandId = foundId;
                } else {
                    throw new ServerError({
                        status: 400,
                        message: `Brand "${item.brand || item.brandName}" not found for product "${item.name}". Please create it under Brands master first.`
                    });
                }
            }
            delete item.brand;
            delete item.brandName;
            delete item._brandName;

            if (item.price !== undefined && item.price !== null) item.price = Number(item.price);
            if (item.coverageSqFt !== undefined && item.coverageSqFt !== null && item.coverageSqFt !== "") {
                item.coverageSqFt = Number(item.coverageSqFt);
            } else {
                item.coverageSqFt = null;
            }
            if (item.coverageRnFt !== undefined && item.coverageRnFt !== null && item.coverageRnFt !== "") {
                item.coverageRnFt = Number(item.coverageRnFt);
            } else {
                item.coverageRnFt = null;
            }
            if (item.hasToken !== undefined) {
                item.hasToken = ["true", "yes", "1", true].includes(item.hasToken);
            }
        }

        const records = await this.method.createMany(data);
        logger.info(`${this.modelName} records bulk created`, {
            count: records.length,
        });
        return records;
    };
}

export { ProductService };
