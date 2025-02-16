import { InferSchemaType, model, Schema } from "mongoose";

const Landlord = new Schema({
  // No existe una traducción para "cedula", por eso id
  id: {
    type: Number,
    required: [true, "El número de cedula es obligatorio"],
    unique: true,
    trim: true,
    min: [1111111, "La cédula debe tener mínimo 7 dígitos"],
    max: [9999999999, "La cédula debe tener máximo 10 dígitos"],
  },
  authID: {
    type: String,
    required: [true, "El id de autenticación es obligatorio"],
    unique: true, // Asegúrate de que sea único
    index: true, // Facilita las búsquedas por este campo
  },
  firstName: {
    type: String,
    required: [true, "El nombre es obligatorio"],
    minlength: [3, "El nombre debe tener mínimo 3 caracteres"],
    maxlength: [50, "El nombre debe tener máximo 50 caracteres"],
  },
  lastName: {
    type: String,
    required: [true, "El apellido es obligatorio"],
    minlength: [3, "El apellido debe tener mínimo 3 caracteres"],
    maxlength: [50, "El apellido debe tener máximo 50 caracteres"],
  },
  gender: {
    type: String,
    required: [true, 'El genero es obligatorio'],
    match: [
      /^(Masculino|Femenino)$/,
      'Por favor, ingrese un correo electrónico válido',
    ],
  },
  phone: {
    type: String,
    required: [true, "El número de teléfono es obligatorio"],
    match: [
      /^[0-9]{10,15}$/,
      "Por favor, ingrese un número de teléfono válido",
    ],
  },
  email: {
    type: String,
    required: [true, "El correo electrónico es obligatorio"],
    lowercase: true,
    unique: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      "Por favor, ingrese un correo electrónico válido",
    ],
  },
  avatar: {
    type: String,
  },
  // calificacion_promedio
  avgRating: {
    type: Number,
    default: 0,
    min: [0, "La calificación mínima del arrendatario es 0"],
    max: [10, "La calificación máxima del arrendatario es 10"],
  },
},
  { timestamps: true }
);
type LandlordType = InferSchemaType<typeof Landlord>;
// Crear el modelo a partir del esquema
export const LandlordModel = model<LandlordType>("landlord", Landlord);
