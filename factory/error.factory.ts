import { ErrorHandler, GlobalErrorHandler } from "../utils/error.utils.js";

const globalErrorHandler = new GlobalErrorHandler();
const errorHandler = new ErrorHandler();

export { globalErrorHandler, errorHandler };
