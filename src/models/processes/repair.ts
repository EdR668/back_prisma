import { InferSchemaType, model, Schema } from 'mongoose';

// reparación
const Repair = new Schema({
    // propiedad_id - FK
    property: {
        type: Schema.Types.ObjectId,
        ref: 'property',
        required: [true, 'El id de la propiedad es obligatorio'],
    },
    // descripción
    description: {
        type: String,
        required: [true, 'La dirección es obligatoria'],
        maxlength: [1000, 'La descripción debe tener máximo 1000 caracteres'],
    },
    // prioridad - códigos de la prioridad?
    priority: {
        type: Number,
        required: [true, 'La prioridad de la reparación es obligatoria'],
        default: 0,
        min: [0, 'El código de prioridad debe ser un número positivo'],
    },
    // estado - definir cuáles son los códigos de estado para determinar la longitud
    status: {
        type: Number,
        required: [true, 'El estado de la reparación es obligatorio'],
        default: 0,
        min: [0, 'El código de estado debe ser un número positivo'],
    },
    // fecha_reporte
    reportDate: {
        type: Date,
        required: [true, 'La fecha de reporte es obligatoria'],
    },
    // fecha_resolución
    resolutionDate: {
        type: Date,
    },
    // costo
    cost: {
        type: Number,
        min: [0, 'El costo de la reparación debe ser un número positivo'],
    },
},
    { timestamps: true }
);
type RepairType = InferSchemaType<typeof Repair>
// Crear el modelo a partir del esquema
export const RepairModel = model<RepairType>(
    'repair',
    Repair
);