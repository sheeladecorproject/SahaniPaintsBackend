import type { Request, Response, NextFunction } from "express";
import { prisma } from "../db/prisma.js";

// Cache usernames in memory to avoid repeated DB lookups
const userCache = new Map<string, { username: string; role: string }>();

function deriveEntityAndDetails(req: Request): { action: string; entity: string; details: string } {
    const method = req.method.toUpperCase();
    const url = req.originalUrl || req.url || "";
    const cleanUrl = url.split("?")[0] || "";
    const parts = cleanUrl.split("/").filter(Boolean);

    // e.g. /api/v1/projects => entity: "Projects"
    let rawEntity = parts[parts.length - 1] || "System";
    if (parts.length > 2 && !isNaN(Number(rawEntity)) || rawEntity.length > 30) {
        rawEntity = parts[parts.length - 2] || "System";
    }

    const entityNames: Record<string, string> = {
        "projects": "Project",
        "labour-attendance": "Labour Attendance",
        "labour-payments": "Labour Payment",
        "contractor-payments": "Contractor Payment",
        "contractor-work-logs": "Contractor Work Log",
        "project-payments": "Project Payment",
        "project-material-logs": "Material Log",
        "low-materials": "Material Request",
        "labours": "Labour Master",
        "contractors": "Contractor Master",
        "products": "Product Master",
        "brands": "Brand Master",
        "colors": "Color Master",
        "areas": "Area Master",
        "users": "User Account",
        "inquiries": "Inquiry",
        "tasks": "Task",
        "stores": "Store Master",
    };

    const entity = entityNames[rawEntity.toLowerCase()] || rawEntity.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase());

    let action = "UPDATE";
    if (method === "POST") action = "CREATE";
    if (method === "DELETE") action = "DELETE";

    let details = `${action} performed on ${entity}`;
    if (req.body && typeof req.body === "object") {
        if (req.body.name) details = `${action} ${entity}: "${req.body.name}"`;
        else if (req.body.title) details = `${action} ${entity}: "${req.body.title}"`;
        else if (Array.isArray(req.body)) details = `${action} ${req.body.length} ${entity} records`;
        else if (req.body.amount) details = `${action} ${entity} of ₹${req.body.amount}`;
        else if (req.body.remarks) details = `${action} ${entity} (${req.body.remarks})`;
    }

    return { action, entity, details };
}

export const activityLogger = async (req: Request, res: Response, next: NextFunction) => {
    // Only capture modifying methods
    if (!["POST", "PUT", "PATCH", "DELETE"].includes(req.method.toUpperCase())) {
        return next();
    }

    // Skip internal activity logs endpoint itself
    if (req.originalUrl.includes("/activity-logs")) {
        return next();
    }

    const originalSend = res.send;

    res.send = function (body?: any): Response {
        res.send = originalSend;
        const result = res.send(body);

        // Only log successful operations (2xx)
        if (res.statusCode >= 200 && res.statusCode < 300 && req.user?.id) {
            process.nextTick(async () => {
                try {
                    const userId = req.user!.id;
                    let userInfo = userCache.get(userId);

                    if (!userInfo) {
                        const dbUser = await prisma.users.findUnique({
                            where: { id: userId },
                            select: { username: true, role: true }
                        });
                        if (dbUser) {
                            userInfo = { username: dbUser.username, role: dbUser.role };
                            userCache.set(userId, userInfo);
                        }
                    }

                    const { action, entity, details } = deriveEntityAndDetails(req);

                    await (prisma as any).activity_logs.create({
                        data: {
                            userId,
                            userName: userInfo?.username || "User",
                            userRole: userInfo?.role || req.user?.role || "USER",
                            action,
                            entity,
                            details,
                            ipAddress: req.ip || null,
                        }
                    });
                } catch (err) {
                    console.error("Activity logging middleware error:", err);
                }
            });
        }

        return result;
    };

    next();
};
