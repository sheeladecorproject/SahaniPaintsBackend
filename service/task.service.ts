import type { Task, TaskData } from "../dto/tasks.dto.js";
import type { TaskRepository } from "../repository/task.repository.js";
import { BaseService } from "./base.service.js";

class TaskService extends BaseService<Task, TaskData, TaskRepository> {
    constructor(methods: TaskRepository){
        super(methods, "TASK");
    }
}

export { TaskService };
