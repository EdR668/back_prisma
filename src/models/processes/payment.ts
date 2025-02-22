import { InferSchemaType, model, Schema } from 'mongoose';

// pago
const PaymentSchema = new Schema({
    // inquilino - FK con Tenant.authID
    tenantAuthID: {
        type: String,
        ref: 'tenant',
        required: [true, 'El ID del inquilino es obligatorio'],
    },
    // contrato - FK con Contract.id
    contractId: {
        type: Number,
        ref: 'contract',
        required: [true, 'El ID del contrato es obligatorio'],
    },
    // monto
    amount: {
        type: Schema.Types.Decimal128,
        required: [true, 'El monto del pago es obligatorio'],
        min: [0, 'El monto del pago debe ser un número positivo'],
    },
    // fecha de pago (opcional con valor por defecto)
    paymentDate: {
        type: Date,
        default: Date.now,
    },
    // ID de pago de Mercado Pago
    mercadoPagoPaymentId: {
        type: String,
        unique: true,
        maxlength: 50,
        required: [true, 'El ID de Mercado Pago es obligatorio'],
    },
},
{ timestamps: true });

type PaymentType = InferSchemaType<typeof PaymentSchema>;

// Crear el modelo a partir del esquema
export const PaymentModel = model<PaymentType>("payment", PaymentSchema);
