import * as argon2 from "argon2";

class Password {
  private HASHER = argon2;
  public async hash(password: string) {
    return await this.HASHER.hash(password);
  }

  public async compare(db: string, input: string) {
    return await this.HASHER.verify(db, input);
  }
}

export { Password };
