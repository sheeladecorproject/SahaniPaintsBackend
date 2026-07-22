import type { Request, Response } from "express";
import { ControllerMessages } from "../constants/controller.messages.js";
import type { ContractorWorkLogService } from "../service/contractorWorkLog.service.js";
import { logger } from "../utils/logger.util.js";
import { BaseController } from "./base.controller.js";
import { ApiResponse } from "../utils/api.utils.js";

const controllerMessages = new ControllerMessages("CONTRACTOR_WORK_LOG");

class ContractorWorkLogController extends BaseController<ContractorWorkLogService> {
    constructor(service: ContractorWorkLogService) {
        super(service, "CONTRACTOR_WORK_LOG");
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
                contractorId: req.query.contractorId?.toString()
            },
            []
        );

        return ApiResponse.success(res, controllerMessages.FETCHALL.res, logs);
    }
}

export { ContractorWorkLogController };
