import type { Request, Response } from "express";
import type { LowMaterialsService } from "../service/lowMaterials.service.js";
import { ApiResponse } from "../utils/api.utils.js";
import { logger } from "../utils/logger.util.js";
import { BaseController } from "./base.controller.js";
import { ControllerMessages } from "../constants/controller.messages.js";

const controllerMessages = new ControllerMessages("LOW_MATERIALS");

class LowMaterialsController extends BaseController<LowMaterialsService> {
    constructor(service: LowMaterialsService) {
        super(service, "LOW_MATERIALS");
    }

    fetchAll = async (req: Request, res: Response) => {
        logger.http(controllerMessages.FETCHALL.req, {
            ip: req.ip,
            userId: req.user?.id ?? "NA"
        });

        const filters: any = {};
        if (req.query.projectId) {
            filters.projectId = req.query.projectId.toString();
        }
        if (req.query.delivered !== undefined) {
            filters.delivered = req.query.delivered === "true";
        }

        const items = await this.service.fetchAll(
            this.getPagination(req),
            filters,
            [
                "material"
            ]
        );

        return ApiResponse.success(res, controllerMessages.FETCHALL.res, items);
    }
}

export { LowMaterialsController };
