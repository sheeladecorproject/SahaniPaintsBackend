import type { Colors, ColorsData } from "../dto/colors.dto.js";
import type { ColorsRepository } from "../repository/colors.repository.js";
import { BaseService } from "./base.service.js";

class ColorService extends BaseService<Colors, ColorsData, ColorsRepository> {
    constructor(methods: ColorsRepository){
        super(methods, "COLOR");
    }
}

export { ColorService };
