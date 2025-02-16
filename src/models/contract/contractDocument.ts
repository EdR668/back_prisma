import { InferSchemaType, model, Schema } from "mongoose";

// soporte_contrato
const ContractDocument = new Schema(
  {
    // contrato_id - FK
    contract: {
      type: Schema.Types.ObjectId,
      ref: "contract",
      required: [true, "El id del contrato es obligatorio"],
    },
    // tipo_documento - definir cuáles son los códigos de documento para determinar la longitud
    documentType: {
      type: String,
      required: [true, "El tipo de documento del contrato es obligatorio"],
    },
    // url_documento
    documentUrl: {
      type: String,
      required: [true, "El estado del contrato es obligatorio"],
    },
  },
  { timestamps: true }
);
type ContractDocumentType = InferSchemaType<typeof ContractDocument>;
// Crear el modelo a partir del esquema
export const ContractDocumentModel = model<ContractDocumentType>(
  "contractdocument",
  ContractDocument
);
