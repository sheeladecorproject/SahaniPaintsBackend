import type { Areas, AreasData } from "../dto/areas.dto.js";
import type { AreasRepository } from "../repository/areas.repository.js";
import { BaseService } from "./base.service.js";

class AreaService extends BaseService<Areas, AreasData, AreasRepository> {
    constructor(methods: AreasRepository){
        super(methods, "AREA");
    }
}

export { AreaService };
