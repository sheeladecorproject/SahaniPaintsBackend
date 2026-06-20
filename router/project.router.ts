import express from "express";
import { GeneralFactory } from "../factory/general.factory.js";
import { ProjectRepository } from "../repository/project.repository.js";
import { ProjectService } from "../service/project.service.js";
import { ProjectController } from "../controller/project.controller.js";
import { authenticate } from "../middleware/authenticate.middleware.js";
import { errorHandler } from "../factory/error.factory.js";

const router = express.Router();
const controller = GeneralFactory.create(ProjectRepository, ProjectService, ProjectController);

router.use(authenticate);

router.get("/:id", errorHandler.wrapper(controller.fetch));
router.get("/", errorHandler.wrapper(controller.fetchAll));
router.post("/", errorHandler.wrapper(controller.create));
router.patch("/:id", errorHandler.wrapper(controller.update));
router.patch("/:id/status", errorHandler.wrapper(controller.updateStatus));
router.delete("/:id", errorHandler.wrapper(controller.delete));

export { router as ProjectRouter };
