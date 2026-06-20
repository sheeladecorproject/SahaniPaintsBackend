interface Products {
    id: string;
    name: string;
    brandId: string;
    category: string;
    price: number | any;
    createdAt: Date;
    brand?: any;
}

interface ProductsData {
    name: string;
    brandId: string;
    category: string;
    price: number;
}

export type { Products, ProductsData };
