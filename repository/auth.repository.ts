import { errorMessage } from "../constants/error.constants.js";
import { prisma } from "../db/prisma.js";
import type { TokenData } from "../dto/token.dto.js";
import { ServerError } from "../utils/error.utils.js";
import { logger } from "../utils/logger.util.js";

class AuthRepository {
    create = async (data: TokenData) => {
        const token = await prisma.refreshTokens.create({
            data: {
                ...data,
                isUsed: false
            }
        });
        return token;
    }

    fetch = async (id: string) => {
        const token = await prisma.refreshTokens.findFirst({
            where: {
                id,
                isUsed: false
            }
        });
        return token;
    }

    update = async (isUsed: boolean, id: string) => {
        const token = await prisma.refreshTokens.update({
            where: {
                id,
                isUsed: false
            },
            data: {
                isUsed
            }
        });
        return token;
    }

    delete = async (id: string, flag: boolean) => {
        return await prisma.$transaction(async (tx) => {
            const token = await tx.refreshTokens.findFirst({
                where: {
                    id,
                    isUsed: false
                }
            });

            if(!token) {
                logger.warn("Invalid refresh token id");
                throw new ServerError(errorMessage.NOTFOUND);
            }

            await tx.refreshTokens.deleteMany({
                where: {
                    ...(flag ? { userId: token.userId } : { familyId: token.familyId })
                }
            });
        });
    }
}

export { AuthRepository };
