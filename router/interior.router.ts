import express from "express";
import { GeneralFactory } from "../factory/general.factory.js";
import { InteriorRepository } from "../repository/interior.repository.js";
import { InteriorService } from "../service/interior.service.js";
import { InteriorController } from "../controller/interior.controller.js";
import { errorHandler } from "../factory/error.factory.js";

const router = express.Router();
const controller = GeneralFactory.create(InteriorRepository, InteriorService, InteriorController);

router.get("/:id", errorHandler.wrapper(controller.fetch));
router.get("/", errorHandler.wrapper(controller.fetchAll));
router.post("/bulk", errorHandler.wrapper(controller.createMany));
router.post("/", errorHandler.wrapper(controller.create));
router.patch("/:id", errorHandler.wrapper(controller.update));
router.delete("/:id", errorHandler.wrapper(controller.delete));

export { router as InteriorRouter };
