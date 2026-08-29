import type { Request, Response } from "express";
import type { ActivityLogService } from "../service/activityLog.service.js";
import { ApiResponse } from "../utils/api.utils.js";
import { BaseController } from "./base.controller.js";
import { logger } from "../utils/logger.util.js";

class ActivityLogController extends BaseController<ActivityLogService> {
    constructor(service: ActivityLogService) {
        super(service, "ACTIVITY_LOG");
    }

    getActivityLogs = async (req: Request, res: Response) => {
        logger.http("Fetch activity logs request received", {
            ip: req.ip,
            userId: req.user?.id || "NA"
        });

        const filters = {
            userId: req.query.userId?.toString(),
            action: req.query.action?.toString(),
            entity: req.query.entity?.toString(),
            startDate: req.query.startDate?.toString(),
            endDate: req.query.endDate?.toString(),
            search: req.query.search?.toString(),
            page: req.query.page ? Number(req.query.page) : 1,
            limit: req.query.limit ? Number(req.query.limit) : 50,
        };

        const result = await this.service.getActivityLogs(filters);
        return ApiResponse.success(res, "Activity logs fetched successfully", result);
    };

    createActivityLog = async (req: Request, res: Response) => {
        const { action, entity, details } = req.body;

        const log = await this.service.logActivity({
            userId: req.user?.id,
            userName: (req.user as any)?.username || (req.user as any)?.name || "User",
            userRole: req.user?.role || "USER",
            action,
            entity,
            details,
            ipAddress: req.ip,
        });

        return ApiResponse.success(res, "Activity log created", log);
    };
}

export { ActivityLogController };
