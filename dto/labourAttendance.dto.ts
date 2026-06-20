interface LabourAttendance {
    id: string;
    date: Date;
    projectId: string;
    labourId: string;
    createdAt: Date;
}

interface LabourAttendanceData {
    date: string;
    projectId: string;
    labourId: string;
}

export type { LabourAttendance, LabourAttendanceData };
