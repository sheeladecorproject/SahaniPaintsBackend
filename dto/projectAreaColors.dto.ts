interface ProjectAreaColors {
    id: string;
    projectId: string;
    areaId: string;
    colorId: string;
    createdAt: Date;
}

interface ProjectAreaColorsData {
    projectId: string;
    areaId: string;
    colorId: string;
}

export type { ProjectAreaColors, ProjectAreaColorsData };
