import express from "express";
import { GeneralFactory } from "../factory/general.factory.js";
import { ContractorPaymentRepository } from "../repository/contractorPayment.repository.js";
import { ContractorPaymentService } from "../service/contractorPayment.service.js";
import { ContractorPaymentController } from "../controller/contractorPayment.controller.js";
import { errorHandler } from "../factory/error.factory.js";

const router = express.Router();
const controller = GeneralFactory.create(ContractorPaymentRepository, ContractorPaymentService, ContractorPaymentController);

router.get("/:id", errorHandler.wrapper(controller.fetch));
router.get("/", errorHandler.wrapper(controller.fetchAll));
router.post("/", errorHandler.wrapper(controller.create));
router.patch("/:id", errorHandler.wrapper(controller.update));
router.delete("/:id", errorHandler.wrapper(controller.delete));

export { router as ContractorPaymentRouter };
