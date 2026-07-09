interface LabourAttendance {
    id: string;
    date: Date;
    projectId: string;
    labourId: string;
    workDayType: string;
    workDayValue: number | any;
    markedById?: string | null;
    createdAt: Date;
    markedBy?: { id: string; username: string } | null;
}

interface LabourAttendanceData {
    date: string;
    projectId: string;
    labourId: string;
    workDayType?: string;
    workDayValue?: number | any;
    markedById?: string | null;
}

export type { LabourAttendance, LabourAttendanceData };
