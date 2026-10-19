import { errorMessage } from "../constants/error.constants.js";
import { prisma } from "../db/prisma.js";
import type { PaginationData } from "../dto/pagination.dto.js";
import { Prisma } from "../generated/prisma/client.js";
import { ServerError } from "../utils/error.utils.js";
import { serverUtils } from "../utils/server.utils.js";

interface RepoConfig {
    primaryKey: string;
    statusField: string;
    hasCreatedAt: boolean;
}

export abstract class BaseRepository<T, TCreateData, TUpdateData> {
    protected config: { primaryKey: string; statusField: string; hasCreatedAt: boolean };
    protected delegateKey: string | undefined;

    constructor(
        protected model: any = prisma,
        protected modelName: string,
        config: { primaryKey?: string; statusField?: string; hasCreatedAt?: boolean } = {}
    ) {
        this.delegateKey = Object.keys(prisma).find(k => (prisma as any)[k] === model);
        this.config = {
            primaryKey: "id",
            statusField: "",
            hasCreatedAt: true,
            ...config
        };
    }

    public handlePrismaError(error: any): never {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2025') {
                throw new ServerError(errorMessage.NOTFOUND);
            }
            if (error.code === 'P2003') {
                throw new ServerError(errorMessage.INVALIDDATA);
            }
            if (error.code === 'P2002') {
                const target = Array.isArray(error.meta?.target)
                    ? error.meta.target.join(', ')
                    : (error.meta?.target || '');
                const msg = target ? `Data already exists with duplicate ${target}` : errorMessage.ALREADYTAKEN.message;
                throw new ServerError({ status: 409, message: msg });
            }
        }
        throw error;
    }

    tx(txModel: any): this {
        const instance = Object.create(Object.getPrototypeOf(this));
        Object.assign(instance, this);
        if (txModel && typeof txModel.create === "function") {
            instance.model = txModel;
        } else if (txModel && this.delegateKey && txModel[this.delegateKey]) {
            instance.model = txModel[this.delegateKey];
        } else if (txModel) {
            const key = Object.keys(prisma).find(k => (prisma as any)[k] === this.model);
            if (key && txModel[key]) {
                instance.model = txModel[key];
            } else {
                instance.model = txModel;
            }
        }
        return instance;
    }

    create = async (data: TCreateData): Promise<T> => {
        try {
            return await this.model.create({
                data,
                select: {
                    id: true,
                    ...(this.config.hasCreatedAt !== false ? { createdAt: true } : {}),
                }
            });
        } catch (error) {
            this.handlePrismaError(error);
        }
    };

    createMany = async (data: TCreateData[]): Promise<T[]> => {
        try {
            return await prisma.$transaction(async (txClient) => {
                const txRepo = this.tx(txClient);
                const results: T[] = [];
                let rowNum = 0;
                for (const item of data) {
                    rowNum++;
                    try {
                        const record = await txRepo.create(item);
                        if (record) results.push(record);
                    } catch (itemError: any) {
                        if (itemError instanceof Prisma.PrismaClientKnownRequestError) {
                            if (itemError.code === 'P2002') {
                                const target = Array.isArray(itemError.meta?.target)
                                    ? itemError.meta.target.join(', ')
                                    : (itemError.meta?.target || 'field');
                                throw new ServerError({
                                    status: 409,
                                    message: `Row ${rowNum}: Duplicate record found (${target} already exists)`
                                });
                            }
                            if (itemError.code === 'P2003') {
                                throw new ServerError({
                                    status: 400,
                                    message: `Row ${rowNum}: Invalid reference or missing related data`
                                });
                            }
                        }
                        if (itemError instanceof ServerError) {
                            throw new ServerError({
                                status: itemError.status,
                                message: `Row ${rowNum}: ${itemError.message}`
                            });
                        }
                        throw itemError;
                    }
                }
                return results;
            }, { maxWait: 15000, timeout: 20000 });
        } catch (error) {
            this.handlePrismaError(error);
        }
    };

    fetch = async (id: string, userId?: string): Promise<T> => {
        const where: any = {
            [this.config.primaryKey]: id,
            ...(userId ? { userId } : {})
        };

        if (this.config.statusField) {
            where[this.config.statusField] = null;
        }
        const record = await this.model.findFirst({
            where
        });
        return record ?? ({} as T);
    };

    fetchAll = async (
        data: PaginationData,
        filters: any,
        searchFields: string[] = []
    ): Promise<T[]> => {
        let where: any = {};

        if (this.config.statusField) {
            where[this.config.statusField] = null;
        }

        where = serverUtils.buildWhere(where, filters, data, searchFields, this.config.hasCreatedAt);

        return await this.model.findMany({
            take: data.limit || 10,
            where,
            orderBy: [
                ...(this.config.hasCreatedAt !== false
                    ? [{ createdAt: "desc" as const }]
                    : []),
                { id: "desc" as const },
            ],
        });
    };

    update = async (data: TUpdateData, id: string, userId?: string) => {
        try {
            const where: any = {
                [this.config.primaryKey]: id,
                ...(userId ? { userId } : {})
            };

            if (this.config.statusField) {
                where[this.config.statusField] = null;
            }

            return await this.model.update({
                where,
                data,
            });
        } catch (error) {
            this.handlePrismaError(error);
        }
    };

    softDelete = async (id: string, userId?: string): Promise<T> => {
        try {
            return await this.model.update({
                where: {
                    [this.config.primaryKey]: id,
                    ...(this.config.statusField ? { [this.config.statusField]: null } : {}),
                    ...(userId ? { userId } : {})
                },
                data: { [this.config.statusField || 'deletedAt']: new Date() }
            });
        } catch (error) {
            this.handlePrismaError(error);
        }
    };

    hardDelete = async (id: string, userId?: string) => {
        try {
            return await this.model.delete({
                where: { [this.config.primaryKey]: id, ...(userId ? { userId } : {}) }
            });
        } catch (error) {
            this.handlePrismaError(error);
        }
    };
}
