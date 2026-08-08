type ProjectStatus = "PENDING" | "ACTIVE" | "GOODS_PENDING" | "GOODS_COMPLETE" | "TAILOR_PENDING" | "TAILOR_COMPLETE" | "COMPLETED" | "DEFAULTER";

interface Project {
    id: string;
    name: string;
    customerId: string | null;
    interiorId?: string | null;
    totalAmount: number | null;
    paid: number | null;
    discount: number | null;
    discountType: string | null;
    tax: number | null;
    agreedPrice: number | null;
    projectDate: Date;
    status: ProjectStatus;
    stage: string;
    createdAt: Date;
    creatorId: string;
    customer?: {
        name: string;
    } | null;
    interior?: {
        id: string;
        name: string;
        commissionFeePercentage?: number;
    } | null;
    creator: {
        username: string;
    };
    supervisorId?: string | null;
    supervisor?: {
        id: string;
        username: string;
        email?: string;
        phonenumber?: string | null;
    } | null;
    projectProducts?: any[];
}

interface ProjectData {
    name: string;
    customerId?: string | null;
    interiorId?: string | null;
    supervisorId?: string | null;
    totalAmount?: number | null;
    paid?: number | null;
    discount?: number | null;
    discountType?: string | null;
    tax?: number | null;
    agreedPrice?: number | null;
    projectDate: Date;
    status: ProjectStatus;
    stage?: string;
    creatorId: string;
    projectProducts?: any[];
}

export type { Project, ProjectData, ProjectStatus };
