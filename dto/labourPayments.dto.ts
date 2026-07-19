interface LabourPayments {
    id: string;
    labourId: string;
    projectId?: string | null;
    amount: number | any;
    type: string;
    paymentMode?: string | null;
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
    paymentMode?: string | null;
    paymentDate?: Date | string;
    remarks?: string | null;
}

export type { LabourPayments, LabourPaymentsData };
