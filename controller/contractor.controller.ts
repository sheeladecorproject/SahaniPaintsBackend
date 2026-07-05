import type { Request, Response } from "express";
import { ControllerMessages } from "../constants/controller.messages.js";
import type { ContractorService } from "../service/contractor.service.js";
import { logger } from "../utils/logger.util.js";
import { BaseController } from "./base.controller.js";
import { ApiResponse } from "../utils/api.utils.js";

const controllerMessages = new ControllerMessages("CONTRACTOR");

class ContractorController extends BaseController<ContractorService> {
    constructor(service: ContractorService) {
        super(service, "CONTRACTOR");
    }

    fetchAll = async (req: Request, res: Response) => {
        logger.http(controllerMessages.FETCHALL.req, {
            ip: req.ip,
            userId: req.user?.id ?? "NA"
        });

        const logs = await this.service.fetchAll(
            this.getPagination(req),
            {},
            ["name", "phonenumber"]
        );

        return ApiResponse.success(res, controllerMessages.FETCHALL.res, logs);
    }
}

export { ContractorController };
