import type { NextFunction, Request, Response } from "express";
import { logger } from "./logger.util.js";
import { ApiResponse } from "./api.utils.js";

class ErrorHandler {
    wrapper = (fn: any) => {
        return (req: Request, res: Response, next: NextFunction) => {
            Promise.resolve(fn(req, res, next)).catch(next);
        };
    }
}

class GlobalErrorHandler {
    handleError = (err: any, req: Request, res: Response, next: NextFunction) => {
        logger.error(err.message || "Unknown error", {
            status: err.status,
            ip: req.ip
        });

        if (err.status === 403) {
            res.clearCookie("accessToken");
            res.clearCookie("refreshToken");
        }

        const status = err.status ?? 500;
        return ApiResponse.error(res, err.message || "Internal Server Error", status);
    }
}

interface LogError {
    status: number;
    message: string;
}

class ServerError extends Error {
    public status: number;

    constructor(errorData: LogError) {
        super(errorData.message);
        this.status = errorData.status;
        this.message = errorData.message;

        Object.setPrototypeOf(this, new.target.prototype);
        Error.captureStackTrace(this);
    }
}

export { GlobalErrorHandler, ErrorHandler, ServerError };
