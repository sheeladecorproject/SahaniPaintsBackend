interface LowMaterial {
    id: string;
    projectId: string;
    material: string;
    quantity: string;
    approved: boolean;
    delivered: boolean;
    date: Date;
    createdAt: Date;
    project?: {
        id: string;
        name: string;
    };
}

interface LowMaterialData {
    projectId: string;
    material: string;
    quantity: string;
    approved?: boolean;
    delivered?: boolean;
    date?: Date | string;
}

export type { LowMaterial, LowMaterialData };
