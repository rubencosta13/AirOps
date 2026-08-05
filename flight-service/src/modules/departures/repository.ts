import db from "@/db";
import { departuresTable } from "@/db/schema/departures";
import { eq, and } from "drizzle-orm";

export const departuresRepository = {
    async findAll() {
        return db.select().from(departuresTable);
    },

    async create(data: any) { 

        try { 
            const departure = db.insert(departuresTable).values(data).returning();
            return departure
        } catch (err) {
            console.error(err)
        }
    },

    async findByPlane(data: any) {
        return db.select().from(departuresTable).where(and(eq(departuresTable.departed, false), eq(departuresTable.planeReg, data.planeReg)))
    }
}