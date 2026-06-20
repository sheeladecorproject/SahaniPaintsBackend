import { prisma } from "../db/prisma.js";
import type { Colors, ColorsData } from "../dto/colors.dto.js";
import { BaseRepository } from "./base.repository.js";

class ColorsRepository extends BaseRepository<Colors, ColorsData, any> {
    constructor() {
        // @ts-ignore
        super(prisma.colors, "COLOR");
    }
}

export { ColorsRepository };
