import type { Labours, LaboursData } from "../dto/labours.dto.js";
import type { LaboursRepository } from "../repository/labours.repository.js";
import { BaseService } from "./base.service.js";

class LabourService extends BaseService<Labours, LaboursData, LaboursRepository> {
    constructor(methods: LaboursRepository){
        super(methods, "LABOUR");
    }
}

export { LabourService };
