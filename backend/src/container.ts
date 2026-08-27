import { AuthRepository } from "./modules/auth/auth.repository.js";
import { AuthService } from "./modules/auth/auth.service.js";
import { PasswordService } from "./modules/auth/password.service.js";
import { SessionRepository } from "./modules/auth/session.repository.js";
import { SessionService } from "./modules/auth/session.service.js";
import { PollRepository } from "./modules/poll/poll.repository.js";
import { PollService } from "./modules/poll/poll.service.js";
import { UserRepository } from "./modules/user/user.repository.js";
import { UserService } from "./modules/user/user.service.js";
import { VoteRepository } from "./modules/vote/vote.repository.js";
import { VoteService } from "./modules/vote/vote.service.js";

export function createDependencies() {
  const passwordService = new PasswordService();
  const authRepository = new AuthRepository();
  const authService = new AuthService(passwordService, authRepository);
  const sessionRepository = new SessionRepository();
  const sessionService = new SessionService(sessionRepository);
  const userRepository = new UserRepository();
  const userService = new UserService(userRepository);
  const pollRepository = new PollRepository();
  const pollService = new PollService(pollRepository);
  const voteRepository = new VoteRepository();
  const voteService = new VoteService(pollRepository, voteRepository);

  return {
    authService,
    sessionService,
    userService,
    pollService,
    voteService
  };
}

export const dependencies = createDependencies();