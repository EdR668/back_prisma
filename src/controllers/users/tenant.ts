import { RequestHandler } from "express";
import createHttpError from "http-errors";
import { PrismaClient } from "@prisma/client";
import { uploadFileS3 } from "../../utils/S3";

const prisma = new PrismaClient();

export const createTenant: RequestHandler = async (req, res, next) => {
  try {
    const tenantData = req.body;
    const avatarFile = req.files?.files;

    const existingTenant = await prisma.tenant.findUnique({
      where: { authID: tenantData.authID },
    });
    if (existingTenant) {
      res.status(409).json({ message: "ID Already Taken" });
      return;
    }

    let avatarUrl = "";
    if (avatarFile) {
      avatarUrl = await uploadFileS3(avatarFile);
    }

    const newTenant = await prisma.tenant.create({
      data: {
        ...tenantData,
        avatar: avatarUrl,
      },
    });

    res.status(201).json(newTenant);
    return; // Retorna sin valor
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
      return next(createHttpError(404, `Tenant with ID ${req.params.id} not found`));
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

    res.status(200).json({ message: "Tenant successfully deleted", deletedTenant });
    return;
  } catch (error: any) {
    if (error.code === "P2025") {
      return next(createHttpError(404, `Tenant with ID ${req.params.id} not found`));
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
