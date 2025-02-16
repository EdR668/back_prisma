import { InferSchemaType, model, Schema } from "mongoose";

const Contract = new Schema(
  {
    // propiedad_id - FK
    propertyId: {
      type: Schema.Types.ObjectId,
      ref: "property",
      required: [true, "El id de la propiedad es obligatorio"],
    },
    // inquilino_id - FK
    tenantAuthID: {
      type: String,
      ref: "tenant",
      required: [true, "El id del inquilino es obligatorio"],
    },
    // fecha_inicio
    startDate: {
      type: Date,
      required: [true, "La fecha de inicio es obligatoria"],
    },
    // fecha_fin
    endDate: {
      type: Date,
      required: [true, "La fecha de fin es obligatoria"],
    },
    // monto_mensual
    monthlyRent: {
      type: Number,
      required: [true, "El monto mensual es obligatorio"],
      min: [0, "El monto mensual debe ser un número positivo"],
    },
    // estado - definir cuáles son los códigos de estado para determinar la longitud
    status: {
      type: String,
      required: [true, "El estado del contrato es obligatorio"],
    },
  },
  { timestamps: true }
);
type ContractType = InferSchemaType<typeof Contract>;
// Crear el modelo a partir del esquema
export const ContractModel = model<ContractType>("contract", Contract);
