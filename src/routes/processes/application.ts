import express from "express";
import {
  createApplication,
  deleteApplication,
  getApplicationsByTenant,
  showApplication,
  showApplications,
  showApplicationsByProperty,
  updateApplication,
  updateApplicationStatus,
} from "../../controllers/processes/application";

const ApplicationRouter = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Applications
 *     description: Operaciones relacionadas con aplicaciones
 */

/**
 * @swagger
 * /api/application:
 *   get:
 *     tags:
 *       - Applications
 *     summary: Obtener todas las aplicaciones
 *     responses:
 *       '200':
 *         description: Lista de aplicaciones
 *   post:
 *     tags:
 *       - Applications
 *     summary: Crear una nueva aplicación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ApplicationInput'
 *     responses:
 *       '201':
 *         description: Aplicación creada exitosamente
 */
ApplicationRouter.post("/", createApplication);
ApplicationRouter.get("/", showApplications);

/**
 * @swagger
 * /api/application/{id}:
 *   get:
 *     tags:
 *       - Applications
 *     summary: Obtener una aplicación por su ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Aplicación encontrada
 *   patch:
 *     tags:
 *       - Applications
 *     summary: Actualizar una aplicación por su ID
 *   delete:
 *     tags:
 *       - Applications
 *     summary: Eliminar una aplicación por su ID
 */
ApplicationRouter.patch("/:id", updateApplication);
ApplicationRouter.delete("/:id", deleteApplication);
ApplicationRouter.get("/:id", showApplication);

/**
 * @swagger
 * /api/application/property/{id}:
 *   get:
 *     tags:
 *       - Applications
 *     summary: Obtener aplicaciones por propiedad
 */
ApplicationRouter.get("/property/:id", showApplicationsByProperty);

/**
 * @swagger
 * /api/application/tenant/{id}:
 *   get:
 *     tags:
 *       - Applications
 *     summary: Obtener aplicaciones por inquilino
 */
ApplicationRouter.get("/tenant/:id", getApplicationsByTenant);

/**
 * @swagger
 * /api/application/status/{id}:
 *   patch:
 *     tags:
 *       - Applications
 *     summary: Actualizar el estado de una aplicación
 */
ApplicationRouter.patch("/status/:id", updateApplicationStatus);

export default ApplicationRouter;

/**
 * @swagger
 * components:
 *   schemas:
 *     Application:
 *       type: object
 *       properties:
 *         property:
 *           type: string
 *         tenantAuthID:
 *           type: string
 *         personalDescription:
 *           type: string
 *         status:
 *           type: number
 *         score:
 *           type: number
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     ApplicationInput:
 *       type: object
 *       properties:
 *         property:
 *           type: string
 *         tenantAuthID:
 *           type: string
 *         personalDescription:
 *           type: string
 *         status:
 *           type: number
 *         score:
 *           type: number
 *       required:
 *         - property
 *         - tenantAuthID
 *         - personalDescription
 *         - status
 */
