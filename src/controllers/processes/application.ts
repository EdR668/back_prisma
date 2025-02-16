import { RequestHandler } from "express";
import createHttpError from "http-errors";
import { PrismaClient } from "@prisma/client";
import { uploadFileS3 } from "../../utils/S3";

const prisma = new PrismaClient();

/** 
 * Crea una aplicación y, si se envían medios y referencias, los asocia.
 */
export const createApplication: RequestHandler = async (req, res, next) => {
  try {
    const { applicationData, applicationMedias, applicationReferences } = req.body;
    
    // Crear la aplicación, conectando la propiedad y el tenant
    const newApplication = await prisma.application.create({
      data: {
        // Conectar la propiedad existente (suponiendo que applicationData.property es el id de la propiedad)
        property: { connect: { id: Number(applicationData.property) } },
        // No incluimos tenantAuthID ya que la relación maneja esa conexión
        status: applicationData.status,
        score: applicationData.score,
        personalDescription: applicationData.personalDescription,
        tenant: {
          connect: { authID: applicationData.tenantAuthID }
        },
      },
    });

    // Manejar medios: se espera que applicationMedias sea un array
    const mediaPromises = applicationMedias.map(async (media: { file: any }) => {
      // Prepend el id de la aplicación al nombre del archivo
      media.file.name = `${newApplication.id}-${media.file.name}`;
      const mediaUrl = await uploadFileS3(media.file);
      return await prisma.applicationMedia.create({
        data: {
          applicationId: newApplication.id,
          mediaType: media.file.mimetype,
          mediaUrl,
        },
      });
    });
    const newMedias = await Promise.all(mediaPromises);

    // Manejar referencias
    const referencePromises = applicationReferences.map(async (ref: any) => {
      return await prisma.applicationReference.create({
        data: {
          ...ref,
          applicationId: newApplication.id,
        },
      });
    });
    const newReferences = await Promise.all(referencePromises);

    res.status(201).json({
      application: newApplication,
      medias: newMedias,
      references: newReferences,
    });
    return;
  } catch (error) {
    console.error("Error creating application:", error);
    next(error);
  }
};

/** Actualiza una aplicación dado su id (convertido a número) */
export const updateApplication: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const applicationId = Number(id);
    const updatedData = req.body;

    const updatedApplication = await prisma.application.update({
      where: { id: applicationId },
      data: updatedData,
    });

    res.status(200).json(updatedApplication);
    return;
  } catch (error: any) {
    if (error.code === "P2025") {
      return next(createHttpError(404, `Application with ID ${req.params.id} not found`));
    }
    next(error);
  }
};

/** Elimina una aplicación por su id */
export const deleteApplication: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const applicationId = Number(id);
    await prisma.application.delete({
      where: { id: applicationId },
    });

    res.status(200).json("Application successfully deleted");
    return;
  } catch (error: any) {
    if (error.code === "P2025") {
      return next(createHttpError(404, `Application with ID ${req.params.id} not found`));
    }
    next(error);
  }
};

/** Muestra una aplicación, incluyendo referencias, documentos y los detalles del inquilino */
export const showApplication: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const applicationId = Number(id);

    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        ApplicationReference: true,
        ApplicationMedia: true,
      },
    });

    if (!application) {
      throw createHttpError(404, `Application with ID ${id} not found`);
    }

    // Obtener detalles del inquilino (Tenant) a partir de tenantAuthID, si existe
    let tenantDetails = null;
    if (application.tenantAuthID) {
      tenantDetails = await prisma.tenant.findUnique({
        where: { authID: application.tenantAuthID },
      });
    }

    // Preparar la respuesta: se reemplaza tenantAuthID por la información completa del tenant
 
    const applicationObj = application
    const { tenantAuthID, ...filteredApplication } = applicationObj;
    const applicationData = {
      ...filteredApplication,
      tenant: tenantDetails, // Agregamos la información completa del tenant
    };
    

    res.status(200).json({
      application: applicationData,
    });
    return;
  } catch (error) {
    next(error);
  }
};

/** Muestra todas las aplicaciones */
export const showApplications: RequestHandler = async (req, res, next) => {
  try {
    const applications = await prisma.application.findMany();
    if (!applications || applications.length === 0) {
      throw createHttpError(404, "No applications found");
    }
    res.status(200).json(applications);
    return;
  } catch (error) {
    next(error);
  }
};

/** Muestra aplicaciones asociadas a una propiedad, incluyendo detalles del inquilino */
export const showApplicationsByProperty: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    // Suponemos que propertyId es numérico. Si es string, ajusta la conversión.
    const propertyId = Number(id);

    const applications = await prisma.application.findMany({
      where: { propertyId: propertyId },
      include: {
        ApplicationReference: true,
        ApplicationMedia: true,
      },
    });
    if (!applications || applications.length === 0) {
      throw createHttpError(404, "No applications found for the property");
    }

    // Recuperar detalles del inquilino para cada aplicación
    const applicationsWithTenants = await Promise.all(
      applications.map(async (app) => {
        let tenantDetails = null;
        if (app.tenantAuthID) {
          tenantDetails = await prisma.tenant.findUnique({
            where: { authID: app.tenantAuthID },
          });
        }
        return { ...app, tenant: tenantDetails };
      })
    );

    // Filtrar las aplicaciones que tienen tenant definido
    const applicationsWithTenantsFiltered = applicationsWithTenants.filter(
      (app) => app.tenant !== null
    );
    
    // Extraer datos demográficos usando sólo los que tienen tenant
    const demographics = extractDemographics(applicationsWithTenantsFiltered as { tenant: TenantData }[]);

    res.status(200).json({
      applications: applicationsWithTenants,
      demographics,
    });
    return;
  } catch (error) {
    next(error);
  }
};


/** Actualiza el estado de una aplicación */
export const updateApplicationStatus: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const applicationId = Number(id);
    const { status } = req.body;

    const updatedApplication = await prisma.application.update({
      where: { id: applicationId },
      data: { status },
    });

    res.status(200).json(updatedApplication);
    return;
  } catch (error: any) {
    next(error);
  }
};

/** Obtiene las aplicaciones de un inquilino en un año específico */
export const getApplicationsByTenant: RequestHandler = async (req, res, next) => {
  const { id } = req.params; // tenantAuthID
  const { year } = req.query as { year?: string };

  try {
    if (!year) {
      res.status(400).json({ message: "Year is required" });
      return;
    }

    const yearStart = new Date(`${year}-01-01T00:00:00.000Z`);
    const yearEnd = new Date(`${year}-12-31T23:59:59.999Z`);

    const applications = await prisma.application.findMany({
      where: {
        tenantAuthID: id,
        createdAt: {
          gte: yearStart,
          lte: yearEnd,
        },
      },
    });

    // Para cada aplicación, obtener referencias y documentos
    const applicationsWithDetails = await Promise.all(
      applications.map(async (app) => {
        const references = await prisma.applicationReference.findMany({
          where: { applicationId: app.id },
        });
        const documents = await prisma.applicationMedia.findMany({
          where: { applicationId: app.id },
        });
        return {
          application: app,
          references,
          documents,
        };
      })
    );

    res.status(200).json({ applications: applicationsWithDetails });
    return;
  } catch (error) {
    next(error);
    return;
  }
};

// Función para extraer datos demográficos
interface Demographics {
  ageGroups: Array<{ group: string; count: number }>;
  industries: Array<{ industry: string; count: number }>;
}
interface TenantData {
  age: number;
  industry?: string;
}
function extractDemographics(applications: Array<{ tenant: TenantData }>): Demographics {
  const ageBuckets = { "18-25": 0, "26-35": 0, "36-45": 0, "46+": 0 };
  const industryCount: { [key: string]: number } = {};

  applications.forEach((app) => {
    const age = app.tenant.age;
    const industry = app.tenant.industry || "Otros";

    if (age < 26) ageBuckets["18-25"]++;
    else if (age < 36) ageBuckets["26-35"]++;
    else if (age < 46) ageBuckets["36-45"]++;
    else ageBuckets["46+"]++;

    industryCount[industry] = (industryCount[industry] || 0) + 1;
  });

  return {
    ageGroups: Object.entries(ageBuckets).map(([group, count]) => ({ group, count })),
    industries: Object.entries(industryCount).map(([industry, count]) => ({ industry, count })),
  };
}
