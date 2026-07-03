interface ProjectAreaColors {
    id: string;
    projectId: string;
    areaId: string;
    colorId: string;
    description?: string | null;
    createdAt: Date;
}

interface ProjectAreaColorsData {
    projectId: string;
    areaId: string;
    colorId: string;
    description?: string | null;
}

export type { ProjectAreaColors, ProjectAreaColorsData };
