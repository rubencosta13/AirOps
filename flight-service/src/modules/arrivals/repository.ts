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
    
    async update(id: string, data: any) {
        const result = await db.update(arrivalsTable).set(data).where(eq(arrivalsTable.id, id)).returning();
        return result 
    },

    async findById(id: string) {
        const result = await db.select().from(arrivalsTable).where(eq(arrivalsTable.id, id));
        return result;  
    },

    async findActiveByPlaneReg(planeReg: string) { 
        const result = await db.select().from(arrivalsTable).where(and(
                eq(arrivalsTable.planeReg, planeReg),
                eq(arrivalsTable.arrived, false)
            ));
        return result;
    }, 
    
    async delete(id: string) { 
        const deletedArrival = await db.delete(arrivalsTable).where(eq(arrivalsTable.id, id)).returning();
        return deletedArrival
    }
}