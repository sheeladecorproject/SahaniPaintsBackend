interface Customer {
    id: string;
    name: string;
    phonenumber: string | null;
    email: string | null;
    alternatePhonenumber: string | null;
    address: string | null;
    createdAt: Date;
}

interface CustomerData {
    name: string;
    phonenumber?: string | null;
    email?: string | null;
    alternatePhonenumber?: string | null;
    address?: string | null;
}

export type { Customer, CustomerData };
