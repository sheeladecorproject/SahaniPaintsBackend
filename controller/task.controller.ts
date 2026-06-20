import type { Request, Response } from "express";
import type { TaskService } from "../service/task.service.js";
import { ApiResponse } from "../utils/api.utils.js";
import { logger } from "../utils/logger.util.js";
import { BaseController } from "./base.controller.js";
import { ControllerMessages } from "../constants/controller.messages.js";

const controllerMessages = new ControllerMessages("TASK");

class TaskController extends BaseController<TaskService> {
    constructor(service: TaskService) {
        super(service, "TASK");
    }

    fetchAll = async (req: Request, res: Response) => {
        logger.http(controllerMessages.FETCHALL.req, {
            ip: req.ip,
            userId: req.user?.id ?? "NA"
        });

        const tasks = await this.service.fetchAll(
            this.getPagination(req),
            {
                projectId: req.query.projectId?.toString()
            },
            [
                "title",
                "description"
            ]
        );

        return ApiResponse.success(res, controllerMessages.FETCHALL.res, tasks);
    }
}

export { TaskController };
