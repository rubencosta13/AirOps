export const TaskType =  {
    BAGGAGE_UNLOAD: "BAGGAGE_UNLOAD",
    CLEANING: "CLEANING",
    FUELING: "FUELING",
    CATERING: "CATERING",
    BOARDING: "BOARDING",
}

export const TaskStatus = {
    PENDING: "PENDING",
    IN_PROGRESS: "IN_PROGRESS",
    COMPLETED: "COMPLETED",
    CANCELLED: "CANCELLED",
} as const;

export type TaskStatus =
    typeof TaskStatus[keyof typeof TaskStatus];
export type TaskType =
    typeof TaskType[keyof typeof TaskType];

