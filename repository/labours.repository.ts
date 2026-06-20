import { prisma } from "../db/prisma.js";
import type { Labours, LaboursData } from "../dto/labours.dto.js";
import { BaseRepository } from "./base.repository.js";

class LaboursRepository extends BaseRepository<Labours, LaboursData, any> {
    constructor() {
        // @ts-ignore
        super(prisma.labours, "LABOUR");
    }
}

export { LaboursRepository };
