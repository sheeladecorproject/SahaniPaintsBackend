interface Authorization {
    id: string;
    userId: string;
    access: string;
}

interface AuthorizationData {
    userId: string;
    access: string;
}

export type { Authorization, AuthorizationData };
