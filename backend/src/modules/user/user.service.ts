import type { UpdateUserProfileInput } from "./user.schema.js";
import { UserRepository } from "./user.repository.js";


export class UserService {
    constructor(private readonly userRepository: UserRepository) {}

    async getProfile(userId: string) {
        return this.userRepository.findById(userId);
    }

    async updateProfile(userId: string, input: UpdateUserProfileInput) {
        return this.userRepository.updateProfile(userId, input.displayName);
    }
}