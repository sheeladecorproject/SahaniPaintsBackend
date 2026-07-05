interface Contractor {
    id: string;
    name: string;
    phonenumber?: string | null;
    email?: string | null;
    address?: string | null;
    type: string;
    createdAt: Date;
}

interface ContractorData {
    name: string;
    phonenumber?: string | null;
    email?: string | null;
    address?: string | null;
    type?: string;
}

export type { Contractor, ContractorData };
