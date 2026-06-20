interface Areas {
    id: string;
    name: string;
    projectId: string;
    createdAt: Date;
}

interface AreasData {
    name: string;
    projectId: string;
}

export type { Areas, AreasData };
