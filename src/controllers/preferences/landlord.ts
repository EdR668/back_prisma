import { RequestHandler } from "express";
import createHttpError from "http-errors";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/** 
 * Obtiene una preferencia por su ID, incluyendo datos del arrendador (landlord)
 */
export const getLandlordPreferenceById: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const preference = await prisma.landlordPreference.findUnique({
      where: { id: Number(id) },
      include: {
        landlord: { select: { firstName: true, lastName: true } },
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
 * Obtiene todas las preferencias de un arrendador (landlord) dado su ID
 */
export const getLandlordPreferencesByLandlord: RequestHandler = async (req, res, next) => {
  try {
    const { landlordId } = req.params;
    const preferences = await prisma.landlordPreference.findMany({
      where: { landlordAuthID: landlordId },
      include: {
        landlord: { select: { firstName: true, lastName: true } },
      },
    });
    if (!preferences || preferences.length === 0) {
      throw createHttpError(404, `Preferences for landlord with ID ${landlordId} not found`);
    }
    res.status(200).json(preferences);
    return;
  } catch (error) {
    next(error);
  }
};

/** 
 * Crea una nueva preferencia para un arrendador
 */
export const createLandlordPreference: RequestHandler = async (req, res, next) => {
  try {
    const preferenceData = req.body;
    const newPreference = await prisma.landlordPreference.create({
      data: preferenceData,
    });
    res.status(201).json({
      message: "Preference created successfully",
      preference: newPreference,
    });
    return;
  } catch (error) {
    console.error(error);
    next(error);
  }
};

/** 
 * Actualiza una preferencia existente por su ID, incluyendo datos del arrendador
 */
export const updateLandlordPreference: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const updatedPreference = await prisma.landlordPreference.update({
      where: { id: Number(id) },
      data: updatedData,
      include: {
        landlord: { select: { firstName: true, lastName: true } },
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
 * Elimina una preferencia por su ID
 */
export const deleteLandlordPreference: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedPreference = await prisma.landlordPreference.delete({
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
