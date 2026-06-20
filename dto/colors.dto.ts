interface Colors {
    id: string;
    name: string;
    shade: string;
    createdAt: Date;
}

interface ColorsData {
    name: string;
    shade: string;
}

export type { Colors, ColorsData };
