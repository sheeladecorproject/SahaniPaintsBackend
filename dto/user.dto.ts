type Role = "USER" | "ADMIN" | "INTERIOR" | "SALES_ASSOCIATE";

interface User {
    id: string;
    username: string;
    email: string;
    password: string;
    role: Role;
    createdAt: Date;
    phonenumber: string | null;
    alternatePhonenumber: string | null;
    address: string | null;
}

interface UserData {
    username: string;
    email: string;
    password: string;
    role: Role;
    phonenumber?: string | null;
    alternatePhonenumber?: string | null;
    address?: string | null;
}

export type { User, UserData };
