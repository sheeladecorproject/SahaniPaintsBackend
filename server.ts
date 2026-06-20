import express, { type Request, type Response } from "express";
import dotenv from "dotenv";
import { config } from "./config/index.js";
import { UserRouter } from "./router/user.router.js";
import { logger } from "./utils/logger.util.js";
import morgan from "morgan";
import { globalErrorHandler } from "./factory/error.factory.js";
import { AuthRouter } from "./router/auth.router.js";
import cookieParser from "cookie-parser";
import { BrandRouter } from "./router/brand.router.js";
import { ProductRouter } from "./router/product.router.js";
import { TaskRouter } from "./router/task.router.js";
import { ProjectRouter } from "./router/project.router.js";
import { CustomerRouter } from "./router/customer.router.js";
import { InquiryRouter } from "./router/inquiry.router.js";
import { ColorRouter } from "./router/color.router.js";
import { AreaRouter } from "./router/area.router.js";
import { ProjectAreaColorsRouter } from "./router/projectAreaColors.router.js";
import { LabourRouter } from "./router/labour.router.js";
import { LabourAttendanceRouter } from "./router/labourAttendance.router.js"; 
import cors from "cors";
import { AuthorizationRouter } from "./router/authorization.router.js";
import { authenticate, authorizePage } from "./middleware/authenticate.middleware.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());
const stream = {
    write: (message: string) => logger.info(message.trim())
};

const corsOptions = {
  origin: ['http://localhost:5173', 'http://localhost:5174', 'https://project-sheela-dash.lovable.app', "https://sheeladecorfrontend.netlify.app"],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200 
};

app.use(cors(corsOptions));
app.use(morgan(`:method :url :response-time ms`, { stream }));

app.get("/", (req: Request, res: Response) => {
    return res.status(200).json({
        status: "success",
        message: "Sahani Paints backend is awake."
    });
});


app.use("/v1/users", UserRouter);
app.use("/v1/auth", AuthRouter);

app.use(authenticate);

app.use("/v1/brands", authorizePage("brands"), BrandRouter);
app.use("/v1/products", authorizePage("products"), ProductRouter);
app.use("/v1/tasks", authorizePage("tasks"), TaskRouter);
app.use("/v1/projects", authorizePage("dashboard"), ProjectRouter);
app.use("/v1/customers", authorizePage("customers"), CustomerRouter);
app.use("/v1/inquiries", authorizePage("dashboard"), InquiryRouter);
app.use("/v1/authorizations", authorizePage("settings"), AuthorizationRouter);
app.use("/v1/colors", authorizePage("colors"), ColorRouter);
app.use("/v1/areas", authorizePage("site-colors"), AreaRouter);
app.use("/v1/project-area-colors", authorizePage("site-colors"), ProjectAreaColorsRouter);
app.use("/v1/labours", authorizePage("labours"), LabourRouter);
app.use("/v1/labour-attendance", authorizePage("labour-attendance"), LabourAttendanceRouter);

app.use(globalErrorHandler.handleError);

app.listen(config.port, "0.0.0.0", () => {
    console.log(`Sahani Paints backend listening on port : ${config.port}`);
});
