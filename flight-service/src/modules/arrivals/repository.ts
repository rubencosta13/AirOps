import db from "@/db"
import { arrivalsTable } from "@/db/schema/arrivals"
import { eq, and, isNull } from "drizzle-orm";

export const arrivalsRepository = {
    async findAll() {
        return db.select().from(arrivalsTable).where(isNull(arrivalsTable.deletedAt));
    },

    async create(data: any) { 
       return db.insert(arrivalsTable).values(data).returning()
    },
    
    async update(id: string, data: any) {
        const result = await db.update(arrivalsTable).set(data).where(
            and(
                eq(arrivalsTable.id, id),
                isNull(arrivalsTable.deletedAt)
            )
        ).returning();
        return result 
    },

    async findById(id: string) {
        const result = await db.select().from(arrivalsTable)
            .where(
                and(
                    eq(arrivalsTable.id, id),
                    isNull(arrivalsTable.deletedAt)
                )
            );
        return result;  
    },

    async findActiveByPlaneReg(planeReg: string) { 
        const result = await db.select().from(arrivalsTable).where(
            and(
                eq(arrivalsTable.planeReg, planeReg),
                eq(arrivalsTable.arrived, false),
                isNull(arrivalsTable.deletedAt)
            )
        );
        return result[0];
    }, 

    async delete(id: string) { 
        const deletedArrival = await db.update(arrivalsTable).set({ 
            deletedAt: new Date()
        }).where(
            and(
                eq(arrivalsTable.id, id),
                isNull(arrivalsTable.deletedAt)
            )
        
        ).returning();
        return deletedArrival
    }
}