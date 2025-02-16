import { RequestHandler } from "express";
import createHttpError from "http-errors";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/** 
 * Obtiene una preferencia de inquilino por su ID, incluyendo datos del tenant (firstName, lastName, email)
 */
export const getTenantPreferenceById: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const preference = await prisma.tenantPreference.findUnique({
      where: { id: Number(id) },
      include: {
        tenant: { select: { firstName: true, lastName: true, email: true } },
      },
    });
    if (!preference) {
      throw createHttpError(404, `Preference with ID ${id} not found`);
    }
    res.status(200).json(preference);
    return;
  } catch (error) {
    next(error);
  }
};

/** 
 * Obtiene todas las preferencias de un inquilino dado su tenantAuthID
 */
export const getTenantPreferencesByTenant: RequestHandler = async (req, res, next) => {
  try {
    const { tenantId } = req.params;
    const preferences = await prisma.tenantPreference.findMany({
      where: { tenantAuthID: tenantId },
      include: {
        tenant: { select: { firstName: true, lastName: true, email: true } },
      },
    });
    if (!preferences || preferences.length === 0) {
      throw createHttpError(404, `Preferences for tenant with ID ${tenantId} not found`);
    }
    res.status(200).json(preferences);
    return;
  } catch (error) {
    next(error);
  }
};

/** 
 * Crea una nueva preferencia para un inquilino
 */
export const createTenantPreference: RequestHandler = async (req, res, next) => {
  try {
    const preferenceData = req.body;
    const newPreference = await prisma.tenantPreference.create({
      data: preferenceData,
    });
    res.status(201).json({
      message: "Preference created successfully",
      preference: newPreference,
    });
    return;
  } catch (error) {
    next(error);
  }
};

/** 
 * Actualiza una preferencia de inquilino por su ID, incluyendo datos del tenant
 */
export const updateTenantPreference: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const updatedPreference = await prisma.tenantPreference.update({
      where: { id: Number(id) },
      data: updatedData,
      include: {
        tenant: { select: { firstName: true, lastName: true, email: true } },
      },
    });
    res.status(200).json({
      message: "Preference updated successfully",
      preference: updatedPreference,
    });
    return;
  } catch (error: any) {
    if (error.code === "P2025") {
      return next(createHttpError(404, `Preference with ID ${req.params.id} not found`));
    }
    next(error);
  }
};

/** 
 * Elimina una preferencia de inquilino por su ID
 */
export const deleteTenantPreference: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedPreference = await prisma.tenantPreference.delete({
      where: { id: Number(id) },
    });
    if (!deletedPreference) {
      throw createHttpError(404, `Preference with ID ${id} not found`);
    }
    res.status(200).json({ message: "Preference deleted successfully" });
    return;
  } catch (error: any) {
    if (error.code === "P2025") {
      return next(createHttpError(404, `Preference with ID ${req.params.id} not found`));
    }
    next(error);
  }
};
