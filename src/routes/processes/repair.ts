import express from "express";
import {
  createRepair,
  deleteRepair,
  showRepair,
  showRepairs,
  updateRepair,
} from "../../controllers/processes/repair";

const RepairRouter = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Repairs
 *     description: Operaciones relacionadas con reparaciones
 */

/**
 * @swagger
 * /api/repair:
 *   get:
 *     tags:
 *       - Repairs
 *     summary: Obtener todas las reparaciones
 *     responses:
 *       '200':
 *         description: Lista de reparaciones
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Repair'
 *       '404':
 *         description: No se encontraron reparaciones
 *   post:
 *     tags:
 *       - Repairs
 *     summary: Crear una nueva reparación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RepairInput'
 *     responses:
 *       '201':
 *         description: Reparación creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Repair'
 */
RepairRouter.post("/", createRepair);
RepairRouter.get("/", showRepairs);

/**
 * @swagger
 * /api/repair/{id}:
 *   get:
 *     tags:
 *       - Repairs
 *     summary: Obtener una reparación por su ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Reparación encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Repair'
 *       '404':
 *         description: Reparación no encontrada
 *   patch:
 *     tags:
 *       - Repairs
 *     summary: Actualizar una reparación por su ID
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
 *             $ref: '#/components/schemas/RepairInput'
 *     responses:
 *       '200':
 *         description: Reparación actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Repair'
 *   delete:
 *     tags:
 *       - Repairs
 *     summary: Eliminar una reparación por su ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Reparación eliminada exitosamente
 *       '404':
 *         description: Reparación no encontrada
 */
RepairRouter.patch("/:id", updateRepair);
RepairRouter.delete("/:id", deleteRepair);
RepairRouter.get("/:id", showRepair);

export default RepairRouter;

/**
 * @swagger
 * components:
 *   schemas:
 *     Repair:
 *       type: object
 *       properties:
 *         description:
 *           type: string
 *         priority:
 *           type: number
 *         status:
 *           type: number
 *         reportDate:
 *           type: string
 *           format: date-time
 *         resolutionDate:
 *           type: string
 *           format: date-time
 *         cost:
 *           type: number
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     RepairInput:
 *       type: object
 *       properties:
 *         description:
 *           type: string
 *         priority:
 *           type: number
 *         status:
 *           type: number
 *         reportDate:
 *           type: string
 *           format: date-time
 *         resolutionDate:
 *           type: string
 *           format: date-time
 *         cost:
 *           type: number
 *       required:
 *         - description
 *         - priority
 *         - status
 *         - reportDate
*/