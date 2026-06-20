import type { Request, Response } from "express";
import type { InquiryService } from "../service/inquiry.service.js";
import { logger } from "../utils/logger.util.js";
import { BaseController } from "./base.controller.js";
import { ControllerMessages } from "../constants/controller.messages.js";
import { ApiResponse } from "../utils/api.utils.js";

const controllerMessages = new ControllerMessages("INQUIRY");

class InquiryController extends BaseController<InquiryService> {
    constructor(service: InquiryService) {
        super(service, "INQUIRY");
    }

    fetchAll = async (req: Request, res: Response) => {
        logger.http(controllerMessages.FETCHALL.req, {
            ip: req.ip,
            userId: req.user?.id ?? "NA"
        });

        const inquiries = await this.service.fetchAll(
            this.getPagination(req),
            {},
            [
                "projectName",
                "customerName",
                "comments"
            ]
        );

        return ApiResponse.success(res, controllerMessages.FETCHALL.res, inquiries);
    }  
}

export { InquiryController };
