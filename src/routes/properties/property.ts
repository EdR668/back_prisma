import express from "express";
import {
  createProperty,
  deleteProperty,
  showProperty,
  showProperties,
  showPropertiesByUser,
  updateProperty,
  showAvailableProperties,
  showAvailablePropertiesWithoutFilters,
  showPropertiesAndCandidatesByLandlordId,
  setPropertyOnSearch
} from "../../controllers/properties/property";

const PropertyRouter = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Properties
 *     description: Operaciones relacionadas con propiedades
 */

/**
 * @swagger
 * /api/property:
 *   get:
 *     tags:
 *       - Properties
 *     summary: Obtener todas las propiedades
 *     responses:
 *       '200':
 *         description: Lista de propiedades
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Property'
 *       '404':
 *         description: No se encontraron propiedades
 *   post:
 *     tags:
 *       - Properties
 *     summary: Crear una nueva propiedad
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PropertyInput'
 *     responses:
 *       '201':
 *         description: Propiedad creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Property'
 */
PropertyRouter.post("/", createProperty);
PropertyRouter.get("/", showProperties);

/**
 * @swagger
 * /api/property/available:
 *   post:
 *     summary: Obtiene propiedades disponibles con filtros personalizados
 *     tags:
 *       - Properties
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               address:
 *                 type: string
 *                 description: Dirección parcial o completa (búsqueda con regex)
 *               city:
 *                 type: string
 *                 description: Ciudad de la propiedad (búsqueda con regex)
 *               state:
 *                 type: string
 *                 description: Estado o departamento (búsqueda con regex)
 *               type:
 *                 type: string
 *                 
 *               rooms:
 *                 type: integer
 *                 description: Número de habitaciones (búsqueda exacta)
 *               parking:
 *                 type: integer
 *                 description: Número de parqueaderos
 *               squareMeters:
 *                 type: integer
 *                 description: Área en metros cuadrados
 *               tier:
 *                 type: integer
 *                 description: Nivel socioeconómico
 *               bathrooms:
 *                 type: integer
 *                 description: Número de baños
 *               age:
 *                 type: integer
 *                 description: Antigüedad de la propiedad en años
 *               floors:
 *                 type: integer
 *                 description: Número de pisos
 *               isAvailable:
 *                 type: boolean
 *                 description: Indica si la propiedad está disponible
 *     responses:
 *       200:
 *         description: Lista de propiedades filtradas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: ID de la propiedad
 *                   address:
 *                     type: string
 *                     description: Dirección de la propiedad
 *                   city:
 *                     type: string
 *                     description: Ciudad de la propiedad
 *                   state:
 *                     type: string
 *                     description: Estado o departamento
 *                   type:
 *                     type: string
 *                     description: Tipo de propiedad
 *                   rooms:
 *                     type: integer
 *                   parking:
 *                     type: integer
 *                   squareMeters:
 *                     type: integer
 *                   tier:
 *                     type: integer
 *                   bathrooms:
 *                     type: integer
 *                   age:
 *                     type: integer
 *                   floors:
 *                     type: integer
 *                   isAvailable:
 *                     type: boolean
 *                   propertyMedia:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         mediaUrl:
 *                           type: string
 *                           description: URL de la imagen o video
 *                         mediaType:
 *                           type: string
 *                           description: Tipo de media (imagen/video)
 *                         description:
 *                           type: string
 *                           description: Descripción del archivo
 *                         uploadDate:
 *                           type: string
 *                           format: date-time
 *       404:
 *         description: No se encontraron propiedades
 *       500:
 *         description: Error interno del servidor
 */
PropertyRouter.post("/available", showAvailableProperties);


/**
 * @swagger
 * /api/property/available/no-filters:
 *   get:
 *     summary: Obtiene todas las propiedades disponibles sin aplicar filtros
 *     tags:
 *       - Properties
 *     responses:
 *       200:
 *         description: Lista de propiedades disponibles con sus medios asociados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: ID de la propiedad
 *                   address:
 *                     type: string
 *                     description: Dirección de la propiedad
 *                   city:
 *                     type: string
 *                   state:
 *                     type: string
 *                   type:
 *                     type: string
 *                   rooms:
 *                     type: integer
 *                   parking:
 *                     type: integer
 *                   squareMeters:
 *                     type: integer
 *                   tier:
 *                     type: integer
 *                   bathrooms:
 *                     type: integer
 *                   age:
 *                     type: integer
 *                   floors:
 *                     type: integer
 *                   isAvailable:
 *                     type: boolean
 *                     description: Indica si la propiedad está disponible
 *                   media:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         mediaUrl:
 *                           type: string
 *                           description: URL de la imagen o video
 *                         mediaType:
 *                           type: string
 *                           description: Tipo de media (imagen/video)
 *                         description:
 *                           type: string
 *                         uploadDate:
 *                           type: string
 *                           format: date-time
 *       404:
 *         description: No se encontraron propiedades
 *       500:
 *         description: Error interno del servidor
 */

PropertyRouter.get("/available/no-filters", showAvailablePropertiesWithoutFilters);

/**
 * @swagger
 * /api/property/user/{userId}:
 *   get:
 *     tags:
 *       - Properties
 *     summary: Obtener todas las propiedades de un usuario
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Lista de propiedades del usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PropertyWithMedia'
 *       '404':
 *         description: No se encontraron propiedades para el usuario
 */
PropertyRouter.get("/user/:userId", showPropertiesByUser);

/**
 * @swagger
 * /api/property/{id}:
 *   get:
 *     tags:
 *       - Properties
 *     summary: Obtener una propiedad por su ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Propiedad encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PropertyWithMediaAndContract'
 *       '404':
 *         description: Propiedad no encontrada
 *   patch:
 *     tags:
 *       - Properties
 *     summary: Actualizar una propiedad por su ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PropertyInput'
 *     responses:
 *       '200':
 *         description: Propiedad actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Property'
 *   delete:
 *     tags:
 *       - Properties
 *     summary: Eliminar una propiedad por su ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Propiedad eliminada exitosamente
 *       '404':
 *         description: Propiedad no encontrada
 */
PropertyRouter.patch("/:id", updateProperty);
PropertyRouter.delete("/:id", deleteProperty);
PropertyRouter.get("/:id", showProperty);
PropertyRouter.get("/landlord/:landlordId", showPropertiesAndCandidatesByLandlordId);
PropertyRouter.patch("/onSearch/:id", setPropertyOnSearch);

export default PropertyRouter;
/**
 * @swagger
 * components:
 *   schemas:
 *     Property:
 *       type: object
 *       properties:
 *         landlordAuthID:
 *           type: string
 *           description: El ID de autenticación del arrendatario (authID), referencia al modelo landlord.
 *         address:
 *           type: string
 *           description: Dirección de la propiedad.
 *         city:
 *           type: string
 *           description: Ciudad donde se encuentra la propiedad.
 *         state:
 *           type: string
 *           description: Departamento donde se encuentra la propiedad.
 *         type:
 *           type: string
 *           description: Tipo de propiedad (e.g., apartamento, casa, etc.).
 *         rooms:
 *           type: integer
 *           description: Número de habitaciones.
 *         parking:
 *           type: integer
 *           description: Número de espacios de parqueadero.
 *         squareMeters:
 *           type: number
 *           description: Metros cuadrados de la propiedad.
 *         tier:
 *           type: integer
 *           description: Estrato de la propiedad (entre 0 y 6).
 *         bathrooms:
 *           type: integer
 *           description: Número de baños.
 *         age:
 *           type: integer
 *           description: Antigüedad de la propiedad en años.
 *         floors:
 *           type: integer
 *           description: Número de pisos de la propiedad.
 *         description:
 *           type: string
 *           description: Descripción detallada de la propiedad.
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación del registro.
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de la última actualización del registro.
 *     PropertyWithMedia:
 *       allOf:
 *         - $ref: '#/components/schemas/Property'
 *         - type: object
 *           properties:
 *             media:
 *               type: array
 *               description: Lista de medios asociados a la propiedad.
 *               items:
 *                 type: object
 *                 properties:
 *                   mediaType:
 *                     type: string
 *                     description: Tipo de archivo multimedia (e.g., imagen, video).
 *                   mediaUrl:
 *                     type: string
 *                     description: URL del archivo multimedia.
 *                   description:
 *                     type: string
 *                     description: Descripción del archivo multimedia.
 *                   uploadDate:
 *                     type: string
 *                     format: date-time
 *                     description: Fecha de subida del archivo multimedia.
 *     PropertyWithMediaAndContract:
 *       allOf:
 *         - $ref: '#/components/schemas/PropertyWithMedia'
 *         - type: object
 *           properties:
 *             contract:
 *               type: object
 *               description: Información del contrato asociado a la propiedad.
 *               properties:
 *                 tenant:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       description: Nombre del inquilino.
 *                     email:
 *                       type: string
 *                       description: Correo electrónico del inquilino.
 *                 startDate:
 *                   type: string
 *                   format: date-time
 *                   description: Fecha de inicio del contrato.
 *                 endDate:
 *                   type: string
 *                   format: date-time
 *                   description: Fecha de finalización del contrato.
 *                 monthlyRent:
 *                   type: number
 *                   description: Monto del alquiler mensual.
 *                 status:
 *                   type: string
 *                   description: Estado del contrato (e.g., activo, finalizado).
 */
