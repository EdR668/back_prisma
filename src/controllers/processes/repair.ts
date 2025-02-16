import { RequestHandler } from "express";
import { RepairModel } from "../../models/processes/repair";
import createHttpError from "http-errors";

export const createRepair: RequestHandler = async (req, res, next) => {
  try {
    const repairData = req.body;

    const newRepair = await RepairModel.create(repairData);
    res.status(201).json(newRepair);
  } catch (error) {
    next(error);
  }
};

export const updateRepair: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const updatedRepair = await RepairModel.findByIdAndUpdate(id, updatedData, {
      new: true,
    }).exec();

    if (!updatedRepair) {
      throw createHttpError(404, `Repair with ID ${id} not found`);
    }

    res.status(200).json(updatedRepair);
  } catch (error) {
    next(error);
  }
};

export const deleteRepair: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedRepair = await RepairModel.findByIdAndDelete(id).exec();
    if (!deletedRepair) {
      throw createHttpError(404, `Repair with ID ${id} not found`);
    }

    res.status(200).json("Repair successfully deleted");
  } catch (error) {
    next(error);
  }
};

export const showRepair: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;

    const repair = await RepairModel.findById(id).exec();
    if (!repair) {
      throw createHttpError(404, `Repair with ID ${id} not found`);
    }

    res.status(200).json(repair);
  } catch (error) {
    next(error);
  }
};

export const showRepairs: RequestHandler = async (req, res, next) => {
  try {
    const repairs = await RepairModel.find().exec();
    if (!repairs || repairs.length === 0) {
      throw createHttpError(404, "No repairs found");
    }

    res.status(200).json(repairs);
  } catch (error) {
    next(error);
  }
};
