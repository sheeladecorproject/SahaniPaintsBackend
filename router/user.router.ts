import express from "express";
import { GeneralFactory } from "../factory/general.factory.js";
import { UserRepository } from "../repository/user.repository.js";
import { UserService } from "../service/user.service.js";
import { UserController } from "../controller/user.controller.js";
import { errorHandler } from "../factory/error.factory.js";
import { authenticate, authorizePage } from "../middleware/authenticate.middleware.js";

const router = express.Router();
const controller = GeneralFactory.create(UserRepository, UserService, UserController);

router.get("/verify/:token", errorHandler.wrapper(controller.verify));

router.post("/bulk", errorHandler.wrapper(controller.createMany));
router.post("/", errorHandler.wrapper(controller.create));
router.get("/forget/:email", errorHandler.wrapper(controller.forgetPass));
router.patch("/:token", errorHandler.wrapper(controller.changePass));

router.use(authenticate);
router.use(authorizePage(["interiors", "sales-associate", "settings"]));
router.get("/:id", errorHandler.wrapper(controller.fetch));
router.delete("/:id", errorHandler.wrapper(controller.delete));
router.get("/", errorHandler.wrapper(controller.fetchAll));
router.put("/:id", errorHandler.wrapper(controller.update));

export { router as UserRouter };
