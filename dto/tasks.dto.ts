type Priority = "HIGH" | "MODERATE" | "LOW";
type Status = "TODO" | "INPROGRESS" | "COMPLETED";

interface Task {
    id: string;
    title: string;
    description: string | null;
    taskDate: Date;
    projectId: string;
    priority: Priority;
    status: Status;
    createdAt: Date;
    project: {
        id: string;
        name: string;
    };
}

interface TaskData {
    title: string;
    description?: string;
    taskDate: Date;
    projectId: string;
    priority: Priority;
    status: Status;
}

export type { Task, TaskData, Priority, Status };
