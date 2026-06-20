interface Labours {
    id: string;
    name: string;
    paymentPerDay: number;
    phonenumber: string | null;
    createdAt: Date;
}

interface LaboursData {
    name: string;
    paymentPerDay: number;
    phonenumber?: string;
}

export type { Labours, LaboursData };
