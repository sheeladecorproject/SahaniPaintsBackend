import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config } from "../config/index.js";
import { logger } from "./logger.util.js";
import { ServerError } from "./error.utils.js";
import { errorMessage } from "../constants/error.constants.js";
import type { Role } from "../generated/prisma/index.js";

class AuthUtilsClass {
    comparePasswords = async (password: string, hashedPassword: string) => {
        return bcrypt.compare(password, hashedPassword);
    }

    generateAccessToken = (id: string, role: string, access: string[]) => {
        return jwt.sign(
            { id, role, access },
            config.jwtSecret as string,
            { expiresIn: "7d" }
        );
    }

    generateForgetToken = (id: string) => {
        return jwt.sign({ id }, config.jwtSecret as string, { expiresIn: "15m" });
    }

    decodeForgetToken = (token: string) => {
        try {
            return jwt.verify(token, config.jwtSecret as string) as { id: string }
        } catch (err) {
            logger.warn("Invalid token provided", {
                token: token
            });
            throw new ServerError(errorMessage.INVALIDDATA);
        }
    }

    decodeAccesstoken = (token: string) => {
        try {
            const actualToken = token.startsWith("Bearer ") ? token.split(" ")[1] : token;
            return jwt.verify(actualToken as string, config.jwtSecret as string) as unknown as { id: string, role: Role, access: string[] };
        } catch (err: any) {
            logger.warn(`JWT Error: ${err.message}`, { token: token.substring(0, 15) });
            throw new ServerError(errorMessage.INVALIDDATA);
        }
    }

    hashPassword = async (password: string) => {
        return await bcrypt.hash(password, 10);
    }
}

export { AuthUtilsClass };
