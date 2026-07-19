import type { Interior, InteriorData } from "../dto/interiors.dto.js";
import type { InteriorRepository } from "../repository/interior.repository.js";
import { BaseService } from "./base.service.js";

class InteriorService extends BaseService<Interior, InteriorData, InteriorRepository> {
    constructor(methods: InteriorRepository) {
        super(methods, "INTERIOR");
    }
}

export { InteriorService };
