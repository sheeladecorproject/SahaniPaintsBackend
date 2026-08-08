import type { LowMaterial, LowMaterialData } from "../dto/lowMaterials.dto.js";
import type { LowMaterialsRepository } from "../repository/lowMaterials.repository.js";
import { BaseService } from "./base.service.js";

class LowMaterialsService extends BaseService<LowMaterial, LowMaterialData, LowMaterialsRepository> {
    constructor(methods: LowMaterialsRepository){
        super(methods, "LOW_MATERIALS");
    }
}

export { LowMaterialsService };
