import express from "express";
import { AuthFactory } from "../factory/auth.factory.js";
import { errorHandler } from "../factory/error.factory.js";
import { authenticate } from "../middleware/authenticate.middleware.js";

const router = express.Router();
const controller = AuthFactory.create();

router.post("/", errorHandler.wrapper(controller.login));
router.delete("/:flag", errorHandler.wrapper(controller.logout));

router.use(authenticate);
router.get("/", errorHandler.wrapper(controller.fetchState));

export { router as AuthRouter };
