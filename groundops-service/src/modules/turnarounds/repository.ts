import { turnaroundsTable } from "@/db/schema/turnarounds";
import db from "@/db";
import { and, eq, isNull } from "drizzle-orm";
import { TurnaroundStatus } from "./enums";

export const turnaroundsRepository = {
  async findActiveByPlane(planeReg: string) {
    const [turnaround] = await db
      .select()
      .from(turnaroundsTable)
      .where(
        and(
          eq(turnaroundsTable.planeReg, planeReg),
          eq(turnaroundsTable.status, TurnaroundStatus.IN_PROGRESS),
          isNull(turnaroundsTable.deletedAt),
        ),
      );
    return turnaround;
  },

  async create(data: typeof turnaroundsTable.$inferInsert) {
    const [turnaround] = await db
      .insert(turnaroundsTable)
      .values(data)
      .returning();
    return turnaround;
  },

  async getById(id: string) {
    const [turnaround] = await db
      .select()
      .from(turnaroundsTable)
      .where(
        and(eq(turnaroundsTable.id, id), isNull(turnaroundsTable.deletedAt)),
      );
    return turnaround;
  },

  async findAll() {
    const turnarounds = await db
      .select()
      .from(turnaroundsTable)
      .where(
        and(
          isNull(turnaroundsTable.completedAt),
          isNull(turnaroundsTable.deletedAt),
        ),
      );
    return turnarounds;
  },

  async getByFlight(flightId: string) {
    const turnaround = await db
      .select()
      .from(turnaroundsTable)
      .where(
        and(
          eq(turnaroundsTable.arrivalId, flightId),
          isNull(turnaroundsTable.completedAt),
          isNull(turnaroundsTable.deletedAt),
        ),
      );
    return turnaround;
  },
};
