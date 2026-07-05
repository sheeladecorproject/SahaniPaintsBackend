interface ProjectPayment {
    id: string;
    projectId: string;
    amount: number | any;
    type: string;
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
    paymentDate: string;
    remarks?: string | null;
}

export type { ProjectPayment, ProjectPaymentData };
