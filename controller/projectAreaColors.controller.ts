import type { Request, Response } from "express";
import { ControllerMessages } from "../constants/controller.messages.js";
import type { ProjectAreaColorsService } from "../service/projectAreaColors.service.js";
import { logger } from "../utils/logger.util.js";
import { BaseController } from "./base.controller.js";
import { ApiResponse } from "../utils/api.utils.js";

const controllerMessages = new ControllerMessages("PROJECT_AREA_COLOR");

class ProjectAreaColorsController extends BaseController<ProjectAreaColorsService> {
    constructor(service: ProjectAreaColorsService) {
        super(service, "PROJECT_AREA_COLOR");
    }

    fetchAll = async (req: Request, res: Response) => {
        logger.http(controllerMessages.FETCHALL.req, {
            ip: req.ip,
            userId: req.user?.id ?? "NA"
        });

        const mappings = await this.service.fetchAll(
            this.getPagination(req),
            {
                projectId: req.query.projectId?.toString(),
                areaId: req.query.areaId?.toString(),
                colorId: req.query.colorId?.toString()
            },
            []
        );

        return ApiResponse.success(res, controllerMessages.FETCHALL.res, mappings);
       }
}

export { ProjectAreaColorsController };
