import express from "express";
import { GeneralFactory } from "../factory/general.factory.js";
import { ProjectMaterialLogRepository } from "../repository/projectMaterialLog.repository.js";
import { ProjectMaterialLogService } from "../service/projectMaterialLog.service.js";
import { ProjectMaterialLogController } from "../controller/projectMaterialLog.controller.js";
import { errorHandler } from "../factory/error.factory.js";

const router = express.Router();
const controller = GeneralFactory.create(ProjectMaterialLogRepository, ProjectMaterialLogService, ProjectMaterialLogController);

router.get("/:id", errorHandler.wrapper(controller.fetch));
router.get("/", errorHandler.wrapper(controller.fetchAll));
router.post("/bulk", errorHandler.wrapper(controller.createMany));
router.post("/", errorHandler.wrapper(controller.create));
router.patch("/:id", errorHandler.wrapper(controller.update));
router.delete("/:id", errorHandler.wrapper(controller.delete));

export { router as ProjectMaterialLogRouter };
