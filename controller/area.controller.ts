import type { Request, Response } from "express";
import { ControllerMessages } from "../constants/controller.messages.js";
import type { AreaService } from "../service/area.service.js";
import { logger } from "../utils/logger.util.js";
import { BaseController } from "./base.controller.js";
import { ApiResponse } from "../utils/api.utils.js";

const controllerMessages = new ControllerMessages("AREA");

class AreaController extends BaseController<AreaService> {
    constructor(service: AreaService) {
        super(service, "AREA");
    }

    fetchAll = async (req: Request, res: Response) => {
        logger.http(controllerMessages.FETCHALL.req, {
            ip: req.ip,
            userId: req.user?.id ?? "NA"
        });

        const areas = await this.service.fetchAll(
            this.getPagination(req),
            {
                projectId: req.query.projectId?.toString()
            },
            [
                "name"
            ]
        );

        return ApiResponse.success(res, controllerMessages.FETCHALL.res, areas);
    }
}

export { AreaController };
