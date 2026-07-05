import express from "express";
import { GeneralFactory } from "../factory/general.factory.js";
import { ContractorRepository } from "../repository/contractor.repository.js";
import { ContractorService } from "../service/contractor.service.js";
import { ContractorController } from "../controller/contractor.controller.js";
import { errorHandler } from "../factory/error.factory.js";

const router = express.Router();
const controller = GeneralFactory.create(ContractorRepository, ContractorService, ContractorController);

router.get("/:id", errorHandler.wrapper(controller.fetch));
router.get("/", errorHandler.wrapper(controller.fetchAll));
router.post("/", errorHandler.wrapper(controller.create));
router.patch("/:id", errorHandler.wrapper(controller.update));
router.delete("/:id", errorHandler.wrapper(controller.delete));

export { router as ContractorRouter };
