import { prisma } from "../db/prisma.js";
import type { User, UserData } from "../dto/user.dto.js";
import { BaseRepository } from "./base.repository.js";

class UserRepository extends BaseRepository<User, UserData, any> {
    constructor() {
        super(prisma.users, "USER");
    }

    create = async (data: UserData): Promise<any> => {
        const user = await prisma.users.create({
            data: data,
            select: {
                id: true,
                createdAt: true
            }
        });
        return user;
    }

    fetch = async (id?: string, username?: string, email?: string): Promise<User> => {
        const user = await prisma.users.findFirst({
            where: {
                ...(id ? { id } : {}),
                ...(username ? { username } : {}),
                ...(email ? { email } : {})
            },
            include: {
                auth: true
            }
        });
        return user ?? ({} as User);
    }
}

export { UserRepository };
