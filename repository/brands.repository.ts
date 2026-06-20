import { prisma } from "../db/prisma.js";
import type { Brands, BrandsData } from "../dto/brands.dto.js";
import { BaseRepository } from "./base.repository.js";

class BrandsRepository extends BaseRepository<Brands, BrandsData, any> {
    constructor() {
        super(prisma.brands, "BRAND");
    }
}

export { BrandsRepository };
