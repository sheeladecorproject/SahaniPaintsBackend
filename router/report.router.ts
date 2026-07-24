import express from "express";
import { GeneralFactory } from "../factory/general.factory.js";
import { ReportRepository } from "../repository/report.repository.js";
import { ReportService } from "../service/report.service.js";
import { ReportController } from "../controller/report.controller.js";
import { errorHandler } from "../factory/error.factory.js";

const router = express.Router();
const controller = GeneralFactory.create(ReportRepository, ReportService, ReportController);

router.get("/", errorHandler.wrapper(controller.fetchDashData));
router.get("/projects", errorHandler.wrapper(controller.getProjectsReport));
router.get("/payments", errorHandler.wrapper(controller.getPaymentsReport));
router.get("/interiors", errorHandler.wrapper(controller.getInteriorsReport));
router.get("/products", errorHandler.wrapper(controller.getProductsReport));

export { router as ReportRouter };
