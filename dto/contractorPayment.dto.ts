interface ContractorPayment {
    id: string;
    contractorId: string;
    projectId?: string | null;
    amount: number | any;
    type: string;
    paymentDate: Date;
    remarks?: string | null;
    createdAt: Date;
    contractor?: {
        name: string;
    };
    project?: {
        name: string;
    };
}

interface ContractorPaymentData {
    contractorId: string;
    projectId?: string | null;
    amount: number | any;
    type?: string;
    paymentDate: string;
    remarks?: string | null;
}

export type { ContractorPayment, ContractorPaymentData };
