import type { Request, Response } from "express";
import type { UserService } from "../service/user.service.js";
import { logger } from "../utils/logger.util.js";
import { ApiResponse } from "../utils/api.utils.js";
import { BaseController } from "./base.controller.js";
import { ControllerMessages } from "../constants/controller.messages.js";

const controllerMessages = new ControllerMessages("USER");

class UserController extends BaseController<UserService> {
    constructor(service: UserService) {
        super(service, "USER");
    }

    fetch = async (req: Request, res: Response) => {
        logger.http("User fetch request received", {
            ip: req.ip
        });

        const user = await this.service.fetch(
            req.params.id?.toString() ?? undefined,
            req.query.username?.toString() ?? undefined,
            req.query.email?.toString() ?? undefined
        );

        return ApiResponse.success(res, "User fetched", user);
    }

    fetchAll = async (req: Request, res: Response) => {
        logger.http(controllerMessages.FETCHALL.req, {
            ip: req.ip,
            userId: req.user?.id ?? "NA"
        });

        const users = await this.service.fetchAll(
            this.getPagination(req),
            {
                role: req.query.role?.toString(),
            },
            [
                "username",
                "email"
            ]
        );

        return ApiResponse.success(res, controllerMessages.FETCHALL.res, users);
    }

    forgetPass = async (req: Request, res: Response) => {
        logger.http("Forget password request received", {
            ip: req.ip
        });

        await this.service.forgetPass(
            req.params.id?.toString() ?? undefined,
            req.query.username?.toString() ?? undefined,
            req.params.email?.toString() ?? undefined
        );

        return ApiResponse.success(res, "Forget password token generated");
    }

    changePass = async (req: Request, res: Response) => {
        logger.http("Change password request received", {
            ip: req.ip
        });

        const user = await this.service.changePass(req.params.token?.toString() ?? "", req.body.password);
        return ApiResponse.success(res, "Password changed", user);
    }
}

export { UserController };
