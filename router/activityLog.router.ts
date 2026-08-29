import express from "express";
import { GeneralFactory } from "../factory/general.factory.js";
import { ActivityLogRepository } from "../repository/activityLog.repository.js";
import { ActivityLogService } from "../service/activityLog.service.js";
import { ActivityLogController } from "../controller/activityLog.controller.js";
import { errorHandler } from "../factory/error.factory.js";
import { authenticateAdmin } from "../middleware/authenticate.middleware.js";

const router = express.Router();
const controller = GeneralFactory.create(ActivityLogRepository, ActivityLogService, ActivityLogController);

router.use(authenticateAdmin);

router.get("/", errorHandler.wrapper(controller.getActivityLogs));
router.post("/", errorHandler.wrapper(controller.createActivityLog));

export { router as ActivityLogRouter };
