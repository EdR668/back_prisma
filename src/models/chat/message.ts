import { InferSchemaType, model, Schema } from 'mongoose';

// soporte_contrato
const Message = new Schema({
    // conversacion_id - FK
    conversation: {
        type: Schema.Types.ObjectId,
        ref: 'conversation',
        required: [true, 'El id de la conversación es obligatorio'],
    },
    // contenido
    content: {
        type: String,
        maxlength: [1000, 'El contenido del mensaje debe tener máximo 1000 caracteres'],
    },
    // fecha_envio
    sentDate: {
        type: Date,
        required: [true, 'La fecha de inicio es obligatoria'],
    },
},
    { timestamps: true }
);
type MessageType = InferSchemaType<typeof Message>
// Crear el modelo a partir del esquema
export const MessageModel = model<MessageType>(
    "message",
    Message
);