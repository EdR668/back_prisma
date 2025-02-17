import { RequestHandler } from "express";
import createHttpError from "http-errors";
import { PrismaClient } from "@prisma/client";
import { uploadFileS3 } from "../../utils/S3";

const prisma = new PrismaClient();

/**
 * Crea una cita (appointment).
 */
export const createAppointment: RequestHandler = async (req, res, next) => {
    try {
      // Extraer datos usando los nombres correctos
      const { landLordAuthID, tenantAuthID, propertyID, title, date, time, description } = req.body;
      console.log("req.body", req.body);
  
      // Verificar que el arrendador existe
      const landlord = await prisma.landlord.findUnique({
        where: { authID: landLordAuthID },
      });
      if (!landlord) {
        throw createHttpError(404, "El arrendador no existe");
      }
  
      // Verificar que el inquilino existe
      const tenant = await prisma.tenant.findUnique({
        where: { authID: tenantAuthID },
      });
      if (!tenant) {
        throw createHttpError(404, "El inquilino no existe");
      }
  
      // Verificar que la propiedad existe
      const property = await prisma.property.findUnique({
        where: { id: Number(propertyID) },
      });
      if (!property) {
        throw createHttpError(404, "La propiedad no existe");
      }
  
      // Crear la cita utilizando los nombres correctos
      const newAppointment = await prisma.appointment.create({
        data: {
          landlordId: landLordAuthID,
          tenantId: tenantAuthID,
          propertyId: Number(propertyID),
          title,
          date: new Date(date),
          time,
          description,
        },
      });
  
      res.status(200).json({
        message: "Appointment created successfully",
        appointment: newAppointment,
      });
      return;
    } catch (error) {
      console.error("Error creating appointment:", error);
      next(error);
    }
  };
  

/**
 * Muestra una cita por su ID, incluyendo datos de landlord, tenant y property.
 */
export const showAppointment: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const appointmentId = Number(id);
    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        landlord: true,
        tenant: true,
        property: true,
      },
    });
    if (!appointment) {
      throw createHttpError(404, "Appointment not found");
    }
    res.status(200).json({ appointment });
    return;
  } catch (error) {
    next(error);
  }
};

/**
 * Muestra todas las citas del año actual para un arrendador dado su landLordAuthID.
 */
export const showAllThisYearAppointmentsByLandlord: RequestHandler = async (req, res, next) => {
  try {
    const { landLordAuthID } = req.params;
    const currentYear = new Date().getFullYear();
    const startDate = new Date(currentYear, 0, 1);
    const endDate = new Date(currentYear, 11, 31);

    const appointments = await prisma.appointment.findMany({
      where: {
        landlordId: landLordAuthID,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        property: true,
        landlord: true,
        tenant: true,
      },
    });

    res.status(200).json(appointments);
    return;
  } catch (error) {
    next(error);
  }
};

/**
 * Muestra todas las citas del año actual para un inquilino dado su tenantAuthID.
 */
export const showAllThisYearAppointmentsByTenant: RequestHandler = async (req, res, next) => {
  try {
    const { tenantAuthID } = req.params;
    const currentYear = new Date().getFullYear();
    const startDate = new Date(currentYear, 0, 1);
    const endDate = new Date(currentYear, 11, 31);

    const appointments = await prisma.appointment.findMany({
      where: {
        tenantId: tenantAuthID,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        property: true,
        landlord: true,
        tenant: true,
      },
    });
    res.status(200).json(appointments);
    return;
  } catch (error) {
    next(error);
  }
};

/**
 * Obtiene todos los contratos activos para un tenant (con status "1") e incluye los detalles de la propiedad.
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
    const contractsWithTenant = contracts.map((contract: any) => ({
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
 * Actualiza una cita por su ID.
 */
export const updateAppointment: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const appointmentId = Number(id);
    const updatedData = req.body;
    const updatedAppointment = await prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        ...updatedData,
        date: updatedData.date ? new Date(updatedData.date) : undefined,
      },
      include: { property: true },
    });
    if (!updatedAppointment) {
      throw createHttpError(404, `Appointment with ID ${id} not found`);
    }
    res.status(200).json({
      message: "Appointment updated successfully",
      appointment: updatedAppointment,
    });
    return;
  } catch (error) {
    next(error);
  }
};

/**
 * Elimina una cita por su ID.
 */
export const deleteAppointment: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const appointmentId = Number(id);
    const deletedAppointment = await prisma.appointment.delete({
      where: { id: appointmentId },
    });
    if (!deletedAppointment) {
      throw createHttpError(404, `Appointment with ID ${id} not found`);
    }
    res.status(200).json({ message: "Appointment deleted successfully" });
    return;
  } catch (error) {
    next(error);
  }
};
