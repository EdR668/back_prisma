import express from "express";
import {
  getLandlordPreferenceById,
  getLandlordPreferencesByLandlord,
  createLandlordPreference,
  updateLandlordPreference,
  deleteLandlordPreference,
} from "../../controllers/preferences/landlord";

const LandlordPreferenceRouter = express.Router();

/**
 * @swagger
 * tags:
 *   - name: LandlordPreferences
 *     description: Operaciones relacionadas con las preferencias de los arrendatarios
 */

/**
 * @swagger
 * /api/landlord-preferences/{id}:
 *   get:
 *     tags:
 *       - LandlordPreferences
 *     summary: Obtener una preferencia de arrendatario por su ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la preferencia
 *     responses:
 *       '200':
 *         description: Preferencia encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LandlordPreference'
 *       '404':
 *         description: No se encontró la preferencia
 */
LandlordPreferenceRouter.get("/:id", getLandlordPreferenceById);

/**
 * @swagger
 * /api/landlord-preferences/landlord/{landlordId}:
 *   get:
 *     tags:
 *       - LandlordPreferences
 *     summary: Obtener todas las preferencias de un arrendatario por su ID
 *     parameters:
 *       - in: path
 *         name: landlordId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del arrendatario
 *     responses:
 *       '200':
 *         description: Lista de preferencias del arrendatario
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/LandlordPreference'
 *       '404':
 *         description: No se encontraron preferencias para el arrendatario
 */
LandlordPreferenceRouter.get("/landlord/:landlordId", getLandlordPreferencesByLandlord);

/**
 * @swagger
 * /api/landlord-preferences:
 *   post:
 *     tags:
 *       - LandlordPreferences
 *     summary: Crear una nueva preferencia de arrendatario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LandlordPreferenceInput'
 *     responses:
 *       '201':
 *         description: Preferencia creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LandlordPreference'
 */
LandlordPreferenceRouter.post("/", createLandlordPreference);

/**
 * @swagger
 * /api/landlord-preferences/{id}:
 *   patch:
 *     tags:
 *       - LandlordPreferences
 *     summary: Actualizar una preferencia de arrendatario por su ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la preferencia
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LandlordPreferenceInput'
 *     responses:
 *       '200':
 *         description: Preferencia actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LandlordPreference'
 *       '404':
 *         description: No se encontró la preferencia
 */
LandlordPreferenceRouter.patch("/:id", updateLandlordPreference);

/**
 * @swagger
 * /api/landlord-preferences/{id}:
 *   delete:
 *     tags:
 *       - LandlordPreferences
 *     summary: Eliminar una preferencia de arrendatario por su ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la preferencia
 *     responses:
 *       '200':
 *         description: Preferencia eliminada exitosamente
 *       '404':
 *         description: No se encontró la preferencia
 */
LandlordPreferenceRouter.delete("/:id", deleteLandlordPreference);

export default LandlordPreferenceRouter;

/**
 * @swagger
 * components:
 *   schemas:
 *     LandlordPreference:
 *       type: object
 *       properties:
 *         landlord:
 *           type: string
 *           description: ID del arrendatario (landlord) asociado a la preferencia.
 *         preferenceType:
 *           type: string
 *           description: Tipo de preferencia.
 *         preferenceValue:
 *           type: string
 *           description: Valor de la preferencia
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación.
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de última actualización.
 *     LandlordPreferenceInput:
 *       type: object
 *       properties:
 *         landlord:
 *           type: string
 *           description: ID del arrendatario (landlord).
 *         preferenceType:
 *           type: string
 *           description: Tipo de preferencia.
 *         preferenceValue:
 *           type: string
 *           description: Valor de la preferencia.
 */
