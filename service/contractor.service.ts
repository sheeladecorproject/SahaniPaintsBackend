import type { Contractor, ContractorData } from "../dto/contractor.dto.js";
import type { ContractorRepository } from "../repository/contractor.repository.js";
import { BaseService } from "./base.service.js";

class ContractorService extends BaseService<Contractor, ContractorData, ContractorRepository> {
    constructor(methods: ContractorRepository){
        super(methods, "CONTRACTOR");
    }
}

export { ContractorService };
