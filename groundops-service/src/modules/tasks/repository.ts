import db from "@/db"
import { tasksTable } from "@/db/schema/tasks"




export const tasksRepository = { 
    async findAll() {  
        const tasks = await db.select().from(tasksTable);
        return tasks;
    },

    
    

    async createMany(data: typeof tasksTable.$inferInsert[]) {
        return db.insert(tasksTable).values(data).returning()
    }
}