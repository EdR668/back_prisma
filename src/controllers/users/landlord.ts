import { RequestHandler } from "express";
import createHttpError from "http-errors";
import { PrismaClient } from "@prisma/client";
import { uploadFileS3 } from "../../utils/S3"; // Asegúrate de importar correctamente la función de subida

const prisma = new PrismaClient();

export const createLandlord: RequestHandler = async (req, res, next) => {
  try {
    const { id, firstName, lastName, phone, email, avgRating, authID, gender } = req.body;
    const avatarFile = req.files?.files; // La imagen enviada en el campo `files`

    // Verificar si el landlord ya existe
    const existingLandlord = await prisma.landlord.findUnique({ where: { authID } });
    if (existingLandlord) {
      res.status(409).json({ message: "ID Already Taken" });
      return; // Sin retornar un valor
    }

    let avatarUrl = "";
    if (avatarFile) {
      avatarUrl = await uploadFileS3(avatarFile);
    }

    const newLandlord = await prisma.landlord.create({
      data: {
        id, // campo adicional
        firstName,
        lastName,
        phone,
        email,
        avgRating: avgRating ?? 0,
        authID,
        gender,
        avatar: avatarUrl,
      },
    });

    res.status(201).json(newLandlord);
    return; // Finaliza sin retornar un Response
  } catch (error: any) {
    if (error.code === "P2002") {
      res.status(409).json({
        message: "Duplicate key error",
        error: error.meta.target,
      });
      return;
    }
    console.error(error);
    next(error);
  }
};

export const updateLandlord: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params; // authID del landlord
    const { firstName, lastName, phone, email, numberOfProperties, avgRating, fulfillmentPercentage } = req.body;
    const avatarFile = req.files?.file; // La imagen enviada en el campo `file`

    let avatarUrl: string | undefined;
    if (avatarFile) {
      avatarUrl = await uploadFileS3(avatarFile);
    }

    const updatedLandlord = await prisma.landlord.update({
      where: { authID: id },
      data: {
        firstName,
        lastName,
        phone,
        email,
        avgRating,
        ...(avatarUrl && { avatar: avatarUrl }),
        updatedAt: new Date(),
      },
    });

    res.status(200).json(updatedLandlord);
  } catch (error: any) {
    if (error.code === "P2025") {
      return next(createHttpError(404, `Landlord with ID ${req.params.id} not found`));
    }
    next(error);
  }
};

export const deleteLandlord: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params; // authID
    const deletedLandlord = await prisma.landlord.delete({
      where: { authID: id },
    });
    res.status(200).json({ message: "Landlord successfully deleted", deletedLandlord });
  } catch (error: any) {
    if (error.code === "P2025") {
      return next(createHttpError(404, `Landlord with ID ${req.params.id} not found`));
    }
    next(error);
  }
};

export const showLandlord: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params; // authID
    const landlord = await prisma.landlord.findUnique({ where: { authID: id } });
    if (!landlord) {
      return next(createHttpError(404, `Landlord with ID ${id} not found`));
    }
    res.status(200).json(landlord);
  } catch (error) {
    next(error);
  }
};

export const showLandlords: RequestHandler = async (req, res, next) => {
  try {
    const landlords = await prisma.landlord.findMany();
    if (!landlords || landlords.length === 0) {
      return next(createHttpError(404, "No landlords found"));
    }
    res.status(200).json(landlords);
  } catch (error) {
    next(error);
  }
};

/**
 * getActiveTenantsByLandlord: Encuentra los tenants activos (contratos con fecha actual)
 * asociados a las propiedades de un landlord.
 * 
 * Estrategia:
 * 1. Buscar el landlord por authID incluyendo sus propiedades.
 * 2. Para cada propiedad, buscar contratos activos (startDate <= now <= endDate) e incluir el tenant.
 * 3. Combinar la información (por ejemplo, monthlyRent y address) en la respuesta.
 */
export const getActiveTenantsByLandlord: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params; // authID del landlord
    const now = new Date();

    // Buscar el landlord junto con sus propiedades
    const landlord = await prisma.landlord.findUnique({
      where: { authID: id },
      include: {
        Property: {
          include: {
            Contract: {
              where: {
                startDate: { lte: now },
                endDate: { gte: now },
              },
              include: { tenant: true },
            },
          },
        },
      },
    });
    console.log(landlord);
    

    if (!landlord) {
      return next(createHttpError(404, `Landlord with ID ${id} not found`));
    }

    // Recolectar tenants activos de cada propiedad
    const activeTenants = landlord.Property.flatMap((property) =>
      property.Contract.map((contract) => ({
        ...contract.tenant,
        monthlyRent: contract.monthlyRent,
        currentProperty: property.address,
      }))
    );

    if (!activeTenants || activeTenants.length === 0) {
      return next(createHttpError(404, "No active tenants found"));
    }

    res.status(200).json({
      landlordId: landlord.authID,
      tenants: activeTenants,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const validateMercadoPagoAccessToken: RequestHandler = async (req, res, next) => {
  try {
    const { authID } = req.params;

    const landlord = await prisma.landlord.findUnique({
      where: { authID },
      select: {
        mercadopagoaccesstoken: true, 
        email: true,
        id: true,
        createdAt: true,
        updatedAt: true,
        authID: true,
        firstName: true,
        lastName: true,
        avatar: true,
        gender: true,
        avgRating: true
      }
    });

    if (!landlord) {
      return next(createHttpError(404, `Landlord with ID ${authID} not found`));
    }

    if (landlord.mercadopagoaccesstoken === null) {
      return next(createHttpError(404, "Mercado Pago Access Token not set"));
    }

    res.status(200).json({message: "Mercado Pago Access Token is set"});
  }
  catch (error) {
    next(error);
  }
};
