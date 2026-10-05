import { randomBytes } from "node:crypto";
import { vi } from "vitest";

process.env.JWT_SECRET = randomBytes(32).toString("hex");
process.env.FRONTEND_URL = "https://test.com";
process.env.SESSION_SECRET = randomBytes(32).toString("base64");

const mockDb = vi.hoisted(() => ({
  select: vi.fn().mockReturnThis(),
  from: vi.fn().mockReturnThis(),
  where: vi.fn().mockResolvedValue([]),
  insert: vi.fn().mockReturnThis(),
  values: vi.fn().mockReturnThis(),
  returning: vi.fn().mockResolvedValue([]),
  update: vi.fn().mockReturnThis(),
  set: vi.fn().mockReturnThis(),
  delete: vi.fn().mockReturnThis(),
  query: {
    users: {
      findFirst: vi.fn(),
      findMany: vi.fn(),
    },
  },
}));

vi.mock("@/db", () => ({
  default: mockDb,
}));
