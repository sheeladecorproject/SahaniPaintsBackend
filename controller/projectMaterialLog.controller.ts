import type { Request, Response } from "express";
import { ControllerMessages } from "../constants/controller.messages.js";
import type { ProjectMaterialLogService } from "../service/projectMaterialLog.service.js";
import { logger } from "../utils/logger.util.js";
import { BaseController } from "./base.controller.js";
import { ApiResponse } from "../utils/api.utils.js";

const controllerMessages = new ControllerMessages("PROJECT_MATERIAL_LOG");

class ProjectMaterialLogController extends BaseController<ProjectMaterialLogService> {
    constructor(service: ProjectMaterialLogService) {
        super(service, "PROJECT_MATERIAL_LOG");
    }

    fetchAll = async (req: Request, res: Response) => {
        logger.http(controllerMessages.FETCHALL.req, {
            ip: req.ip,
            userId: req.user?.id ?? "NA"
        });

        const logs = await this.service.fetchAll(
            this.getPagination(req),
            {
                projectId: req.query.projectId?.toString(),
                date: req.query.date?.toString(),
                productId: req.query.productId?.toString()
            },
            []
        );

        return ApiResponse.success(res, controllerMessages.FETCHALL.res, logs);
    }
}

export { ProjectMaterialLogController };
