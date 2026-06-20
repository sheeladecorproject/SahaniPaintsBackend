import express from "express";
import { GeneralFactory } from "../factory/general.factory.js";
import { InquiryRepository } from "../repository/inquiry.repository.js";
import { InquiryService } from "../service/inquiry.service.js";
import { InquiryController } from "../controller/inquiry.controller.js";
import { errorHandler } from "../factory/error.factory.js";

const router = express.Router();
const controller = GeneralFactory.create(InquiryRepository, InquiryService, InquiryController);

router.get("/:id", errorHandler.wrapper(controller.fetch));
router.get("/", errorHandler.wrapper(controller.fetchAll));
router.post("/bulk", errorHandler.wrapper(controller.createMany));
router.post("/", errorHandler.wrapper(controller.create));
router.patch("/:id", errorHandler.wrapper(controller.update));
router.delete("/:id", errorHandler.wrapper(controller.delete));

export { router as InquiryRouter };
