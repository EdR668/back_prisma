import { InferSchemaType, model, Schema } from 'mongoose';

// propiedad_media
const ApplicationReference = new Schema({
    // propiedad_id - FK
    application: {
        type: Schema.Types.ObjectId,
        ref: 'application',
        required: [true, 'El id de la aplicación es obligatorio'],
    },
    // tipo_media
    name: {
        type: String,
        required: [true, 'El tipo de documento del contrato es obligatorio'],
    },
    lastname: {
        type: String,
        required: [true, 'El tipo de documento del contrato es obligatorio'],
    },
    // url_media
    cellphone: {
        type: String,
        required: [true, 'El estado del contrato es obligatorio'],
    },
    // descripción
    relationship: {
        type: String,
        required: [true, 'El estado del contrato es obligatorio'],
    },
},
    { timestamps: true }
);
type ApplicationReferenceType = InferSchemaType<typeof ApplicationReference>
// Crear el modelo a partir del esquema
export const ApplicationReferenceModel = model<ApplicationReferenceType>(
    "application_ref",
    ApplicationReference
);