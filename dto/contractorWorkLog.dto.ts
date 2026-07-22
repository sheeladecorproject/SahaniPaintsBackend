interface ContractorWorkLog {
    id: string;
    date: Date;
    projectId: string;
    contractorId: string;
    sqFt: number | any;
    remarks?: string | null;
    createdAt: Date;
    project?: {
        name: string;
    };
    contractor?: {
        name: string;
        pricePerSqFt: number | any;
    };
}

interface ContractorWorkLogData {
    date: string;
    projectId: string;
    contractorId: string;
    sqFt: number | any;
    remarks?: string | null;
}

export type { ContractorWorkLog, ContractorWorkLogData };
