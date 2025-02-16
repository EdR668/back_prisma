import { InferSchemaType, model, Schema } from 'mongoose';

const Tenant = new Schema({
    // No existe una traducción para 'cedula', por eso id
    id: {
        type: Number,
        required: [true, 'El número de cedula es obligatorio'],
        trim: true,
        unique: true,
        min: [1111111, 'La cédula debe tener mínimo 7 dígitos'],
        max: [9999999999, 'La cédula debe tener máximo 10 dígitos'],
    },
    authID: {
        type: String,
        required: [true, "El id de autenticación es obligatorio"]
    },
    // tipo_identificacion
    idType: {
        type: String,
        required: [true, 'El tipo de documento es obligatorio'],
        minlength: [2, 'El tipo de documento debe tener mínimo 2 caracteres (CC, TI, PP, etc)'],
        maxlength: [4, 'El tipo de documento debe tener máximo 4 caracteres (C.C., T.I., P.P., etc)'],
    },
    firstName: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        minlength: [3, 'El nombre debe tener mínimo 3 caracteres'],
        maxlength: [50, 'El nombre debe tener máximo 50 caracteres'],
    },
    lastName: {
        type: String,
        required: [true, 'El apellido es obligatorio'],
        minlength: [3, 'El apellido debe tener mínimo 3 caracteres'],
        maxlength: [50, 'El apellido debe tener máximo 50 caracteres'],
    },
    avatar: {
        type: String,
    },
    phone: {
        type: String,
        required: [true, 'El número de teléfono es obligatorio'],
        match: [
            /^[0-9]{10,15}$/,
            'Por favor, ingrese un número de teléfono válido',
        ],
    },
    email: {
        type: String,
        required: [true, 'El correo electrónico es obligatorio'],
        lowercase: true,
        unique: true,
        match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            'Por favor, ingrese un correo electrónico válido',
        ],
    },
    age: {
        type: Number,
        required: [true, 'La edad es obligatoria'],
        min: [18, 'La edad mínima debe ser 18'],
    },
    // genero
    gender: {
        type: String,
        required: [true, 'El genero es obligatorio'],
        match: [
            /^(Masculino|Femenino)$/,
            'Por favor, ingrese un correo electrónico válido',
        ],
    },
    // estado_civil
    maritalStatus: {
        type: String,
        required: [true, 'El estado civil es obligatorio'],
        match: [
            /^(Soltero|Casado|Viudo|Divorciado|Unión Libre)$/,
            'Por favor, ingrese un correo electrónico válido',
        ],
    },
    // salario_actual
    salary: {
        type: Number,
        default: 0,
        min: [0, 'El salario del inquilino debe ser un número positivo'],
    },
    // tipo_contrato
    contractType: {
        type: String,
        minlength: [3, 'El tipo de contrato debe tener mínimo 3 caracteres'],
        maxlength: [50, 'El tipo de contrato debe tener máximo 50 caracteres'],
    },
    // industria
    industry: {
        type: String,
        minlength: [3, 'La industria debe tener mínimo 3 caracteres'],
        maxlength: [50, 'La industria debe tener máximo 50 caracteres'],
    },
    // calificacion_promedio
    avgRating: {
        type: Number,
        default: 0,
        min: [0, 'La calificación mínima del inquilino es 0'],
        max: [10, 'La calificación máxima del inquilino es 10'],
    },
    // contratos_previos
    previousContracts: {
        type: Number,
        default: 0,
        min: [0, 'El número de contratos debe ser un número positivo'],
    },
    ConctractsPer: {
        type: Number,
        default: 0,
        min: [0, 'El número de contratos debe ser un número positivo'],
    },
    // duracion_promedio_contrato - meses
    avgContractDuration: {
        type: Number,
        default: 0,
        min: [0, 'La duración promedio del contrato debe ser un número positivo'],
    },
    // clasificación - preguntar por diferencia a Juan con la calificacion_promedio
    rating: {
        type: String,
        default: "N/A", // Valor predeterminado para datos nuevos
        enum: ["A+", "A", "B", "C", "D", "E", "F", "N/A"], // Opciones válidas
        required: [true, "La calificación es obligatoria"],
    },
    // es_familia
    isFamily: {
        type: Boolean,
        default: false,
    },
    // antiguedad_plataforma - en días, aunque, sujeto a cambios
    tenure: {
        type: Number,
        default: 0,
        min: [0, 'Los días de antiguedad mínima deben ser 0'],
    },
},
    { timestamps: true }
);
type TenantType = InferSchemaType<typeof Tenant>
// Crear el modelo a partir del esquema
export const TenantModel = model<TenantType>(
    'tenant',
    Tenant
);