import type { Request, Response } from "express";
import { ControllerMessages } from "../constants/controller.messages.js";
import type { LabourService } from "../service/labour.service.js";
import { logger } from "../utils/logger.util.js";
import { BaseController } from "./base.controller.js";
import { ApiResponse } from "../utils/api.utils.js";

const controllerMessages = new ControllerMessages("LABOUR");

class LabourController extends BaseController<LabourService> {
    constructor(service: LabourService) {
        super(service, "LABOUR");
    }

    fetchAll = async (req: Request, res: Response) => {
        logger.http(controllerMessages.FETCHALL.req, {
            ip: req.ip,
            userId: req.user?.id ?? "NA"
        });

        const labours = await this.service.fetchAll(
            this.getPagination(req),
            {
                id: req.query.id?.toString()
            },
            [
                "name"
            ]
        );

        return ApiResponse.success(res, controllerMessages.FETCHALL.res, labours);
    }
}

export { LabourController };
