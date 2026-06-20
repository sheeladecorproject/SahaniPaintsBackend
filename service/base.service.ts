import { errorMessage } from "../constants/error.constants.js";
import { ServerError } from "../utils/error.utils.js";
import { logger } from "../utils/logger.util.js";
import { PaginationData } from "../dto/pagination.dto.js";

abstract class BaseService<T, TData, TMethods> {
    constructor(protected method: TMethods, protected modelName: string) { }

    tx(TxClient: any): this {
        const instance = Object.create(Object.getPrototypeOf(this));
        Object.assign(instance, this);
        // @ts-ignore
        instance.methods = this.method.tx(TxClient);
        return instance;
    }

    create = async (data: TData): Promise<T> => {
        // @ts-ignore
        const record = await this.method.create(data);
        logger.info(`${this.modelName} created`, {
            id: record.id,
        });
        return record;
    }

    createMany = async (data: TData[]): Promise<T[]> => {
        // @ts-ignore
        const records = await this.method.createMany(data);
        logger.info(`${this.modelName} records bulk created`, {
            count: records.length,
        });
        return records;
    }

    fetch = async (id: string, userId?: string): Promise<T> => {
        // @ts-ignore
        const record = await this.method.fetch(id, userId);
        if (!record || !record.id) {
            logger.warn(`No ${this.modelName} found`, {
                id
            });
            throw new ServerError(errorMessage.NOTFOUND);
        }
        logger.info(`${this.modelName} fetched`, {
            id
        });
        return record;
    }

    fetchAll = async (data: PaginationData, filters: {}, searchFields: string[]) => {
        // @ts-ignore
        const records = await this.method.fetchAll(data, filters, searchFields);
        if (records.length === 0) {
            logger.warn(`No ${this.modelName} records found`);
            throw new ServerError(errorMessage.NOTFOUND);
        }
        const lastRecord = records[records.length - 1] as any;
        logger.info(`${this.modelName} records fetched`);
        return {
            records,
            nextCursor: {
                lastId: lastRecord.id,
                lastCreatedAt: lastRecord.createdAt
            }
        };
    }

    update = async (data: any, id: string, userId?: string): Promise<T> => {
        // @ts-ignore
        const record = await this.method.update(data, id);
        logger.info(`${this.modelName} record updated`, {
            id
        });
        return record;
    }

    delete = async (id: string): Promise<T> => {
        // @ts-ignore
        const record = await this.method.hardDelete(id);
        logger.info(`${this.modelName} record hard deleted`, { id });
        return record;
    }
}

export { BaseService };
