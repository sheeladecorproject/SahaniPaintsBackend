import { AuthController } from "../controller/auth.controller.js";
import { AuthRepository } from "../repository/auth.repository.js";
import { AuthorizationRepository } from "../repository/authorization.repository.js";
import { UserRepository } from "../repository/user.repository.js";
import { AuthService } from "../service/auth.service.js";

class AuthFactory {
    static create () {
        const authMethods = new AuthRepository();
        const authorizationMethods = new AuthorizationRepository();
        const userMethods = new UserRepository();
        const service = new AuthService(authMethods, userMethods, authorizationMethods);
        const controller = new AuthController(service);

        return controller;
    }
}

export { AuthFactory };
