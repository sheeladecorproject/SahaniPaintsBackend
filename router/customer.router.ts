import express from "express";
import { GeneralFactory } from "../factory/general.factory.js";
import { CustomerRepository } from "../repository/customer.repository.js";
import { CustomerService } from "../service/customer.service.js";
import { CustomerController } from "../controller/customer.controller.js";
import { errorHandler } from "../factory/error.factory.js";

const router = express.Router();
const controller = GeneralFactory.create(CustomerRepository, CustomerService, CustomerController);

router.get("/:id", errorHandler.wrapper(controller.fetch));
router.get("/", errorHandler.wrapper(controller.fetchAll));
router.post("/bulk", errorHandler.wrapper(controller.createMany));
router.post("/", errorHandler.wrapper(controller.create));
router.patch("/:id", errorHandler.wrapper(controller.update));
router.delete("/:id", errorHandler.wrapper(controller.delete));

export { router as CustomerRouter };
