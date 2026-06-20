import type { AuthorizationRepository } from "../repository/authorization.repository.js";
import { BaseService } from "./base.service.js";

class AuthorizationService extends BaseService<any, any, any> {
    constructor(methods: AuthorizationRepository) {
        super(methods, "AUTHORIZATION");
    }
}

export { AuthorizationService };
