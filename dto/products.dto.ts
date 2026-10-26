interface Products {
    id: string;
    name: string;
    brandId: string;
    // category?: string | null; // Disabled - see Paints/SPEC_PRODUCT_CATEGORY.md
    price: number | any;
    coverageSqFt?: number | any;
    coverageRnFt?: number | any;
    hasToken?: boolean;
    size?: string;
    createdAt: Date;
    brand?: any;
}

interface ProductsData {
    name: string;
    brandId: string;
    // category?: string | null; // Disabled - see Paints/SPEC_PRODUCT_CATEGORY.md
    price: number;
    coverageSqFt?: number | any;
    coverageRnFt?: number | any;
    hasToken?: boolean;
    size?: string;
}

export type { Products, ProductsData };
