import { RequestHandler } from "express";
import createHttpError from "http-errors";
import { PrismaClient } from "@prisma/client";
import { uploadFileS3 } from "../../utils/S3";

const prisma = new PrismaClient();

export const createTenant: RequestHandler = async (req, res, next) => {
  try {
    const {
      authID,
      idType,
      firstName,
      lastName,
      phone,
      email,
      age,
      gender,
      maritalStatus,
      salary,
      contractType,
      industry,
      avgRating,
      previousContracts,
      contractsPer,
      avgContractDuration,
      rating,
      isFamily,
      tenure,
      id,
    } = req.body;

    // Validar y convertir los campos numéricos
    const parsedId = Number(id);
    if (isNaN(parsedId)) {
      res.status(400).json({ message: "id debe ser un número válido" });
      return;
    }
    const parsedAge = Number(age);
    if (isNaN(parsedAge)) {
      res.status(400).json({ message: "age debe ser un número válido" });
      return;
    }
    const parsedSalary = salary !== undefined ? Number(salary) : 0;
    if (salary !== undefined && isNaN(parsedSalary)) {
      res.status(400).json({ message: "salary debe ser un número válido" });
      return;
    }
    const parsedAvgRating = avgRating !== undefined ? parseFloat(avgRating) : 0;
    if (avgRating !== undefined && isNaN(parsedAvgRating)) {
      res.status(400).json({ message: "avgRating debe ser un número válido" });
      return;
    }
    const parsedPreviousContracts = previousContracts !== undefined ? Number(previousContracts) : 0;
    if (previousContracts !== undefined && isNaN(parsedPreviousContracts)) {
      res.status(400).json({ message: "previousContracts debe ser un número válido" });
      return;
    }
    const parsedContractsPer = contractsPer !== undefined ? Number(contractsPer) : 0;
    if (contractsPer !== undefined && isNaN(parsedContractsPer)) {
      res.status(400).json({ message: "contractsPer debe ser un número válido" });
      return;
    }
    const parsedAvgContractDuration = avgContractDuration !== undefined ? Number(avgContractDuration) : 0;
    if (avgContractDuration !== undefined && isNaN(parsedAvgContractDuration)) {
      res.status(400).json({ message: "avgContractDuration debe ser un número válido" });
      return;
    }
    const parsedTenure = tenure !== undefined ? Number(tenure) : 0;
    if (tenure !== undefined && isNaN(parsedTenure)) {
      res.status(400).json({ message: "tenure debe ser un número válido" });
      return;
    }

    // Convertir isFamily a boolean (acepta boolean o cadena "true")
    const parsedIsFamily = isFamily === true || isFamily === "true";

    // Validar campos de tipo enum (gender y maritalStatus)
    // Asumimos que Gender acepta "Masculino" o "Femenino"
 
    // Para maritalStatus, asumiendo algunos valores permitidos (ejemplo: "Soltero", "Casado", "Divorciado", "Viudo")

 

    // Verificar si el tenant ya existe (por authID)
    const existingTenant = await prisma.tenant.findUnique({ where: { authID: String(authID) } });
    if (existingTenant) {
      res.status(409).json({ message: "ID Already Taken" });
      return;
    }

    // Procesar la imagen avatar, si se envía
    let avatarUrl = "";
    const avatarFile = req.files?.files;
    if (avatarFile) {
      avatarUrl = await uploadFileS3(avatarFile);
    }

    const newTenant = await prisma.tenant.create({
      data: {
        authID: String(authID),
        idType: String(idType),
        firstName,
        lastName,
        phone,
        email,
        age: parsedAge,
        gender,
        maritalStatus,
        salary: parsedSalary,
        contractType: contractType || null,
        industry: industry || null,
        avgRating: parsedAvgRating,
        previousContracts: parsedPreviousContracts,
        contractsPer: parsedContractsPer,
        avgContractDuration: parsedAvgContractDuration,
        rating, // Se asume que se envía en el formato correcto del enum Rating
        isFamily: parsedIsFamily,
        tenure: parsedTenure,
        id: parsedId,
        avatar: avatarUrl,
      },
    });

    res.status(201).json(newTenant);
    return;
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


export const updateTenant: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params; // Aquí id es el authID
    const updatedData = req.body;

    const updatedTenant = await prisma.tenant.update({
      where: { authID: id },
      data: updatedData,
    });

    res.status(200).json(updatedTenant);
    return;
  } catch (error: any) {
    if (error.code === "P2025") {
      return next(
        createHttpError(404, `Tenant with ID ${req.params.id} not found`)
      );
    }
    next(error);
  }
};

export const deleteTenant: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedTenant = await prisma.tenant.delete({
      where: { authID: id },
    });

    res
      .status(200)
      .json({ message: "Tenant successfully deleted", deletedTenant });
    return;
  } catch (error: any) {
    if (error.code === "P2025") {
      return next(
        createHttpError(404, `Tenant with ID ${req.params.id} not found`)
      );
    }
    next(error);
  }
};

export const showTenant: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;

    const tenant = await prisma.tenant.findUnique({
      where: { authID: id },
    });

    if (!tenant) {
      return next(createHttpError(404, `Tenant with ID ${id} not found`));
    }

    res.status(200).json(tenant);
    return;
  } catch (error) {
    next(error);
  }
};

export const showTenants: RequestHandler = async (req, res, next) => {
  try {
    const tenants = await prisma.tenant.findMany();

    if (!tenants || tenants.length === 0) {
      return next(createHttpError(404, "No tenants found"));
    }

    res.status(200).json(tenants);
    return;
  } catch (error) {
    next(error);
  }
};
