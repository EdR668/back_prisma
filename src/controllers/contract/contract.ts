import { RequestHandler } from "express";
import createHttpError from "http-errors";
import { PrismaClient } from "@prisma/client";
import { uploadFileS3 } from "../../utils/S3";

const prisma = new PrismaClient();

/**
 * Crea un contrato y sus documentos asociados.
 */
export const createContract: RequestHandler = async (req, res, next) => {
  try {
    const { 
      property_id,
      tenant_id,
      startDate,
      endDate,
      monthlyAmount,
      durationMonths,
      totalValue,
    } = req.body;

    const contractDoc  = req.files;

    const propertyHasContract = await prisma.contract.findFirst({
      where: { propertyId: Number(property_id) },
    });

    if (propertyHasContract) {
      throw createHttpError(400, "The property already has a contract associated");
    }

    // Crear el contrato
    const newContract = await prisma.contract.create({
      data: {
        propertyId: (Number(property_id)),
        tenantAuthID: tenant_id,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        monthlyRent: Number(monthlyAmount),
        status: "1",
      },
    });

    // retirar casa de la lista de disponibles
    await prisma.property.update({
      where: { id: Number(property_id) },
      data: { isAvailable: false },
    });

    // Crear documento
    if (contractDoc) {
      const docUrl = await uploadFileS3(contractDoc.contractFile);

      const newDoc = await prisma.contractDocument.create({
        data: {
          contractId: newContract.id,
          documentType: Array.isArray(contractDoc.contractFile) ? contractDoc.contractFile[0].mimetype : contractDoc.contractFile.mimetype,
          documentUrl: docUrl,
        },
      });

      res.status(201).json({
        contract: newContract,
        docs: newDoc,
      });
      return;
    }
  } catch (error) {
    console.error("Error creating contract:", error);
    next(error);
  }
};

/**
 * Obtiene todos los contratos.
 */
export const getAllContracts: RequestHandler = async (req, res, next) => {
  try {
    const contracts = await prisma.contract.findMany();
    res.status(200).json(contracts);
    return;
  } catch (error) {
    next(error);
  }
};

/**
 * Obtiene un contrato por su ID, incluyendo datos de la propiedad (address, city, state).
 */
export const getContractById: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const contractId = Number(id);

    const contract = await prisma.contract.findUnique({
      where: { id: contractId },
      include: {
        property: {
          select: {
            address: true,
            city: true,
            state: true,
            type: true,
            rooms: true,
            parking: true,
            squareMeters: true,
            tier: true,
            bathrooms: true,
            age: true,
            floors: true,
            description: true,
            isAvailable: true,
            rentPrice: true,
            PropertyMedia: {
              select: {
                id: true,
                mediaType: true,
                mediaUrl: true,
                description: true,
                uploadDate: true,
              },
            },
          },
        },
        ContractDocument: { 
          select: {
            id: true,
            documentType: true,
            documentUrl: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    if (!contract) {
      throw createHttpError(404, `Contract with ID ${id} not found`);
    }

    res.status(200).json(contract);
  } catch (error) {
    next(error);
  }
};



/**
 * Obtiene los contratos asociados a un tenant (usando tenantAuthID) e incluye la propiedad.
 * Luego, agrega los detalles del tenant a cada contrato.
 */
export const getContractsByTenant: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params; // tenantAuthID
    const contracts = await prisma.contract.findMany({
      where: { tenantAuthID: id },
      include: { property: true },
    });
    if (!contracts || contracts.length === 0) {
      throw createHttpError(404, `No contracts found for tenant ID ${id}`);
    }
    const tenantDetails = await prisma.tenant.findUnique({
      where: { authID: id },
    });
    const contractsWithTenant = contracts.map(contract => ({
      ...contract,
      tenant: tenantDetails,
    }));
    res.status(200).json(contractsWithTenant);
    return;
  } catch (error) {
    next(error);
  }
};

/**
 * Obtiene los contratos asociados a una propiedad (propertyId).
 * Para cada contrato, agrega detalles del tenant (nombre, email).
 */
export const getContractsByProperty: RequestHandler = async (req, res, next) => {
  try {
    const { propertyId } = req.params;
    const propId = Number(propertyId);
    const contracts = await prisma.contract.findMany({
      where: { propertyId: propId },
      include: { property: true },
    });
    if (!contracts || contracts.length === 0) {
      throw createHttpError(404, `Contracts for property with ID ${propertyId} not found`);
    }
    const contractsDetailed = await Promise.all(
      contracts.map(async contract => {
        const tenantDetails = await prisma.tenant.findUnique({
          where: { authID: contract.tenantAuthID },
        });
        return {
          ...contract,
          tenant: tenantDetails
            ? {
                name: `${tenantDetails.firstName} ${tenantDetails.lastName}`,
                email: tenantDetails.email,
              }
            : null,
        };
      })
    );
    res.status(200).json(contractsDetailed);
    return;
  } catch (error) {
    next(error);
  }
};

/**
 * Obtiene los contratos asociados a una propiedad y a un tenant en particular.
 */
export const getContractsByPropertyAndUser: RequestHandler = async (req, res, next) => {
  try {
    const { propertyId, tenantId } = req.params;
    const propId = Number(propertyId);
    const contracts = await prisma.contract.findMany({
      where: { propertyId: propId, tenantAuthID: tenantId },
      include: {
        property: { select: { address: true, city: true, state: true } },
      },
    });
    if (!contracts || contracts.length === 0) {
      throw createHttpError(404, `Contract for property ID ${propertyId} not found`);
    }
    res.status(200).json(contracts);
    return;
  } catch (error) {
    next(error);
  }
};

/**
 * Actualiza un contrato dado su ID.
 */
export const updateContract: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const contractId = Number(id);
    const updatedData = req.body;
    const updatedContract = await prisma.contract.update({
      where: { id: contractId },
      data: updatedData,
      include: { property: { select: { address: true, city: true, state: true } } },
    });
    if (!updatedContract) {
      throw createHttpError(404, `Contract with ID ${id} not found`);
    }
    res.status(200).json({
      message: "Contract updated successfully",
      contract: updatedContract,
    });
    return;
  } catch (error: any) {
    next(error);
  }
};

/**
 * Elimina un contrato por su ID.
 */
export const deleteContract: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const contractId = Number(id);

    // Primero, eliminar los documentos asociados al contrato
    await prisma.contractDocument.deleteMany({
      where: { contractId },
    });

    // Luego, eliminar los pagos asociados al contrato
    await prisma.payment.deleteMany({
      where: { contractId },
    });

    // Finalmente, eliminar el contrato
    const deletedContract = await prisma.contract.delete({
      where: { id: contractId },
    });

    if (!deletedContract) {
      throw createHttpError(404, `Contract with ID ${id} not found`);
    }
    res.status(200).json({ message: "Contract deleted successfully" });
    return;
  } catch (error: any) {
    next(error);
  }
};

/**
 * Obtiene los contratos activos (status "1") asociados a un tenant (tenantAuthID).
 * Agrega los detalles del tenant a cada contrato.
 */
export const getActiveContractsByTenant: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params; // tenantAuthID
    const contracts = await prisma.contract.findMany({
      where: { tenantAuthID: id, status: "1" },
      include: { property: true },
    });
    if (!contracts || contracts.length === 0) {
      throw createHttpError(404, `No active contracts found for tenant ID ${id}`);
    }
    const tenantDetails = await prisma.tenant.findUnique({
      where: { authID: id },
    });
    const contractsWithTenant = contracts.map(contract => ({
      ...contract,
      tenant: tenantDetails,
    }));
    res.status(200).json(contractsWithTenant);
    return;
  } catch (error) {
    next(error);
  }
};
