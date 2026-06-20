import type { Request, Response } from "express";
import type { ProductService } from "../service/product.service.js";
import { logger } from "../utils/logger.util.js";
import { BaseController } from "./base.controller.js";
import { ControllerMessages } from "../constants/controller.messages.js";
import { ApiResponse } from "../utils/api.utils.js";

const controllerMessages = new ControllerMessages("PRODUCT");

class ProductController extends BaseController<ProductService> {
    constructor(service: ProductService) {
        super(service, "PRODUCT");
    }

    fetchAll = async (req: Request, res: Response) => {
        logger.http(controllerMessages.FETCHALL.req, {
            ip: req.ip,
            userId: req.user?.id ?? "NA"
        });

        const products = await this.service.fetchAll(
            this.getPagination(req),
            {
                id: req.query.id?.toString(),
                brandId: req.query.brandId?.toString(),
                category: req.query.category?.toString()
            },
            [
                "name"
            ]
        );

        return ApiResponse.success(res, controllerMessages.FETCHALL.res, products);
    }
}

export { ProductController };
