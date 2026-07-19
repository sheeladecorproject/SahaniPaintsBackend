import type { Request, Response } from "express";
import type { InteriorService } from "../service/interior.service.js";
import { logger } from "../utils/logger.util.js";
import { BaseController } from "./base.controller.js";
import { ControllerMessages } from "../constants/controller.messages.js";
import { ApiResponse } from "../utils/api.utils.js";

const controllerMessages = new ControllerMessages("INTERIOR");

class InteriorController extends BaseController<InteriorService> {
    constructor(service: InteriorService) {
        super(service, "INTERIOR");
    }

    fetchAll = async (req: Request, res: Response) => {
        logger.http(controllerMessages.FETCHALL.req, {
            ip: req.ip,
            userId: req.user?.id ?? "NA"
        });

        const interiors = await this.service.fetchAll(
            this.getPagination(req),
            {
                id: req.query.id?.toString()
            },
            [
                "name",
                "address",
                "email"
            ]
        );

        return ApiResponse.success(res, controllerMessages.FETCHALL.res, interiors);
    }
}

export { InteriorController };
