import type { Request, Response } from "express";
import { ControllerMessages } from "../constants/controller.messages.js";
import type { LabourPaymentsService } from "../service/labourPayments.service.js";
import { logger } from "../utils/logger.util.js";
import { BaseController } from "./base.controller.js";
import { ApiResponse } from "../utils/api.utils.js";

const controllerMessages = new ControllerMessages("LABOUR_PAYMENTS");

class LabourPaymentController extends BaseController<LabourPaymentsService> {
    constructor(service: LabourPaymentsService) {
        super(service, "LABOUR_PAYMENTS");
    }

    fetchAll = async (req: Request, res: Response) => {
        logger.http(controllerMessages.FETCHALL.req, {
            ip: req.ip,
            userId: req.user?.id ?? "NA"
        });

        const payments = await this.service.fetchAll(
            this.getPagination(req),
            {
                labourId: req.query.labourId?.toString(),
                projectId: req.query.projectId?.toString()
            },
            []
        );

        return ApiResponse.success(res, controllerMessages.FETCHALL.res, payments);
    }
}

export { LabourPaymentController };
