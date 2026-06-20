import type { Inquiry, InquiryData } from "../dto/inquiry.dto.js";
import type { InquiryRepository } from "../repository/inquiry.repository.js";
import { BaseService } from "./base.service.js";

class InquiryService extends BaseService<Inquiry, InquiryData, InquiryRepository> {
    constructor(methods: InquiryRepository){
        super(methods, "INQUIRY");
    }
}

export { InquiryService };
