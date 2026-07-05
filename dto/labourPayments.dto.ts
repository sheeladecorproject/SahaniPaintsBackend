interface LabourPayments {
    id: string;
    labourId: string;
    projectId?: string | null;
    amount: number | any;
    type: string;
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
    type?: string;
    paymentDate?: Date | string;
    remarks?: string | null;
}

export type { LabourPayments, LabourPaymentsData };
