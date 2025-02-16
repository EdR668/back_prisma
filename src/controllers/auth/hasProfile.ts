import { RequestHandler } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const verifyProfile: RequestHandler = async (req, res, next) => {
  const { userId } = req.body;

  try {
    // Buscar en Tenant
    const tenant = await prisma.tenant.findUnique({
      where: { authID: userId },
    });

    if (tenant) {
      res.status(200).json({ hasProfile: true, role: "Tenant" });
      return;
    }

    // Buscar en Landlord
    const landlord = await prisma.landlord.findUnique({
      where: { authID: userId },
    });

    if (landlord) {
      res.status(200).json({ hasProfile: true, role: "Landlord" });
      return;
    }

    // Si no se encontró ningún perfil
    res.status(200).json({ hasProfile: false, role: null });
    return;
  } catch (error) {
    next(error);
  }
};


