import { RequestHandler } from "express";
import { PaymentModel } from "../../models/processes/payment";
import createHttpError from "http-errors";

export const createPayment: RequestHandler = async (req, res, next) => {
  try {
    const paymentData = req.body;

    const newPayment = await PaymentModel.create(paymentData);
    res.status(201).json(newPayment);
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
