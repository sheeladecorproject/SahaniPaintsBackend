interface LabourPayments {
    id: string;
    labourId: string;
    projectId?: string | null;
    amount: number | any;
    paymentDate: Date;
    remarks?: string | null;
    createdAt: Date;
    labour?: any;
    project?: any;
}

interface LabourPaymentsData {
    labourId: string;
    projectId?: string | null;
    amount: number;
    paymentDate?: Date | string;
    remarks?: string | null;
}

export type { LabourPayments, LabourPaymentsData };
