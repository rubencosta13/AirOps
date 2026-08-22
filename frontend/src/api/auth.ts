import { api } from "./client";

export interface User {
  id: string;
  name: string;
  email: string;
  verifiedAt: string | null;
}

export function getCurrentUser() {
  return api<User>("/auth/me");
}
