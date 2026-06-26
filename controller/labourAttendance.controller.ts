import type { Request, Response } from "express";
import { ControllerMessages } from "../constants/controller.messages.js";
import type { LabourAttendanceService } from "../service/labourAttendance.service.js";
import { logger } from "../utils/logger.util.js";
import { BaseController } from "./base.controller.js";
import { ApiResponse } from "../utils/api.utils.js";

const controllerMessages = new ControllerMessages("LABOUR_ATTENDANCE");

class LabourAttendanceController extends BaseController<LabourAttendanceService> {
    constructor(service: LabourAttendanceService) {
        super(service, "LABOUR_ATTENDANCE");
    }

    fetchAll = async (req: Request, res: Response) => {
        logger.http(controllerMessages.FETCHALL.req, {
            ip: req.ip,
            userId: req.user?.id ?? "NA"
        });

        const attendance = await this.service.fetchAll(
            this.getPagination(req),
            {
                projectId: req.query.projectId?.toString(),
                date: req.query.date?.toString(),
                labourId: req.query.labourId?.toString()
            },
            []
        );

        return ApiResponse.success(res, controllerMessages.FETCHALL.res, attendance);
    }
}

export { LabourAttendanceController };
