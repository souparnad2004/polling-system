import { AuthService } from "./modules/auth/auth.service.js";
import { PasswordService } from "./modules/auth/password.service.js";
import { SessionService } from "./modules/auth/session.service.js";
import { UserRepository } from "./modules/user/user.repository.js";
import { UserService } from "./modules/user/user.service.js";

export function createDependencies() {
  const passwordService = new PasswordService();
  const authService = new AuthService(passwordService);
  const sessionService = new SessionService();
  const userRepository = new UserRepository();
  const userService = new UserService(userRepository);

  return {
    authService,
    sessionService,
    userService,
  };
}

export const dependencies = createDependencies();