import { prisma } from "../db/prisma.js";
import type { Inquiry, InquiryData } from "../dto/inquiry.dto.js";
import { BaseRepository } from "./base.repository.js";

class InquiryRepository extends BaseRepository<Inquiry, InquiryData, any> {
    constructor() {
        super(prisma.inquiries, "INQUIRY");
    }
}

export { InquiryRepository };
