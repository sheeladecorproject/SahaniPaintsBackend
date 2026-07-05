import { prisma } from "../db/prisma.js";
import type { Contractor, ContractorData } from "../dto/contractor.dto.js";
import { BaseRepository } from "./base.repository.js";

class ContractorRepository extends BaseRepository<Contractor, ContractorData, any> {
    constructor() {
        // @ts-ignore
        super(prisma.contractors, "CONTRACTOR");
    }
}

export { ContractorRepository };
