import type { Request, Response } from "express";
import { ControllerMessages } from "../constants/controller.messages.js";
import { logger } from "../utils/logger.util.js";
import { ApiResponse } from "../utils/api.utils.js";

abstract class BaseController <TService> {
    protected messages: ControllerMessages;

    constructor(
        protected service: TService,
        protected modelName: string
    ) {
        this.messages = new ControllerMessages(modelName);
    }

    protected logRequest(req: Request, message: string, extra = {}) {
        logger.http(message, {
            ip: req.ip,
            userId: req.user?.id ?? "PUBLIC",
            ...extra
        });
    }

    protected getPagination(req: Request) {
        const now = new Date();
        const path = req.baseUrl || req.path || "";

        const isFinancialDateResource =
            path.includes("/payments") || path.includes("/projects");

        const currentYear = now.getFullYear();

        const financialYearStart =
            now.getMonth() >= 3
                ? new Date(currentYear, 3, 1)     // Apr 1 current year
                : new Date(currentYear - 1, 3, 1); // Apr 1 previous year

        const financialYearEnd =
            now.getMonth() >= 3
                ? new Date(currentYear + 1, 2, 31, 23, 59, 59, 999)
                : new Date(currentYear, 2, 31, 23, 59, 59, 999);

        const startDate =
            req.query.startDate
                ? new Date(req.query.startDate.toString())
                : isFinancialDateResource
                    ? financialYearStart
                    : undefined;

        const endDate =
            req.query.endDate
                ? new Date(req.query.endDate.toString())
                : isFinancialDateResource
                    ? financialYearEnd
                    : undefined;

        return {
            limit: Number(req.query.limit) || 10,
            sort: req.query.sort?.toString(),
            search: req.query.search?.toString(),
            lastId: req.query.lastId?.toString(),
            lastCreatedAt: req.query.lastCreatedAt
                ? new Date(req.query.lastCreatedAt.toString())
                : undefined,

            minPrice:
                req.query.minPrice !== undefined
                    ? Number(req.query.minPrice)
                    : undefined,

            maxPrice:
                req.query.maxPrice !== undefined
                    ? Number(req.query.maxPrice)
                    : undefined,

            startDate,
            endDate,
        };
    }

    create = async (req: Request, res: Response) => {
        this.logRequest(req, this.messages.CREATE.req);
        // @ts-ignore
        const result = await this.service.create(req.body);
        return ApiResponse.success(res, this.messages.CREATE.res, result);
    }

    createMany = async (req: Request, res: Response) => {
        this.logRequest(req, `BULK_CREATE_${this.modelName}`);
        if (!Array.isArray(req.body)) {
            return ApiResponse.error(res, "Request body must be an array of records.");
        }
        // @ts-ignore
        const result = await this.service.createMany(req.body);
        return ApiResponse.success(res, `${this.modelName} records imported successfully`, result);
    }

    fetch = async (req: Request, res: Response) => {
        this.logRequest(req, this.messages.FETCH.req);
        // @ts-ignore
        const result = await this.service.fetch(req.params.id?.toString(), req.user?.role === "ADMIN" ? undefined : req.user?.id);
        return ApiResponse.success(res, this.messages.FETCH.res, result);
    }

    update = async (req: Request, res: Response) => {
        this.logRequest(req, this.messages.UPDATE.req);
        // @ts-ignore
        const result = await this.service.update(req.body, req.params.id?.toString(), req.user?.role === "ADMIN" ? undefined : req.user?.id);
        return ApiResponse.success(res, this.messages.UPDATE.res, result);
    }

    delete = async (req: Request, res: Response) => {
        this.logRequest(req, this.messages.DELETE.req);
        // @ts-ignore
        const result = await this.service.delete(req.params.id?.toString());
        return ApiResponse.success(res, this.messages.DELETE.res, result);
    }
}

export { BaseController };
