import express from "express";
import { GeneralFactory } from "../factory/general.factory.js";
import { ProjectPaymentRepository } from "../repository/projectPayment.repository.js";
import { ProjectPaymentService } from "../service/projectPayment.service.js";
import { ProjectPaymentController } from "../controller/projectPayment.controller.js";
import { errorHandler } from "../factory/error.factory.js";

const router = express.Router();
const controller = GeneralFactory.create(ProjectPaymentRepository, ProjectPaymentService, ProjectPaymentController);

router.get("/:id", errorHandler.wrapper(controller.fetch));
router.get("/", errorHandler.wrapper(controller.fetchAll));
router.post("/", errorHandler.wrapper(controller.create));
router.patch("/:id", errorHandler.wrapper(controller.update));
router.delete("/:id", errorHandler.wrapper(controller.delete));

export { router as ProjectPaymentRouter };
