interface ProjectMaterialLog {
    id: string;
    date: Date;
    projectId: string;
    productId: string;
    quantity: number | any;
    createdAt: Date;
    project?: {
        name: string;
    };
    product?: {
        name: string;
        price: number;
    };
}

interface ProjectMaterialLogData {
    date: string;
    projectId: string;
    productId: string;
    quantity: number | any;
}

export type { ProjectMaterialLog, ProjectMaterialLogData };
