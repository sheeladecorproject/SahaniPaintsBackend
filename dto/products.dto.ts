interface Products {
    id: string;
    name: string;
    brandId: string;
    category: string;
    price: number | any;
    coverageSqFt?: number | any;
    coverageRnFt?: number | any;
    hasToken?: boolean;
    createdAt: Date;
    brand?: any;
}

interface ProductsData {
    name: string;
    brandId: string;
    category: string;
    price: number;
    coverageSqFt?: number | any;
    coverageRnFt?: number | any;
    hasToken?: boolean;
}

export type { Products, ProductsData };
