import db from "@/db"
import { arrivalsTable } from "@/db/schema/arrivals"
import { eq, and } from "drizzle-orm";

export const arrivalsRepository = {
    async findAll() {
        return db.select().from(arrivalsTable);
    },

    async create(data: any) { 
       return db.insert(arrivalsTable).values(data).returning()
    },

    async findActiveByPlaneReg(planeReg: string) { 
        const result = db.select().from(arrivalsTable).where(and(
                eq(arrivalsTable.planeReg, planeReg),
                eq(arrivalsTable.arrived, false)
            ));
        return result;
    }
}