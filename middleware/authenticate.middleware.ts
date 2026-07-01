import type { NextFunction, Request, Response } from "express";
import { AuthRepository } from "../repository/auth.repository.js";
import { AuthService } from "../service/auth.service.js";
import { UserRepository } from "../repository/user.repository.js";
import { logger } from "../utils/logger.util.js";
import { ServerError } from "../utils/error.utils.js";
import { errorMessage } from "../constants/error.constants.js";
import { authUtils } from "../factory/utils.factory.js";
import { AuthorizationRepository } from "../repository/authorization.repository.js";

const repo = new AuthRepository();
const userRepo = new UserRepository();
const authorizationRepo = new AuthorizationRepository();
const service = new AuthService(repo, userRepo, authorizationRepo);

const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.cookies.refreshToken) {
        logger.warn("User unauthorized", { ip: req.ip });
        throw new ServerError(errorMessage.UNAUTHORIZED);
    }

    const tryRefresh = async () => {
        const { accessToken, refreshToken, access } = await service.generateCredentials(req.cookies.refreshToken);
        res.cookie("accessToken", accessToken, { sameSite: "strict", httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
        res.cookie("refreshToken", refreshToken.id, { sameSite: "strict", httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000 });
        req.cookies.accessToken = accessToken;
        req.cookies.refreshToken = refreshToken.id;
        req.user = { id: refreshToken.userId, role: refreshToken.role, access };
        logger.info("New user credentials generated", {
            ip: req.ip,
            userId: refreshToken.userId,
            role: refreshToken.role
        });
    };

    if (!req.cookies.accessToken) {
        logger.info("No access token found, creating new credentials", { ip: req.ip });
        await tryRefresh();
        return next();
    }

    try {
        const { id, role, access } = authUtils.decodeAccesstoken(req.cookies.accessToken);
        if (!id || !role || !access) {
            throw new ServerError(errorMessage.UNAUTHORIZED);
        }
        req.user = { id, role, access };
        return next();
    } catch (err) {
        logger.info("Access token decode failed, attempting token refresh", { ip: req.ip });
        try {
            await tryRefresh();
            return next();
        } catch (refreshErr) {
            res.clearCookie("accessToken");
            res.clearCookie("refreshToken");
            throw new ServerError(errorMessage.UNAUTHORIZED);
        }
    }
};

const authenticateAdmin = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.cookies.refreshToken) {
        logger.warn("User Unauthorized", { ip: req.ip });
        throw new ServerError(errorMessage.UNAUTHORIZED);
    }

    const tryRefreshAdmin = async () => {
        const { accessToken, refreshToken, access } = await service.generateCredentials(req.cookies.refreshToken);
        if (refreshToken.role !== "ADMIN") {
            logger.warn("User Unauthorized", {
                ip: req.ip,
                userId: refreshToken.userId,
                role: refreshToken.role
            });
            throw new ServerError(errorMessage.UNAUTHORIZED);
        }
        res.cookie("accessToken", accessToken, { sameSite: "strict", httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
        res.cookie("refreshToken", refreshToken.id, { sameSite: "strict", httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000 });
        req.cookies.accessToken = accessToken;
        req.cookies.refreshToken = refreshToken.id;
        req.user = { id: refreshToken.userId, role: refreshToken.role, access };
        logger.info("New admin credentials generated", {
            ip: req.ip,
            userId: refreshToken.userId,
            role: refreshToken.role
        });
    };

    if (!req.cookies.accessToken) {
        logger.info("No access token found, creating new credentials", { ip: req.ip });
        await tryRefreshAdmin();
        return next();
    }

    try {
        const { id, role, access } = authUtils.decodeAccesstoken(req.cookies.accessToken);
        if (role !== "ADMIN" || !access) {
            logger.warn("User Unauthorized", {
                ip: req.ip,
                userId: id,
                role
            });
            throw new ServerError(errorMessage.UNAUTHORIZED);
        }
        req.user = { id, role, access };
        return next();
    } catch (err) {
        logger.info("Admin access token decode failed, attempting token refresh", { ip: req.ip });
        try {
            await tryRefreshAdmin();
            return next();
        } catch (refreshErr) {
            res.clearCookie("accessToken");
            res.clearCookie("refreshToken");
            throw new ServerError(errorMessage.UNAUTHORIZED);
        }
    }
};

const authorizePage = (pageKeys: string | string[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        if (req.user?.role === "ADMIN") {
            return next();
        }

        const permissions = req.user?.access;
        if (!permissions) {
            throw new ServerError(errorMessage.UNAUTHORIZED);
        }

        const keys = Array.isArray(pageKeys) ? pageKeys : [pageKeys];
        
        const hasPermission = keys.some(key => permissions.includes(key));
        if (!hasPermission) {
            logger.warn("User access forbidden to endpoint", {
                userId: req.user?.id,
                requiredKeys: keys,
                url: req.originalUrl
            });
            throw new ServerError(errorMessage.UNAUTHORIZED);
        }

        return next();
    };
};

export { authenticate, authenticateAdmin, authorizePage, service as AuthService };
