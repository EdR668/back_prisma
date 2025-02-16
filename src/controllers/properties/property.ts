import { RequestHandler } from "express";
import createHttpError from "http-errors";
import { PrismaClient } from "@prisma/client";
import { uploadFileS3 } from "../../utils/S3";
import { 
  addFiltersToQuery, 
  filterResponseByRegex, 
  getObjectsByIds 
} from "../../utils/mongoQueryUtils";

const prisma = new PrismaClient();

/** 
 * Crea una propiedad y, si se envían archivos, crea los registros de PropertyMedia asociados.
 */
export const createProperty: RequestHandler = async (req, res, next) => {
  try {
    const {
      address,
      city,
      state,
      type,
      rooms,
      parking,
      squareMeters,
      tier,
      bathrooms,
      age,
      floors,
      description,
      landlordAuthID,
    } = req.body;
    const files = req.files?.files; // Se espera un array de archivos

    // Crear la propiedad
    const newProperty = await prisma.property.create({
      data: {
        address,
        city,
        state,
        type,
        rooms,
        parking,
        squareMeters,
        tier,
        bathrooms,
        age,
        floors,
        description,
        landlordAuthID,
      },
    });

    // Manejar archivos multimedia (PropertyMedia)
    if (files && Array.isArray(files)) {
      const mediaPromises = files.map(async (file: any) => {
        // Subir el archivo a S3
        const s3Result = await uploadFileS3(file);
        // Crear registro de PropertyMedia con referencia a la propiedad
        return await prisma.propertyMedia.create({
          data: {
            propertyFk: newProperty.id, // Se asume que Property.id coincide con la relación
            mediaType: file.mimetype,
            mediaUrl: s3Result,
            description: file.description || "",
            uploadDate: new Date(),
          },
        });
      });
      await Promise.all(mediaPromises);
    } else {
      throw new Error("Failed to upload file, there's no file to upload");
    }

    res.status(201).json({
      message: "Property created successfully",
      property: newProperty,
    });
    return;
  } catch (error: any) {
    // Aquí podrías agregar manejo de errores de validación si lo deseas
    console.error(error);
    next(error);
  }
};

/** Actualiza una propiedad dada su id */
export const updateProperty: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const propertyId = Number(id);
    const updatedData = req.body;

    const updatedProperty = await prisma.property.update({
      where: { id: propertyId },
      data: updatedData,
    });

    res.status(200).json(updatedProperty);
    return;
  } catch (error: any) {
    next(error);
  }
};

/** Elimina una propiedad por su id */
export const deleteProperty: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const propertyId = Number(id);
    await prisma.property.delete({
      where: { id: propertyId  },
    });

    res.status(200).json("Property successfully deleted");
    return;
  } catch (error: any) {
    next(error);
  }
};

/** Muestra una propiedad, sus medios asociados y el contrato activo (si existe) */
export const showProperty: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log(id);
    const propertyId = Number(id);
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      include: {
        PropertyMedia: true,
        Contract: {
          where: { status: "1" },
          include: { tenant: { select: { firstName: true, email: true, authID: true } } },
        },
      },
    });

    if (!property) {
      throw createHttpError(404, `Property with ID ${id} not found`);
    }

    // Transformamos el objeto para que 'id' se llame '_id' en la respuesta
    const transformedProperty = { _id: property.id, ...property };

    res.status(200).json({
      property: transformedProperty,
      media: property.PropertyMedia,
      contract: property.Contract[0] || null,
    });
    return;
  } catch (error) {
    next(error);
  }
};

/** Muestra todas las propiedades */
export const showProperties: RequestHandler = async (req, res, next) => {
  try {
    const properties = await prisma.property.findMany();
    if (!properties || properties.length === 0) {
      throw createHttpError(404, "No properties found");
    }
    // Transformar cada propiedad: renombrar 'id' a '_id'
    const transformedProperties = properties.map(({ id, ...rest }) => ({
      _id: id,
      ...rest,
    }));

    res.status(200).json(transformedProperties);
    return;
  } catch (error) {
    next(error);
  }
};

/** Muestra propiedades asociadas a un usuario (landlord), incluyendo medios y contrato activo */
export const showPropertiesByUser: RequestHandler = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const properties = await prisma.property.findMany({
      where: { landlordAuthID: userId },
      include: {
        PropertyMedia: true,
        Contract: {
          where: { status: "active" },
        },
      },
    });
    if (!properties || properties.length === 0) {
      throw createHttpError(404, "No properties found");
    }

    const propertiesWithMedia = properties.map((property) => ({
      ...property,
      media: property.PropertyMedia,
      contract: property.Contract[0] || null,
    }));

    res.status(200).json(propertiesWithMedia);
    return;
  } catch (error) {
    next(error);
  }
};

/** Muestra propiedades disponibles aplicando filtros (usando funciones utilitarias para regex) */
export const showAvailableProperties: RequestHandler = async (req, res, next) => {
  try {
    const regexFields = ["address", "city", "state", "type", "description"];
    const exactFields = ["rooms", "parking", "squareMeters", "tier", "bathrooms", "age", "floors", "isAvailable"];
    const filter = addFiltersToQuery(req.body, exactFields);

    const properties = await prisma.property.findMany({
      where: { ...filter },
      include: {
        PropertyMedia: {
          orderBy: { uploadDate: 'desc' },
          take: 1,
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    // Convertir a objetos simples para aplicar funciones utilitarias
    const plainProperties = JSON.parse(JSON.stringify(properties));
    const filteredPropertiesIds = filterResponseByRegex(plainProperties, regexFields, req.body);
    const filteredProperties = getObjectsByIds(plainProperties, filteredPropertiesIds);
    if (!filteredProperties || filteredProperties.length === 0) {
      throw createHttpError(404, "No properties found");
    }
    res.status(200).json(filteredProperties);
    return;
  } catch (error) {
    next(error);
  }
};

/** Muestra propiedades disponibles sin aplicar filtros adicionales */
export const showAvailablePropertiesWithoutFilters: RequestHandler = async (req, res, next) => {
  try {
    const properties = await prisma.property.findMany({
      where: { isAvailable: true },
      include: { PropertyMedia: true },
    });
    if (!properties || properties.length === 0) {
      throw createHttpError(404, "No properties found");
    }
    const transformedProperties = properties.map(({ id, ...rest }) => ({
      _id: id,
      ...rest,
    }))
    const propertiesWithMedia =  transformedProperties.map((property) => ({
      ...property,
      media: property.PropertyMedia,
    }));

   ;
    res.status(200).json(propertiesWithMedia);
    return;
  } catch (error) {
    next(error);
  }
};

/**
 * Muestra propiedades y candidatos (aplicaciones) asociados a un landlord,
 * limitando los candidatos a los 3 con mayor score.
 */
export const showPropertiesAndCandidatesByLandlordId: RequestHandler = async (req, res, next) => {
  try {
    const { landlordId } = req.params;
    if (!landlordId) {
      throw createHttpError(400, "Landlord ID is required");
    }

    const properties = await prisma.property.findMany({
      where: { landlordAuthID: landlordId, isAvailable: true },
      include: {
        PropertyMedia: {
          orderBy: { uploadDate: 'desc' },
          take: 1,
        },
        Application: {
          orderBy: { score: 'desc' },
          include: { tenant: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const transformed = properties.map((p) => ({
      _id: p.id,
      media: p.PropertyMedia.length > 0 ? p.PropertyMedia[0].mediaUrl : null,
      direccion: p.address,
      habitaciones: p.rooms,
      area_propiedad: p.squareMeters,
      total_postulaciones: p.Application.length,
      precio: p.rentPrice,
      bathrooms: p.bathrooms,
      lista_candidatos: p.Application.slice(0, 3).map((app) => ({
        ...app,
        tenantInfo: app.tenant,
      })),
    }));

    if (!transformed || transformed.length === 0) {
      throw createHttpError(404, "No properties found for landlord");
    }

    res.status(200).json(transformed);
    return;
  } catch (error) {
    next(error);
  }
};
