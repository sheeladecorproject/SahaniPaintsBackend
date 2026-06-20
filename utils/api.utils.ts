import type { Request, Response } from "express";

class ApiResponse {
    private constructor(
        public success: boolean,
        public message: string,
        public data: any = null
    ) {}

    static success (res: Response, message: string, data: any = null, status: number = 200) {
        return res.status(status).json(new ApiResponse(true, message, data));
    }

    static error (res: Response, message: string, status: number = 400 ) {
        return res.status(status).json(new ApiResponse(false, message));
    }
}

export { ApiResponse };
