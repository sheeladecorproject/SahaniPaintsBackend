import type { ProjectPayment, ProjectPaymentData } from "../dto/projectPayment.dto.js";
import type { ProjectPaymentRepository } from "../repository/projectPayment.repository.js";
import { BaseService } from "./base.service.js";

class ProjectPaymentService extends BaseService<ProjectPayment, ProjectPaymentData, ProjectPaymentRepository> {
    constructor(methods: ProjectPaymentRepository){
        super(methods, "PROJECT_PAYMENT");
    }
}

export { ProjectPaymentService };
