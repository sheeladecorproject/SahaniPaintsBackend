interface ContractorPayment {
    id: string;
    contractorId: string;
    projectId?: string | null;
    amount: number | any;
    type: string;
    paymentMode?: string | null;
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
    paymentMode?: string | null;
    paymentDate: string;
    remarks?: string | null;
}

export type { ContractorPayment, ContractorPaymentData };
