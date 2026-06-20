import express from "express";
import { GeneralFactory } from "../factory/general.factory.js";
import { BrandsRepository } from "../repository/brands.repository.js";
import { BrandService } from "../service/brand.service.js";
import { BrandController } from "../controller/brand.controller.js";
import { errorHandler } from "../factory/error.factory.js";

const router = express.Router();
const controller = GeneralFactory.create(BrandsRepository, BrandService, BrandController);

router.get("/:id", errorHandler.wrapper(controller.fetch));
router.get("/", errorHandler.wrapper(controller.fetchAll));
router.post("/bulk", errorHandler.wrapper(controller.createMany));
router.post("/", errorHandler.wrapper(controller.create));
router.patch("/:id", errorHandler.wrapper(controller.update));
router.delete("/:id", errorHandler.wrapper(controller.delete));

export { router as BrandRouter };
