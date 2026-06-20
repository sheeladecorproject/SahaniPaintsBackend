import express from "express";
import { GeneralFactory } from "../factory/general.factory.js";
import { ColorsRepository } from "../repository/colors.repository.js";
import { ColorService } from "../service/color.service.js";
import { ColorController } from "../controller/color.controller.js";
import { errorHandler } from "../factory/error.factory.js";

const router = express.Router();
const controller = GeneralFactory.create(ColorsRepository, ColorService, ColorController);

router.get("/:id", errorHandler.wrapper(controller.fetch));
router.get("/", errorHandler.wrapper(controller.fetchAll));
router.post("/bulk", errorHandler.wrapper(controller.createMany));
router.post("/", errorHandler.wrapper(controller.create));
router.patch("/:id", errorHandler.wrapper(controller.update));
router.delete("/:id", errorHandler.wrapper(controller.delete));

export { router as ColorRouter };
