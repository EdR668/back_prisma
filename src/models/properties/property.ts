import { InferSchemaType, model, Schema } from 'mongoose';

const Property = new Schema({
    // arrendatario_id - FK
    landlordAuthID: {
        type: String,
        ref: 'landlord', // Referencia al modelo landlord
        required: [true, 'El authID del arrendatario es obligatorio'],
        trim: true,
    },
    // dirección
    address: {
        type: String,
        required: [true, 'La dirección es obligatoria'],
        maxlength: [200, 'La dirección debe tener máximo 200 caracteres'],
    },
    // municipio
    city: {
        type: String,
        required: [true, 'La ciudad es obligatoria'],
        minlength: [3, 'La ciudad debe tener mínimo 3 caracteres'],
        maxlength: [50, 'La ciudad debe tener máximo 50 caracteres'],
    },
    // departamento
    state: {
        type: String,
        required: [true, 'El departamento es obligatorio'],
        minlength: [3, 'El departamento debe tener mínimo 3 caracteres'],
        maxlength: [50, 'El departamento debe tener máximo 50 caracteres'],
    },
    // tipo
    type: {
        type: String,
        required: [true, 'El tipo de propiedad es obligatorio'],
        minlength: [3, 'El tipo debe tener mínimo 3 caracteres'],
        maxlength: [50, 'El tipo debe tener máximo 50 caracteres'],
    },
    // habitaciones
    rooms: {
        type: Number,
        required: [true, 'El número de habitaciones es obligatorio'],
        min: [0, 'El número de habitaciones debe ser un número positivo'],
    },
    // parqueadero
    parking: {
        type: Number,
        required: [true, 'El número de parqueaderos es obligatorio'],
        min: [0, 'El número de parqueaderos debe ser un número positivo'],
    },
    // metros_cuadrados
    squareMeters: {
        type: Number,
        required: [true, 'La cantidad de metros cuadrados es obligatoria'],
        min: [0, 'El número de metros cuadrados debe ser un número positivo'],
    },
    // estrato - la palabra más parecida sería tier (sujeto a cambios)
    tier: {
        type: Number,
        required: [true, 'El precio sugerido es obligatorio'],
        min: [0, 'El estrato mínimo debe ser 0'],
        max: [6, 'El estrato máximo debe ser 6'],
    },
    // cantidad_baños
    bathrooms: {
        type: Number,
        required: [true, 'El número de baños es obligatorio'],
        min: [0, 'El número de baños debe ser un número positivo'],
    },
    // antiguedad - por propositos de simplicidad el nombre más adecuado sería age
    age: {
        type: Number,
        required: [true, 'El número de baños es obligatorio'],
        min: [0, 'La edad del inmueble debe ser un número positivo'],
    },
    // numero_pisos
    floors: {
        type: Number,
        required: [true, 'El número de baños es obligatorio'],
        min: [0, 'El número de pisos debe ser un número positivo'],
    },
    // descripción
    description: {
        type: String,
        maxlength: [1000, 'La descripción máxima debe tener máximo 1000 caracteres'],
    },
    // Esta en busqueda de inquilino
    isAvailable: {
        type: Boolean,
        default: false,
        required: [true, 'El estado de disponibilidad es obligatorio'],
    },
    rentPrice: {
        type: Number,
        required: false,
        min: [0, 'El precio de arrendamiento debe ser un número positivo'],
    },
},
    { timestamps: true }
);
type PropertyType = InferSchemaType<typeof Property>
// Crear el modelo a partir del esquema
export const PropertyModel = model<PropertyType>(
    'property',
    Property
);