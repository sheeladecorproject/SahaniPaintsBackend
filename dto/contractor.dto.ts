interface Contractor {
    id: string;
    name: string;
    phonenumber?: string | null;
    email?: string | null;
    address?: string | null;
    type: string;
    pricePerSqFt?: number | any | null;
    createdAt: Date;
}

interface ContractorData {
    name: string;
    phonenumber?: string | null;
    email?: string | null;
    address?: string | null;
    type?: string;
    pricePerSqFt?: number | any | null;
}

export type { Contractor, ContractorData };
