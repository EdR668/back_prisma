import { InferSchemaType, model, Schema } from "mongoose";

const User = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: [3, 'El nombre debe tener al menos 3 caracteres'],
  },
  age: {
    type: Number,
    required: true,
  },
  phone: {
    type: String,
    required: [true, 'El número de celular es obligatorio'],
    match: [
      /^[0-9]{10,15}$/,
      'Por favor, ingrese un número de celular válido',
    ],
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Por favor, ingrese un correo válido',
    ],
  },
},
  { timestamps: true }
);
type UserType = InferSchemaType<typeof User>
// Crear el modelo a partir del esquema
export const UserModel = model<UserType>(
  "user",
  User
);
