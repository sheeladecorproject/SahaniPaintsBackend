import type { Request, Response } from "express";
import { ControllerMessages } from "../constants/controller.messages.js";
import type { ContractorPaymentService } from "../service/contractorPayment.service.js";
import { logger } from "../utils/logger.util.js";
import { BaseController } from "./base.controller.js";
import { ApiResponse } from "../utils/api.utils.js";

const controllerMessages = new ControllerMessages("CONTRACTOR_PAYMENT");

class ContractorPaymentController extends BaseController<ContractorPaymentService> {
    constructor(service: ContractorPaymentService) {
        super(service, "CONTRACTOR_PAYMENT");
    }

    fetchAll = async (req: Request, res: Response) => {
        logger.http(controllerMessages.FETCHALL.req, {
            ip: req.ip,
            userId: req.user?.id ?? "NA"
        });

        const logs = await this.service.fetchAll(
            this.getPagination(req),
            {
                contractorId: req.query.contractorId?.toString(),
                projectId: req.query.projectId?.toString()
            },
            []
        );

        return ApiResponse.success(res, controllerMessages.FETCHALL.res, logs);
    }
}

export { ContractorPaymentController };
