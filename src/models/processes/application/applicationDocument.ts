import { InferSchemaType, model, Schema } from 'mongoose';

// propiedad_media
const ApplicationMedia = new Schema({
    // propiedad_id - FK
    application: {
        type: Schema.Types.ObjectId,
        ref: 'application',
        required: [true, 'El id de la aplicación es obligatorio'],
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
    type: {
        type: String,
        enum: ['Documento de identidad', 'Certificado laboral', 'Soporte pago nómina', 'Extractos bancarios'],
        maxlength: [100, 'La descripción máxima debe tener máximo 100 caracteres'],
    },
},
    { timestamps: true }
);
type ApplicationMediaType = InferSchemaType<typeof ApplicationMedia>
// Crear el modelo a partir del esquema
export const ApplicationMediaModel = model<ApplicationMediaType>(
    "application_media",
    ApplicationMedia
);