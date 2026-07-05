interface Labours {
    id: string;
    name: string;
    paymentPerDay: number;
    phonenumber: string | null;
    type: string;
    createdAt: Date;
}

interface LaboursData {
    name: string;
    paymentPerDay: number;
    phonenumber?: string;
    type?: string;
}

export type { Labours, LaboursData };
