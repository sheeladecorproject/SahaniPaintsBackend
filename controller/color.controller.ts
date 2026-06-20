import type { Request, Response } from "express";
import { ControllerMessages } from "../constants/controller.messages.js";
import type { ColorService } from "../service/color.service.js";
import { logger } from "../utils/logger.util.js";
import { BaseController } from "./base.controller.js";
import { ApiResponse } from "../utils/api.utils.js";

const controllerMessages = new ControllerMessages("COLOR");

class ColorController extends BaseController<ColorService> {
    constructor(service: ColorService) {
        super(service, "COLOR");
    }

    fetchAll = async (req: Request, res: Response) => {
        logger.http(controllerMessages.FETCHALL.req, {
            ip: req.ip,
            userId: req.user?.id ?? "NA"
        });

        const colors = await this.service.fetchAll(
            this.getPagination(req),
            {
                id: req.query.id?.toString()
            },
            [
                "name",
                "shade"
            ]
        );

        return ApiResponse.success(res, controllerMessages.FETCHALL.res, colors);
    }
}

export { ColorController };
