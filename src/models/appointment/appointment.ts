import { InferSchemaType, model, Schema } from 'mongoose';

const Appointment = new Schema({
    landLordAuthID: {
        type: Schema.Types.ObjectId,
        ref: 'landlord',
        required: [true, 'El authID del arrendador es obligatorio'],
        trim: true,
    },
    tenantAuthID: {
        type: Schema.Types.ObjectId,
        ref: 'tenant',
        required: [true, 'El authID del arrendatario es obligatorio'],
        trim: true,
    },
    propertyID: {
        type: Schema.Types.ObjectId,
        ref: 'property',
        required: [true, 'El ID de la propiedad es obligatorio'],
        trim: true,
    },
    title: {
        type: String,
        required: [true, 'El título de la cita es obligatorio'],
    },
    date: {
        type: Date,
        required: [true, 'La fecha de la cita es obligatoria'],
    },
    time: {
        type: String,
        required: [true, 'La hora de la cita es obligatoria'],
    },
    description: {
        type: String,
        required: [true, 'La descripción de la cita es obligatoria'],
    }
});

type AppointmentType = InferSchemaType<typeof Appointment>;
export const AppointmentModel = model<AppointmentType>('appointment', Appointment);

