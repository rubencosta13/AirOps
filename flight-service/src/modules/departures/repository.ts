import db from "@/db";
import { departuresTable } from "@/db/schema/departures";
import { eq, and, isNull } from "drizzle-orm";
import { IdParams } from "./schemas";

export const departuresRepository = {
    async findAll() {
        return db.select().from(departuresTable);
    },

    async create(data: any) { 
        const departure = db.insert(departuresTable).values(data).returning();
        return departure
    },

    async findByPlane(planeReg: string) {
        const departures = await db.select().from(departuresTable).where(
            and(
                eq(departuresTable.departed, false),
                eq(departuresTable.planeReg, planeReg)
            )
        )
        return departures
    },

    async findActiveByPlaneReg(planeReg: string) { 
        const [departure] = await db.select().from(departuresTable).where(
            and(
                eq(departuresTable.planeReg, planeReg),
                    eq(departuresTable.departed, false),
                    isNull(departuresTable.deletedAt)
            )
        ).limit(1);
        return departure;
    },

    async findById(id: IdParams['id']) {
        const [departure] = await db.select().from(departuresTable).where(and(
            eq(departuresTable.id, id),
            eq(departuresTable.departed, false),
            isNull(departuresTable.deletedAt)
        ))
        return departure
    },

    async update(id: string, data: any) {
        const result = await db.update(departuresTable).set(data).where(
            and(
                eq(departuresTable.id, id),
                isNull(departuresTable.deletedAt)
            )
        ).returning();
        return result 
    },

    async delete(id: string) {
        const deletedDeparture = await db.update(departuresTable).set({
            deletedAt: new Date()
        }).where(
            and(
                eq(departuresTable.id, id),
                isNull(departuresTable.deletedAt)
            )
        );
        return deletedDeparture;
    }
}