interface LabourAttendance {
    id: string;
    date: Date;
    projectId: string;
    labourId: string;
    workDayType: string;
    workDayValue: number | any;
    createdAt: Date;
}

interface LabourAttendanceData {
    date: string;
    projectId: string;
    labourId: string;
    workDayType?: string;
    workDayValue?: number | any;
}

export type { LabourAttendance, LabourAttendanceData };
