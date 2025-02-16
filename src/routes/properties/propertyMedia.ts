import express from "express";
import {
  createPropertyMedia,
  deletePropertyMedia,
  showPropertyMedia,
  showPropertyMedias,
  updatePropertyMedia,
} from "../../controllers/properties/propertyMedia";

const PropertyMediaRouter = express.Router();

/**
 * @swagger
 * tags:
 *   - name: PropertyMedia
 *     description: Operaciones relacionadas con medios de propiedades
 */

/**
 * @swagger
 * /api/propertymedia:
 *   get:
 *     tags:
 *       - PropertyMedia
 *     summary: Obtener todos los medios de propiedades
 *     responses:
 *       '200':
 *         description: Lista de medios de propiedades
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PropertyMedia'
 *       '404':
 *         description: No se encontraron medios
 *   post:
 *     tags:
 *       - PropertyMedia
 *     summary: Crear un nuevo medio de propiedad
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PropertyMediaInput'
 *     responses:
 *       '201':
 *         description: Medio de propiedad creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PropertyMedia'
 */
PropertyMediaRouter.post("/", createPropertyMedia);
PropertyMediaRouter.get("/", showPropertyMedias);

/**
 * @swagger
 * /api/propertymedia/{id}:
 *   get:
 *     tags:
 *       - PropertyMedia
 *     summary: Obtener un medio de propiedad por su ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Medio de propiedad encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PropertyMedia'
 *       '404':
 *         description: Medio no encontrado
 *   patch:
 *     tags:
 *       - PropertyMedia
 *     summary: Actualizar un medio de propiedad por su ID
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
 *             $ref: '#/components/schemas/PropertyMediaInput'
 *     responses:
 *       '200':
 *         description: Medio de propiedad actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PropertyMedia'
 *   delete:
 *     tags:
 *       - PropertyMedia
 *     summary: Eliminar un medio de propiedad por su ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Medio de propiedad eliminado exitosamente
 *       '404':
 *         description: Medio no encontrado
 */
PropertyMediaRouter.patch("/:id", updatePropertyMedia);
PropertyMediaRouter.delete("/:id", deletePropertyMedia);
PropertyMediaRouter.get("/:id", showPropertyMedia);

export default PropertyMediaRouter;

/**
 * @swagger
 * components:
 *   schemas:
 *     PropertyMedia:
 *       type: object
 *       properties:
 *         mediaType:
 *           type: string
 *         mediaUrl:
 *           type: string
 *         description:
 *           type: string
 *         uploadDate:
 *           type: string
 *           format: date-time
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     PropertyMediaInput:
 *       type: object
 *       properties:
 *         mediaType:
 *           type: string
 *         mediaUrl:
 *           type: string
 *         description:
 *           type: string
 *         uploadDate:
 *           type: string
 *           format: date-time
 *       required:
 *         - mediaType
 *         - mediaUrl
 *         - uploadDate
*/