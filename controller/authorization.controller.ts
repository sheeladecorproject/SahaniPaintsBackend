import type { Request, Response } from "express";
import { ControllerMessages } from "../constants/controller.messages.js";
import type { AuthorizationService } from "../service/authorization.service.js";
import { logger } from "../utils/logger.util.js";
import { BaseController } from "./base.controller.js";
import { ApiResponse } from "../utils/api.utils.js";

const controllerMessages = new ControllerMessages("AUTHORIZATION");

class AuthorizationController extends BaseController<AuthorizationService> {
    constructor(service: AuthorizationService) {
        super(service, "AUTHORIZATION");
    }

    fetchAll = async (req: Request, res: Response) => {
        logger.http(controllerMessages.FETCHALL.req, {
            ip: req.ip,
            userId: req.user?.id ?? "NA"
        });

        const authorizations = await this.service.fetchAll(
            this.getPagination(req),
            {
                userId: req.query.userId?.toString(),
                access: req.query.access?.toString()
            },
            []
        );

        return ApiResponse.success(res, controllerMessages.FETCHALL.res, authorizations);
    }
}

export { AuthorizationController };
