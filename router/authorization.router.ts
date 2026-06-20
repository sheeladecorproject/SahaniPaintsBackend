import express from "express";
import { GeneralFactory } from "../factory/general.factory.js";
import { AuthorizationRepository } from "../repository/authorization.repository.js";
import { AuthorizationService } from "../service/authorization.service.js";
import { AuthorizationController } from "../controller/authorization.controller.js";
import { errorHandler } from "../factory/error.factory.js";

const router = express.Router();
const controller = GeneralFactory.create(AuthorizationRepository, AuthorizationService, AuthorizationController);

router.get("/:id", errorHandler.wrapper(controller.fetch));
router.get("/", errorHandler.wrapper(controller.fetchAll));
router.post("/", errorHandler.wrapper(controller.create));
router.patch("/:id", errorHandler.wrapper(controller.update));
router.delete("/:id", errorHandler.wrapper(controller.delete));

export { router as AuthorizationRouter };
