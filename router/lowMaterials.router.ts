import express from "express";
import { GeneralFactory } from "../factory/general.factory.js";
import { LowMaterialsRepository } from "../repository/lowMaterials.repository.js";
import { LowMaterialsService } from "../service/lowMaterials.service.js";
import { LowMaterialsController } from "../controller/lowMaterials.controller.js";
import { errorHandler } from "../factory/error.factory.js";

const router = express.Router();
const controller = GeneralFactory.create(LowMaterialsRepository, LowMaterialsService, LowMaterialsController);

router.get("/:id", errorHandler.wrapper(controller.fetch));
router.get("/", errorHandler.wrapper(controller.fetchAll));
router.post("/bulk", errorHandler.wrapper(controller.createMany));
router.post("/", errorHandler.wrapper(controller.create));
router.patch("/:id", errorHandler.wrapper(controller.update));
router.delete("/:id", errorHandler.wrapper(controller.delete));

export { router as LowMaterialsRouter };
