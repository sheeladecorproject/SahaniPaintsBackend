import type { Request, Response } from "express";
import type { ReportService } from "../service/report.service.js";
import { ApiResponse } from "../utils/api.utils.js";

class ReportController {
    constructor(private ReportService: ReportService) {}

    private extractDateParams(req: Request) {
        return {
            ...(req.query.startDate && { startDate: req.query.startDate.toString() }),
            ...(req.query.endDate && { endDate: req.query.endDate.toString() }),
        };
    }

    fetchDashData = async (req: Request, res: Response) => {
        const data = await this.ReportService.fetchDashData(this.extractDateParams(req));
        return ApiResponse.success(res, "Dashboard statistics fetched successfully", data);
    };

    getCardDetails = async (req: Request, res: Response) => {
        const allowedTypes = ["running-projects", "total-value", "revenue-received", "revenue-due"];
        let cardType = req.query.cardType?.toString() || "running-projects";
        if (!allowedTypes.includes(cardType)) {
            cardType = "running-projects";
        }

        const data = await this.ReportService.getCardDetails({
            cardType,
            allTime: req.query.allTime === "true" || req.query.allTime === "1",
            ...this.extractDateParams(req),
        });
        return ApiResponse.success(res, "Card details fetched successfully", data);
    };

    getProjectsReport = async (req: Request, res: Response) => {
        const data = await this.ReportService.getProjectsReport(this.extractDateParams(req));
        return ApiResponse.success(res, "Projects report fetched successfully", data);
    };

    getPaymentsReport = async (req: Request, res: Response) => {
        const data = await this.ReportService.getPaymentsReport(this.extractDateParams(req));
        return ApiResponse.success(res, "Payments report fetched successfully", data);
    };

    getInteriorsReport = async (req: Request, res: Response) => {
        const data = await this.ReportService.getInteriorsReport(this.extractDateParams(req));
        return ApiResponse.success(res, "Interiors report fetched successfully", data);
    };

    getProductsReport = async (req: Request, res: Response) => {
        const data = await this.ReportService.getProductsReport(this.extractDateParams(req));
        return ApiResponse.success(res, "Products report fetched successfully", data);
    };
}

export { ReportController };
