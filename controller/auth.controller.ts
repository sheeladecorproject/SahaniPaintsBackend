import type { Request, Response } from "express";
import type { AuthService } from "../service/auth.service.js";
import { logger } from "../utils/logger.util.js";
import { ApiResponse } from "../utils/api.utils.js";
import { CookieOptions } from "../dto/token.dto.js";

class AuthController {
    constructor(private service: AuthService) {}

    login = async (req: Request, res: Response) => {
        logger.http("Login request received", {
            ip: req.ip
        });

        const { accessToken, refreshToken, id, role, access, username } = await this.service.login(req.body.username, req.body.password);

        res.cookie("accessToken", accessToken, { sameSite: "none", secure: true, partitioned: true, httpOnly: true, maxAge: 7*24*60*60*1000 });
        res.cookie("refreshToken", refreshToken, { sameSite: "none", secure: true, partitioned: true, httpOnly: true, maxAge: 30*24*60*60*1000 });

        return ApiResponse.success(res, "Logged in", {id, role, access, username});
    }

    logout = async (req: Request, res: Response) => {
        logger.http("Logout request received", {
            ip: req.ip
        });

        if (req.cookies.refreshToken) {
            await this.service.logout(req.cookies.refreshToken, req.params.flag?.toString() === "true" ? true : false);
        }

        res.clearCookie("accessToken", CookieOptions);
        res.clearCookie("refreshToken", CookieOptions);

        return ApiResponse.success(res, "Logged out");
    }

    fetchState = async (req: Request, res: Response) => {
        logger.http("Fetch state request received", {
            ip: req.ip
        });

        if (!req.cookies.accessToken) {
            return ApiResponse.error(res, "Unauthorized", 401);
        }

        const data = await this.service.fetchState(req.cookies.accessToken);
        return ApiResponse.success(res, "State fetched", data);
    }
}

export { AuthController };
