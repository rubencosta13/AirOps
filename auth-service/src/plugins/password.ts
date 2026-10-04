import * as argon2 from "argon2";

type HashOptions = Parameters<typeof argon2.hash>[1];

class Password {
  constructor(private readonly options?: HashOptions) {}

  public async hash(password: string) {
    return await argon2.hash(password, this.options);
  }

  public async compare(hash: string, password: string) {
    return await argon2.verify(hash, password);
  }
}

export { Password };
