import { InferSchemaType, model, Schema } from 'mongoose';

// postulación
const Application = new Schema({
    // propiedad_id - FK
    property: {
        type: Schema.Types.ObjectId,
        ref: 'property',
        required: [true, 'El id de la propiedad es obligatorio'],
    },
    // inquilino_id - FK
    tenantAuthID: {
        type: String,
        ref: 'tenant',
        required: [true, 'El id del inquilino es obligatorio'],
    },
    personalDescription: {
        type: String,
        required: true,
    },
    // estado - definir cuáles son los códigos de estado para determinar la longitud
    status: {
        type: Number,
        required: [true, 'El estado de la aplicación es obligatoria'],
        default: 0,
        min: [0, 'El código de estado debe ser un número positivo'],
    },
    // calificación
    score: {
        type: Number,
        default: 0,
        min: [0, 'La calificación mínima debe ser 0'],
        max: [10, 'La calificación máxima debe ser 10'],
    },
},
    { timestamps: true }
);
type ApplicationType = InferSchemaType<typeof Application>
// Crear el modelo a partir del esquema
export const ApplicationModel = model<ApplicationType>(
    'application',
    Application
);