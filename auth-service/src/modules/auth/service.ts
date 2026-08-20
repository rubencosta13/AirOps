import { Password } from "@/plugins/password";
import { SignInSchema, SignUpSchema } from "./schema";
import { authRepository } from "./repository";
import { ConflictError } from "@/shared/errors/app-error";
import UserCreatedPublisher from "./events/user-created";

export const authService = {
  async signin(data: SignInSchema) {
    // 1. check the user exists (
    //  1.1 validate email and hash input password to compare to the record on db
    //
    // )
    const passwordHelper = new Password();
    const providedHashedPassword = await passwordHelper.hash(data.password);
    const user = await authRepository.findUser(
      data.email,
      providedHashedPassword,
    );

    return user;
  },

  async createUser(data: SignUpSchema) {
    const existingUser = await authRepository.findUserByEmail(data.email);
    if (existingUser) throw new ConflictError("Error creating user");

    const passwordHelper = new Password();
    data.password = await passwordHelper.hash(data.password); // hashed pw

    const user = await authRepository.createUser(data);
    UserCreatedPublisher.publish(user);

    return user;
  },
};
