import { InferSchemaType, model, Schema } from 'mongoose';

// preferencia_arrendatario
const TenantPreference = new Schema({
    // inquilino_id - FK
    tenantAuthID: {
        type: String,
        ref: 'tenant', // Referencia al modelo landlord
        required: [true, 'El authID del arrendatario es obligatorio'],
        trim: true,
    },
    // tipo_preferencia
    preferenceType: {
        type: String,
        required: [true, 'El tipo de preferencia es obligatorio'],
        maxlength: [100, 'La preferencia debe tener máximo 100 caracteres'],
    },
    // valor_preferencia
    preferenceValue: {
        type: String,
        required: [true, 'El valor de la preferencia es obligatoria'],
    },
},
    { timestamps: true }
);
type TenantPreferenceType = InferSchemaType<typeof TenantPreference>
// Crear el modelo a partir del esquema
export const TenantPreferenceModel = model<TenantPreferenceType>(
    "tenantpreference",
    TenantPreference
);