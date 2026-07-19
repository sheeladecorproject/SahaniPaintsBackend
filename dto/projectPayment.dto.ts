interface ProjectPayment {
    id: string;
    projectId: string;
    amount: number | any;
    type: string;
    paymentMode?: string | null;
    paymentDate: Date;
    remarks?: string | null;
    createdAt: Date;
    project?: {
        name: string;
    };
}

interface ProjectPaymentData {
    projectId: string;
    amount: number | any;
    type?: string;
    paymentMode?: string | null;
    paymentDate: string;
    remarks?: string | null;
}

export type { ProjectPayment, ProjectPaymentData };
