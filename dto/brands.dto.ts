interface Brands {
    id: string;
    name: string;
    description: string | null;
    createdAt: Date;
}

interface BrandsData {
    name: string;
    description?: string;
}

export type { Brands, BrandsData };
