import { RequestHandler } from "express";
import { UserModel } from "../../models/users/user";
import createHttpError from "http-errors";

export const createUser: RequestHandler = async (req, res, next) => {
  try {
   
    const { name, phone, age, email } = req.body;
    const existingUsername = await UserModel.findOne({
      phone: phone,
    }).exec();
    if (existingUsername) {
      throw createHttpError(409, "Phone Already Taken");
    }
    const newUser = await UserModel.create({
      name: name,
      age: age,
      phone: phone,
      email: email,
    });
    res.status(201).json(newUser);
  } catch (error) {
    if ((error as any).name === "ValidationError") {
      // Manejo de errores de validación de Mongoose
      const validationErrors = Object.values((error as any).errors).map((err: any) => ({
        field: err.path,
        message: err.message,
      }));
      res.status(400).json({
        message: "Validation failed",
        errors: validationErrors,
      });
      return; // Asegurarse de no continuar después de enviar una respuesta
    }

    // Registrar otros errores para depuración
    console.error(error);

    // Pasar el error a otros middlewares
    next(error);
  }
};

export const updateUser: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, phone, age, email } = req.body;

    const existingPhone = await UserModel.findOneAndUpdate(
      { _id: id },
      { name, phone, age, email },
      {
        new: true,
      }
    ).exec();
    if (!existingPhone) {
      throw createHttpError(404, `User ${existingPhone} not found`);
    }

    res.status(201).json(existingPhone);
  } catch (error) {
    next(error);
  }
};


export const deleteUser: RequestHandler = async (req, res, next) => {
    try {
      const { id } = req.params;

  
      const existingPhone = await UserModel.findOneAndDelete(
        { _id: id }
      ).exec();
      if (!existingPhone) {
        throw createHttpError(404, `User ${existingPhone} not found`);
      }
  
      res.status(201).json("Eliminado exitosamente");
    } catch (error) {
      next(error);
    }
  };


  export const showUser: RequestHandler = async (req, res, next) => {
    try {
      const { id } = req.params;

  
      const existingPhone = await UserModel.findOne(
        { _id: id }
      ).exec();
      if (!existingPhone) {
        throw createHttpError(404, `User ${existingPhone} not found`);
      }
  
      res.status(201).json(existingPhone);
    } catch (error) {
      next(error);
    }
  };

  export const showUsers: RequestHandler = async (req, res, next) => {
    try {


  
      const existingPhones = await UserModel.find(
      ).exec();
      if (!existingPhones) {
        throw createHttpError(404, `User ${existingPhones} not found`);
      }
  
      res.status(201).json(existingPhones);
    } catch (error) {
      next(error);
    }
  };