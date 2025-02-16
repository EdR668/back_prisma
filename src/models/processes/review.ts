import { InferSchemaType, model, Schema } from 'mongoose';

// reseña
const Review = new Schema({
    // propietario_id - FK
    landlord: {
        type: Schema.Types.ObjectId,
        ref: 'landlord',
        required: [true, 'El id del arrendatario es obligatorio'],
    },
    // inquilino_id - FK
    tenant: {
        type: Schema.Types.ObjectId,
        ref: 'tenant',
        required: [true, 'El id del inquilino es obligatorio'],
    },
    // comentario
    comment: {
        type: String,
        maxlength: [1000, 'La descripción máxima debe tener máximo 1000 caracteres'],
    },
    // calificación
    rating: {
        type: Number,
        required: [true, 'La calificación es obligatoria'],
        default: 0,
        min: [0, 'La calificación mínima de la reseña es 0'],
        max: [10, 'La calificación máxima de la reseña es 10'],
    },
    // fecha
    date: {
        type: Date,
        required: [true, 'La fecha de la reseña es obligatoria'],
        default: Date.now,
    },
},
    { timestamps: true }
);
type ReviewType = InferSchemaType<typeof Review>
// Crear el modelo a partir del esquema
export const ReviewModel = model<ReviewType>(
    "review",
    Review
);