import type { interiors } from "../generated/prisma/index.js";

export interface InteriorData {
    name: string;
    email?: string;
    phonenumber?: string;
    alternatePhonenumber?: string;
    address?: string;
    commissionFeePercentage?: number;
}

export type Interior = interiors;
