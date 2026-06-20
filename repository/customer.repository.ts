import { prisma } from "../db/prisma.js";
import type { Customer, CustomerData } from "../dto/customer.dto.js";
import { BaseRepository } from "./base.repository.js";

class CustomerRepository extends BaseRepository<Customer, CustomerData, any> {
    constructor() {
        super(prisma.customers, "CUSTOMER");
    }
}

export { CustomerRepository };
