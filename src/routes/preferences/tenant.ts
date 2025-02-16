import express from "express";
import {
  getTenantPreferenceById,
  getTenantPreferencesByTenant,
  createTenantPreference,
  updateTenantPreference,
  deleteTenantPreference,
} from "../../controllers/preferences/tenant";

const TenantPreferenceRouter = express.Router();

/**
 * @swagger
 * tags:
 *   - name: TenantPreferences
 *     description: Operaciones relacionadas con las preferencias de los inquilinos
 */

/**
 * @swagger
 * /api/tenant-preferences/{id}:
 *   get:
 *     tags:
 *       - TenantPreferences
 *     summary: Obtener una preferencia de inquilino por su ID
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
 *               $ref: '#/components/schemas/TenantPreference'
 *       '404':
 *         description: No se encontró la preferencia
 */
TenantPreferenceRouter.get("/:id", getTenantPreferenceById);

/**
 * @swagger
 * /api/tenant-preferences/tenant/{tenantId}:
 *   get:
 *     tags:
 *       - TenantPreferences
 *     summary: Obtener todas las preferencias de un inquilino por su ID
 *     parameters:
 *       - in: path
 *         name: tenantId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del inquilino
 *     responses:
 *       '200':
 *         description: Lista de preferencias del inquilino
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TenantPreference'
 *       '404':
 *         description: No se encontraron preferencias para el inquilino
 */
TenantPreferenceRouter.get("/tenant/:tenantId", getTenantPreferencesByTenant);

/**
 * @swagger
 * /api/tenant-preferences:
 *   post:
 *     tags:
 *       - TenantPreferences
 *     summary: Crear una nueva preferencia de inquilino
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TenantPreferenceInput'
 *     responses:
 *       '201':
 *         description: Preferencia creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TenantPreference'
 */
TenantPreferenceRouter.post("/", createTenantPreference);

/**
 * @swagger
 * /api/tenant-preferences/{id}:
 *   patch:
 *     tags:
 *       - TenantPreferences
 *     summary: Actualizar una preferencia de inquilino por su ID
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
 *             $ref: '#/components/schemas/TenantPreferenceInput'
 *     responses:
 *       '200':
 *         description: Preferencia actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TenantPreference'
 *       '404':
 *         description: No se encontró la preferencia
 */
TenantPreferenceRouter.patch("/:id", updateTenantPreference);

/**
 * @swagger
 * /api/tenant-preferences/{id}:
 *   delete:
 *     tags:
 *       - TenantPreferences
 *     summary: Eliminar una preferencia de inquilino por su ID
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
TenantPreferenceRouter.delete("/:id", deleteTenantPreference);

export default TenantPreferenceRouter;

/**
 * @swagger
 * components:
 *   schemas:
 *     TenantPreference:
 *       type: object
 *       properties:
 *         tenant:
 *           type: string
 *           description: ID del inquilino asociado a la preferencia.
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
 *     TenantPreferenceInput:
 *       type: object
 *       properties:
 *         tenant:
 *           type: string
 *           description: ID del inquilino.
 *         preferenceType:
 *           type: string
 *           description: Tipo de preferencia.
 *         preferenceValue:
 *           type: string
 *           description: Valor de la preferencia.
 */
