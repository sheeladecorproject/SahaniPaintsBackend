import express from "express";
import { GeneralFactory } from "../factory/general.factory.js";
import { ContractorWorkLogRepository } from "../repository/contractorWorkLog.repository.js";
import { ContractorWorkLogService } from "../service/contractorWorkLog.service.js";
import { ContractorWorkLogController } from "../controller/contractorWorkLog.controller.js";
import { errorHandler } from "../factory/error.factory.js";

const router = express.Router();
const controller = GeneralFactory.create(ContractorWorkLogRepository, ContractorWorkLogService, ContractorWorkLogController);

router.get("/:id", errorHandler.wrapper(controller.fetch));
router.get("/", errorHandler.wrapper(controller.fetchAll));
router.post("/", errorHandler.wrapper(controller.create));
router.patch("/:id", errorHandler.wrapper(controller.update));
router.delete("/:id", errorHandler.wrapper(controller.delete));

export { router as ContractorWorkLogRouter };
