import type { ContractorWorkLog, ContractorWorkLogData } from "../dto/contractorWorkLog.dto.js";
import type { ContractorWorkLogRepository } from "../repository/contractorWorkLog.repository.js";
import { BaseService } from "./base.service.js";

class ContractorWorkLogService extends BaseService<ContractorWorkLog, ContractorWorkLogData, ContractorWorkLogRepository> {
    constructor(methods: ContractorWorkLogRepository){
        super(methods, "CONTRACTOR_WORK_LOG");
    }
}

export { ContractorWorkLogService };
