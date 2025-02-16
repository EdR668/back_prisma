import { InferSchemaType, model, Schema } from 'mongoose';

const Notification = new Schema({
    // inquilino_id - FK
    tenant: {
        type: Schema.Types.ObjectId,
        ref: 'tenant',
        required: [true, 'El id del inquilino es obligatorio'],
    },
    // propietario_id - FK
    landlord: {
        type: Schema.Types.ObjectId,
        ref: 'landlord',
        required: [true, 'El id del arrendatario es obligatorio'],
    },
    // mensaje - longitud del mensaje?
    message: {
        type: String,
        required: [true, 'El mensaje es obligatorio'],
        maxlength: [1000, 'La descripción máxima debe tener máximo 1000 caracteres'],
    },
    // prioridad - códigos de la prioridad?
    priority: {
        type: Number,
        required: [true, 'La prioridad es obligatoria'],
        default: 0,
        min: [0, 'El código de prioridad debe ser un número positivo'],
    },
    // estado - definir cuáles son los códigos de estado para determinar la longitud
    status: {
        type: Number,
        required: [true, 'El estado de la notificación es obligatorio'],
        default: 0,
        min: [0, 'El código de estado debe ser un número positivo'],
    },
    // fecha_envio
    sentDate: {
        type: Date,
        required: [true, 'La fecha de envío es obligatoria'],
    },
    // fecha_lectura
    readDate: {
        type: Date,
    },
},
    { timestamps: true }
);
type NotificationType = InferSchemaType<typeof Notification>
// Crear el modelo a partir del esquema
export const NotificationModel = model<NotificationType>(
    'notification',
    Notification
);