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
                    isNull(turnaroundsTable.deletedAt)
                )
            )
        console.log(turnaround)
        return turnaround
    },

    async create(data: typeof turnaroundsTable.$inferInsert) {
        const [turnaround] = await db.insert(turnaroundsTable).values(data).returning();
        console.log(turnaround)
        return turnaround;
    },



}