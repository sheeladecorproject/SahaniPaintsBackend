import express, { type Request, type Response } from "express";
import { prisma } from "../db/prisma.js";
import { errorHandler } from "../factory/error.factory.js";

const router = express.Router();

// GET /v1/wastage-materials
router.get(
  "/",
  errorHandler.wrapper(async (req: Request, res: Response) => {
    const { projectId, search } = req.query as { projectId?: string; search?: string };

    const where: any = {
      material: {
        startsWith: "[WASTAGE]",
      },
    };

    if (projectId) {
      where.projectId = projectId;
    }

    const records = await prisma.low_materials.findMany({
      where,
      include: {
        project: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: [
        { date: "desc" },
        { createdAt: "desc" },
      ],
      take: 1000,
    });

    const parsed = records.map((r: any) => {
      // Format: [WASTAGE] {material} [Color: {color} | Shade: {shade}] (Remarks: {remarks})
      const raw = (r.material || "").replace(/^\[WASTAGE\]\s*/, "");
      let materialName = raw;
      let color = "—";
      let shade = "—";
      let remarks = "";

      const remarksMatch = raw.match(/\(Remarks:\s*([^)]+)\)$/i);
      let contentWithoutRemarks = raw;
      if (remarksMatch && remarksMatch[1]) {
        remarks = remarksMatch[1].trim();
        contentWithoutRemarks = raw.replace(/\s*\(Remarks:\s*[^)]+\)$/i, "").trim();
      }

      const match = contentWithoutRemarks.match(/^(.*?)(?:\s*\[(?:Color:\s*([^|\]]+?)\s*\|\s*)?Shade:\s*([^\]]+)\])?$/i);
      if (match && match[1]) {
        materialName = match[1].trim() || contentWithoutRemarks;
        color = (match[2] || "").trim() || "—";
        shade = (match[3] || "").trim() || "—";
      }

      return {
        id: r.id,
        projectId: r.projectId,
        projectName: r.project?.name || "—",
        project: r.project,
        material: materialName,
        color,
        shade,
        quantity: r.quantity,
        remarks,
        date: r.date,
        createdAt: r.createdAt,
      };
    });

    if (search && search.trim()) {
      const q = search.toLowerCase().trim();
      const filtered = parsed.filter(
        (item: any) =>
          item.projectName.toLowerCase().includes(q) ||
          item.material.toLowerCase().includes(q) ||
          item.color.toLowerCase().includes(q) ||
          item.shade.toLowerCase().includes(q) ||
          item.remarks.toLowerCase().includes(q)
      );
      return res.status(200).json(filtered);
    }

    return res.status(200).json(parsed);
  })
);

// POST /v1/wastage-materials
router.post(
  "/",
  errorHandler.wrapper(async (req: Request, res: Response) => {
    const { projectId, material, color, shade, quantity, date, remarks } = req.body;

    if (!projectId) {
      return res.status(400).json({ message: "Site / Project is required" });
    }
    if (!material || !material.trim()) {
      return res.status(400).json({ message: "Material name is required" });
    }
    if (!quantity || !String(quantity).trim()) {
      return res.status(400).json({ message: "Wastage quantity is required" });
    }

    const cleanMaterial = material.trim();
    const cleanColor = (color || "").trim() || "—";
    const cleanShade = (shade || "").trim() || "—";
    const cleanRemarks = (remarks || "").trim();

    const formattedMaterial = `[WASTAGE] ${cleanMaterial} [Color: ${cleanColor} | Shade: ${cleanShade}]${
      cleanRemarks ? ` (Remarks: ${cleanRemarks})` : ""
    }`;

    const record = await prisma.low_materials.create({
      data: {
        projectId,
        material: formattedMaterial,
        quantity: String(quantity).trim(),
        date: date ? new Date(date) : new Date(),
        approved: true,
        delivered: true,
      },
      include: {
        project: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return res.status(201).json({
      id: record.id,
      projectId: record.projectId,
      projectName: record.project?.name || "—",
      project: record.project,
      material: cleanMaterial,
      color: cleanColor,
      shade: cleanShade,
      quantity: record.quantity,
      remarks: cleanRemarks,
      date: record.date,
      createdAt: record.createdAt,
    });
  })
);

// DELETE /v1/wastage-materials/:id
router.delete(
  "/:id",
  errorHandler.wrapper(async (req: Request, res: Response) => {
    const id = String(req.params.id);
    await prisma.low_materials.delete({
      where: { id },
    });
    return res.status(200).json({ message: "Wastage record deleted successfully" });
  })
);

export { router as WastageMaterialsRouter };
