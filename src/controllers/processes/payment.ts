import { RequestHandler } from "express";
import { PaymentModel } from "../../models/processes/payment";
import createHttpError from "http-errors";
import { PrismaClient } from "@prisma/client";
import { MercadoPagoConfig } from 'mercadopago';

const prisma = new PrismaClient();

export const createPayment: RequestHandler = async (req, res, next) => {
  try {
    const { payment_id, contract_id, tenantAuthID} = req.body;

    const contract = await prisma.contract.findUnique({
      where: { id: contract_id },
    });

    if (!contract) {
      throw createHttpError(404, `Contract with ID ${contract_id} not found`);
    }

    const newPayment = await prisma.payment.create({
      data: {
        tenantAuthID: tenantAuthID,
        contractId: contract.id,
        amount: contract.monthlyRent,
        paymentDate: new Date(),
        mercadoPagoPaymentId: payment_id,
      },
    });

    res.status(201).json(newPayment);
    return
  } catch (error) {
    next(error);
  }
};

export const alreadyThisMonthPayment: RequestHandler = async (req, res, next) => {
  try {
    const { tenantAuthID, contractId } = req.body; 

    if (!tenantAuthID || !contractId) {
      throw createHttpError(404, `tenantAuthID and contractId are required`);
    }

    const tenant = await prisma.tenant.findUnique({
      where: { authID: tenantAuthID },
    });

    if (!tenant) {
      throw createHttpError(404, `Tenant with authID ${tenantAuthID} not found`);
    }

    const contract = await prisma.contract.findUnique({
      where: { id: Number(contractId) },
    });

    if (!contract) {
      throw createHttpError(404, `Contract with ID ${contractId} not found`);
    }

    
    const now = new Date();
    const firstDayOfMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
    const firstDayNextMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1));


    const already = await prisma.payment.findFirst({
      where: {
        tenantAuthID: tenant.authID,
        contractId: contract.id,
        paymentDate: {
          gte: firstDayOfMonth,
          lt: firstDayNextMonth,
        },
      },
    });

    res.status(200).json({ exists: !!already });
  } catch (error) {
    next(error);
  }
};

export const updatePayment: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const updatedPayment = await PaymentModel.findByIdAndUpdate(id, updatedData, {
      new: true,
    }).exec();

    if (!updatedPayment) {
      throw createHttpError(404, `Payment with ID ${id} not found`);
    }

    res.status(200).json(updatedPayment);
  } catch (error) {
    next(error);
  }
};

export const deletePayment: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedPayment = await PaymentModel.findByIdAndDelete(id).exec();
    if (!deletedPayment) {
      throw createHttpError(404, `Payment with ID ${id} not found`);
    }

    res.status(200).json("Payment successfully deleted");
  } catch (error) {
    next(error);
  }
};

export const showPayment: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;

    const payment = await PaymentModel.findById(id).exec();
    if (!payment) {
      throw createHttpError(404, `Payment with ID ${id} not found`);
    }

    res.status(200).json(payment);
  } catch (error) {
    next(error);
  }
};

export const showPayments: RequestHandler = async (req, res, next) => {
  try {
    const payments = await PaymentModel.find().exec();
    if (!payments || payments.length === 0) {
      throw createHttpError(404, "No payments found");
    }

    res.status(200).json(payments);
  } catch (error) {
    next(error);
  }
};
