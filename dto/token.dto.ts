type Role = "USER" | "ADMIN" | "INTERIOR" | "SALES_ASSOCIATE";

interface Token {
    id: string;
    familyId: string;
    userId: string;
    role: Role;
    isUsed: boolean;
}

interface TokenData {
    familyId: string;
    userId: string;
    role: Role;
}

const CookieOptions = {
    sameSite: "none" as const,
    secure: true,
    partitioned: true,
    httpOnly: true
};

export type { TokenData, Token, Role };
export { CookieOptions };
