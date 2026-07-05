import type { Request, Response } from "express";
import { ControllerMessages } from "../constants/controller.messages.js";
import type { ProjectPaymentService } from "../service/projectPayment.service.js";
import { logger } from "../utils/logger.util.js";
import { BaseController } from "./base.controller.js";
import { ApiResponse } from "../utils/api.utils.js";

const controllerMessages = new ControllerMessages("PROJECT_PAYMENT");

class ProjectPaymentController extends BaseController<ProjectPaymentService> {
    constructor(service: ProjectPaymentService) {
        super(service, "PROJECT_PAYMENT");
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
            },
            []
        );

        return ApiResponse.success(res, controllerMessages.FETCHALL.res, logs);
    }
}

export { ProjectPaymentController };
