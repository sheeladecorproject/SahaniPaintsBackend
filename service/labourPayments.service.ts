import type { LabourPayments, LabourPaymentsData } from "../dto/labourPayments.dto.js";
import type { LabourPaymentsRepository } from "../repository/labourPayments.repository.js";
import { BaseService } from "./base.service.js";

class LabourPaymentsService extends BaseService<LabourPayments, LabourPaymentsData, LabourPaymentsRepository> {
    constructor(methods: LabourPaymentsRepository){
        super(methods, "LABOUR_PAYMENTS");
    }
}

export { LabourPaymentsService };
