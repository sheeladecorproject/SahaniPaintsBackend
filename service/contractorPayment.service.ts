import type { ContractorPayment, ContractorPaymentData } from "../dto/contractorPayment.dto.js";
import type { ContractorPaymentRepository } from "../repository/contractorPayment.repository.js";
import { BaseService } from "./base.service.js";

class ContractorPaymentService extends BaseService<ContractorPayment, ContractorPaymentData, ContractorPaymentRepository> {
    constructor(methods: ContractorPaymentRepository){
        super(methods, "CONTRACTOR_PAYMENT");
    }
}

export { ContractorPaymentService };
