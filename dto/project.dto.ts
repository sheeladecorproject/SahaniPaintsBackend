type ProjectStatus = "PENDING" | "ACTIVE" | "GOODS_PENDING" | "GOODS_COMPLETE" | "TAILOR_PENDING" | "TAILOR_COMPLETE" | "COMPLETED" | "DEFAULTER";

interface Project {
    id: string;
    name: string;
    customerId: string | null;
    totalAmount: number | null;
    paid: number | null;
    discount: number | null;
    discountType: string | null;
    tax: number | null;
    agreedPrice: number | null;
    projectDate: Date;
    status: ProjectStatus;
    createdAt: Date;
    creatorId: string;
    customer?: {
        name: string;
    } | null;
    creator: {
        username: string;
    };
    projectProducts?: any[];
}

interface ProjectData {
    name: string;
    customerId?: string | null;
    totalAmount?: number | null;
    paid?: number | null;
    discount?: number | null;
    discountType?: string | null;
    tax?: number | null;
    agreedPrice?: number | null;
    projectDate: Date;
    status: ProjectStatus;
    creatorId: string;
    projectProducts?: any[];
}

export type { Project, ProjectData, ProjectStatus };
