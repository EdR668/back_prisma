import { RequestHandler } from "express";
import createHttpError from "http-errors";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/** 
 * Crea un registro de PropertyMedia usando los datos enviados en el body.
 */
export const createPropertyMedia: RequestHandler = async (req, res, next) => {
  try {
    const mediaData = req.body;
    // Se asume que mediaData tiene los campos necesarios, por ejemplo: 
    // { propertyFk, mediaType, mediaUrl, description, uploadDate }
    const newPropertyMedia = await prisma.propertyMedia.create({
      data: mediaData,
    });
    res.status(201).json(newPropertyMedia);
    return;
  } catch (error: any) {
    console.error(error);
    next(error);
  }
};

/** 
 * Actualiza un registro de PropertyMedia, identificado por su id (convertido a número).
 */
export const updatePropertyMedia: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    const updatedPropertyMedia = await prisma.propertyMedia.update({
      where: { id: Number(id) },
      data: updatedData,
    });
    res.status(200).json(updatedPropertyMedia);
    return;
  } catch (error: any) {
    if (error.code === "P2025") {
      return next(createHttpError(404, `Media with ID ${req.params.id} not found`));
    }
    next(error);
  }
};

/** 
 * Elimina un registro de PropertyMedia por su id.
 */
export const deletePropertyMedia: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.propertyMedia.delete({
      where: { id: Number(id) },
    });
    res.status(200).json("Property Media deleted successfully");
    return;
  } catch (error: any) {
    if (error.code === "P2025") {
      return next(createHttpError(404, `Media with ID ${req.params.id} not found`));
    }
    next(error);
  }
};

/** 
 * Muestra un registro de PropertyMedia por su id.
 */
export const showPropertyMedia: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const propertyMedia = await prisma.propertyMedia.findUnique({
      where: { id: Number(id) },
    });
    if (!propertyMedia) {
      throw createHttpError(404, `Media with ID ${id} not found`);
    }
    res.status(200).json(propertyMedia);
    return;
  } catch (error) {
    next(error);
  }
};

/** 
 * Muestra todos los registros de PropertyMedia.
 */
export const showPropertyMedias: RequestHandler = async (req, res, next) => {
  try {
    const propertyMedias = await prisma.propertyMedia.findMany();
    if (!propertyMedias || propertyMedias.length === 0) {
      throw createHttpError(404, "No property media found");
    }
    res.status(200).json(propertyMedias);
    return;
  } catch (error) {
    next(error);
  }
};
