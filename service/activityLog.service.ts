import { ActivityLogRepository, type ActivityLogFilter, type ActivityLogInput } from "../repository/activityLog.repository.js";
import { BaseService } from "./base.service.js";

class ActivityLogService extends BaseService<any, any, ActivityLogRepository> {
    constructor(method: ActivityLogRepository) {
        super(method, "ACTIVITY_LOG");
    }

    logActivity = async (input: ActivityLogInput) => {
        return await this.method.createLog(input);
    };

    getActivityLogs = async (filters: ActivityLogFilter) => {
        return await this.method.fetchLogs(filters);
    };
}

export { ActivityLogService };
