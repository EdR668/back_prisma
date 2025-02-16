import { InferSchemaType, model, Schema } from 'mongoose';

// pago
const Payment = new Schema({
    // contrato_id - FK
    contract: {
        type: Schema.Types.ObjectId,
        ref: 'contract',
        required: [true, 'El id del contrato es obligatorio'],
    },
    // inquilino_id - FK
    tenant: {
        type: Schema.Types.ObjectId,
        ref: 'tenant',
        required: [true, 'El id del inquilino es obligatorio'],
    },
    // monto
    amount: {
        type: Number,
        required: [true, 'El monto del pago es obligatorio'],
        min: [0, 'El monto del pago debe ser un número positivo'],
    },
    // fecha_pago
    paymentDate: {
        type: Date,
        required: [true, 'La fecha de inicio es obligatoria'],
    },
    // estado - definir cuáles son los códigos de estado para determinar la longitud
    status: {
        type: Number,
        required: [true, 'El estado del pago es obligatorio'],
        default: 0,
        min: [0, 'El estado del pago debe ser un número positivo'],
    },
    // metodo_pago - definir cuáles son los códigos de estado para determinar la longitud
    paymentMethod: {
        type: Number,
        required: [true, 'El método de pago es obligatorio'],
        default: 0,
        min: [0, 'El estado del pago debe ser un número positivo'],
    },
    // comprobante
    receipt: {
        type: String,
    },
},
    { timestamps: true }
);
type PaymentType = InferSchemaType<typeof Payment>
// Crear el modelo a partir del esquema
export const PaymentModel = model<PaymentType>(
    "payment",
    Payment
);