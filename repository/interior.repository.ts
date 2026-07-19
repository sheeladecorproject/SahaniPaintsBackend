import { prisma } from "../db/prisma.js";
import type { Interior, InteriorData } from "../dto/interiors.dto.js";
import { BaseRepository } from "./base.repository.js";

class InteriorRepository extends BaseRepository<Interior, InteriorData, any> {
    constructor() {
        super(prisma.interiors, "INTERIOR");
    }
}

export { InteriorRepository };
