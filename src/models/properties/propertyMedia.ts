import { InferSchemaType, model, Schema } from 'mongoose';

// propiedad_media
const PropertyMedia = new Schema({
    // propiedad_id - FK
    property: {
        type: Schema.Types.ObjectId,
        ref: 'property',
        required: [true, 'El id de la propiedad es obligatorio'],
    },
    // tipo_media
    mediaType: {
        type: String,
        required: [true, 'El tipo de documento del contrato es obligatorio'],
    },
    // url_media
    mediaUrl: {
        type: String,
        required: [true, 'El estado del contrato es obligatorio'],
    },
    // descripción
    description: {
        type: String,
        maxlength: [100, 'La descripción máxima debe tener máximo 100 caracteres'],
    },
    // fecha_subida
    uploadDate: {
        type: Date,
        required: [true, 'La fecha de subida es obligatoria'],
    },
},
    { timestamps: true }
);
type PropertyMediaType = InferSchemaType<typeof PropertyMedia>
// Crear el modelo a partir del esquema
export const PropertyMediaModel = model<PropertyMediaType>(
    "propertymedia",
    PropertyMedia
);