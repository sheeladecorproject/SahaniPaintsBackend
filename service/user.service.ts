import { sendMail } from "../config/mail.js";
import { errorMessage } from "../constants/error.constants.js";
import { resetPasswordTemplate } from "../dto/mail.dto.js";
import type { User, UserData } from "../dto/user.dto.js";
import { authUtils } from "../factory/utils.factory.js";
import type { UserRepository } from "../repository/user.repository.js";
import { ServerError } from "../utils/error.utils.js";
import { logger } from "../utils/logger.util.js";
import { BaseService } from "./base.service.js";
import { prisma } from "../db/prisma.js";

class UserService extends BaseService<User, UserData, UserRepository> {
    constructor(method: UserRepository) {
        super(method, "USER");
    }

    create = async (data: UserData) => {
        const hashedPassword = await authUtils.hashPassword(data.password);
        const user = await this.method.create({
            ...data,
            password: hashedPassword,
            role: data.role ? data.role : "USER"
        });

        // Set default access for Paints features (brands, interiors, sales-associate, tasks, settings, dashboard, inquiries)
        const defaultAccess = [
            "brands", "interiors", "sales-associate", "tasks", "settings", "dashboard", "customers"
        ];

        await (prisma.authorizations as any).createMany({
            data: defaultAccess.map(key => ({
                userId: user.id,
                access: key
            })),
            skipDuplicates: true
        });

        logger.info("User created with default master and customer page access", {
            userId: user.id
        });

        return user;
    }

    createMany = async (data: UserData[]) => {
        return await prisma.$transaction(async (tx) => {
            const results = [];
            let rowNum = 0;
            for (const item of data) {
                rowNum++;
                try {
                    const hashedPassword = await authUtils.hashPassword(item.password || "User@123");
                    const user = await tx.users.create({
                        data: {
                            ...item,
                            password: hashedPassword,
                            role: (item.role ? item.role : "USER") as any
                        }
                    });

                    const defaultAccess = [
                        "brands", "interiors", "sales-associate", "tasks", "settings", "dashboard", "customers"
                    ];

                    await tx.authorizations.createMany({
                        data: defaultAccess.map(key => ({
                            userId: user.id,
                            access: key
                        })),
                        skipDuplicates: true
                    });

                    results.push({ ...user, password: "" });
                } catch (itemError: any) {
                    if (itemError?.code === 'P2002') {
                        const target = Array.isArray(itemError.meta?.target)
                            ? itemError.meta.target.join(', ')
                            : (itemError.meta?.target || 'field');
                        throw new ServerError({
                            status: 409,
                            message: `Row ${rowNum}: Duplicate user found (${target} already exists)`
                        });
                    }
                    if (itemError instanceof ServerError) {
                        throw itemError;
                    }
                    throw new ServerError({
                        status: 400,
                        message: `Row ${rowNum}: ${itemError.message || 'Failed to create user'}`
                    });
                }
            }
            logger.info("USER records bulk created", { count: results.length });
            return results;
        }, { maxWait: 15000, timeout: 20000 });
    }

    fetch = async (id?: string, username?: string, email?: string) => {
        const user = await this.method.fetch(id, username, email);

        if(!user.id) {
            logger.warn("User not found", { id, username, email });
            throw new ServerError(errorMessage.NOTFOUND);
        }

        logger.info("User fetched" , {
            userId: user.id
        });

        return { ...user, password: "" };
    }

    forgetPass = async (id?: string, username?: string, email?: string) => {
        const user = await this.method.fetch(id, username, email);
        if(!user.id) {
            logger.warn("User not found", { email });
            throw new ServerError(errorMessage.NOTFOUND);
        }

        const token = authUtils.generateForgetToken(user.id);

        logger.info("Forget password token generated", {
            userId: user.id
        });

        await sendMail(user.email, "Sahani Paints - Change Password", resetPasswordTemplate(user.username, `http://localhost:5174/change-pass/${token}`));

        return;
    }

    changePass = async (token: string, password: string) => {
        const { id } = authUtils.decodeForgetToken(token);
        const hashedPassword = await authUtils.hashPassword(password);
        const user = await this.method.update({ password: hashedPassword }, id);

        logger.info("User password changed", {
            userId: id
        });

        return user;
    }
}

export { UserService };
