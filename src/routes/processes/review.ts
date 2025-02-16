import express from "express";
import {
  createReview,
  deleteReview,
  showReview,
  showReviews,
  updateReview,
} from "../../controllers/processes/review";

const ReviewRouter = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Reviews
 *     description: Operaciones relacionadas con reseñas
 */

/**
 * @swagger
 * /api/review:
 *   get:
 *     tags:
 *       - Reviews
 *     summary: Obtener todas las reseñas
 *     responses:
 *       '200':
 *         description: Lista de reseñas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Review'
 *       '404':
 *         description: No se encontraron reseñas
 *   post:
 *     tags:
 *       - Reviews
 *     summary: Crear una nueva reseña
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReviewInput'
 *     responses:
 *       '201':
 *         description: Reseña creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
 */
ReviewRouter.post("/", createReview);
ReviewRouter.get("/", showReviews);

/**
 * @swagger
 * /api/review/{id}:
 *   get:
 *     tags:
 *       - Reviews
 *     summary: Obtener una reseña por su ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Reseña encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
 *       '404':
 *         description: Reseña no encontrada
 *   patch:
 *     tags:
 *       - Reviews
 *     summary: Actualizar una reseña por su ID
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
 *             $ref: '#/components/schemas/ReviewInput'
 *     responses:
 *       '200':
 *         description: Reseña actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
 *   delete:
 *     tags:
 *       - Reviews
 *     summary: Eliminar una reseña por su ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Reseña eliminada exitosamente
 *       '404':
 *         description: Reseña no encontrada
 */
ReviewRouter.patch("/:id", updateReview);
ReviewRouter.delete("/:id", deleteReview);
ReviewRouter.get("/:id", showReview);

export default ReviewRouter;

/**
 * @swagger
 * components:
 *   schemas:
 *     Review:
 *       type: object
 *       properties:
 *         comment:
 *           type: string
 *         rating:
 *           type: number
 *           minimum: 0
 *           maximum: 10
 *         date:
 *           type: string
 *           format: date-time
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     ReviewInput:
 *       type: object
 *       properties:
 *         comment:
 *           type: string
 *         rating:
 *           type: number
 *           minimum: 0
 *           maximum: 10
 *         date:
 *           type: string
 *           format: date-time
 *       required:
 *         - rating
 *         - date
*/