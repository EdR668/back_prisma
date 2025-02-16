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
    const { contractData, contractDocs } = req.body;

    // Crear el contrato
    const newContract = await prisma.contract.create({
      data: {
        ...contractData,
        // Si contractData.property es un string que representa el id de la propiedad,
        // conectamos la relación. Ejemplo: property: { connect: { id: Number(contractData.property) } }
        property: { connect: { id: Number(contractData.property) } },
        // Se supone que tenantAuthID se guarda en el contrato para referenciar al tenant.
      },
    });

    // Manejar múltiples documentos
    const docPromises = contractDocs.map(async (doc: { file: any; documentType?: string }) => {
      const docUrl = await uploadFileS3(doc.file);
      return await prisma.contractDocument.create({
        data: {
          contractId: newContract.id,
          documentType: doc.documentType || "",
          documentUrl: docUrl,
        },
      });
    });
    const newDocs = await Promise.all(docPromises);

    res.status(201).json({
      contract: newContract,
      docs: newDocs,
    });
    return;
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
        property: { select: { address: true, city: true, state: true } },
      },
    });
    if (!contract) {
      throw createHttpError(404, `Contract with ID ${id} not found`);
    }
    res.status(200).json(contract);
    return;
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
