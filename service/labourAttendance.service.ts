import type { LabourAttendance, LabourAttendanceData } from "../dto/labourAttendance.dto.js";
import type { LabourAttendanceRepository } from "../repository/labourAttendance.repository.js";
import { BaseService } from "./base.service.js";

class LabourAttendanceService extends BaseService<LabourAttendance, LabourAttendanceData, LabourAttendanceRepository> {
    constructor(methods: LabourAttendanceRepository){
        super(methods, "LABOUR_ATTENDANCE");
    }
}

export { LabourAttendanceService };
