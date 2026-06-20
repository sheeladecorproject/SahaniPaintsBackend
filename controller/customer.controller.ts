import type { Request, Response } from "express";
import type { CustomerService } from "../service/customer.service.js";
import { logger } from "../utils/logger.util.js";
import { BaseController } from "./base.controller.js";
import { ControllerMessages } from "../constants/controller.messages.js";
import { ApiResponse } from "../utils/api.utils.js";

const controllerMessages = new ControllerMessages("CUSTOMER");

class CustomerController extends BaseController<CustomerService> {
    constructor(service: CustomerService) {
        super(service, "CUSTOMER");
    }

    fetchAll = async (req: Request, res: Response) => {
        logger.http(controllerMessages.FETCHALL.req, {
            ip: req.ip,
            userId: req.user?.id ?? "NA"
        });

        const customers = await this.service.fetchAll(
            this.getPagination(req),
            {
                id: req.query.id?.toString()   
            },
            [
                "name",
                "address"
            ]
        );

        return ApiResponse.success(res, controllerMessages.FETCHALL.res, customers);
    }
}

export { CustomerController };
