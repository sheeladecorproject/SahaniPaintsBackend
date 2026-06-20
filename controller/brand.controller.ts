import type { Request, Response } from "express";
import { ControllerMessages } from "../constants/controller.messages.js";
import type { BrandService } from "../service/brand.service.js";
import { logger } from "../utils/logger.util.js";
import { BaseController } from "./base.controller.js";
import { ApiResponse } from "../utils/api.utils.js";

const controllerMessages = new ControllerMessages("BRAND");

class BrandController extends BaseController<BrandService> {
    constructor(service: BrandService) {
        super(service, "BRAND");
    } 

    fetchAll = async (req: Request, res: Response) => {
        logger.http(controllerMessages.FETCHALL.req, {
            ip: req.ip,
            userId: req.user?.id ?? "NA"
        });

        const brands = await this.service.fetchAll(
            this.getPagination(req),
            {
                id: req.query.id?.toString()
            },
            [
                "name"
            ]
        );

        return ApiResponse.success(res, controllerMessages.FETCHALL.res, brands);
    }
}

export { BrandController };
