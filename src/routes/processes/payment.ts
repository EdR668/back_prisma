import express from "express";
import {
  createPayment,
  deletePayment,
  showPayment,
  showPayments,
  updatePayment,
} from "../../controllers/processes/payment";

const PaymentRouter = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Payments
 *     description: Operaciones relacionadas con pagos
 */

/**
 * @swagger
 * /api/payment:
 *   get:
 *     tags:
 *       - Payments
 *     summary: Obtener todos los pagos
 *     responses:
 *       '200':
 *         description: Lista de pagos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Payment'
 *       '404':
 *         description: No se encontraron pagos
 *   post:
 *     tags:
 *       - Payments
 *     summary: Crear un nuevo pago
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PaymentInput'
 *     responses:
 *       '201':
 *         description: Pago creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Payment'
 */
PaymentRouter.post("/", createPayment);
PaymentRouter.get("/", showPayments);

/**
 * @swagger
 * /api/payment/{id}:
 *   get:
 *     tags:
 *       - Payments
 *     summary: Obtener un pago por su ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Pago encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Payment'
 *       '404':
 *         description: Pago no encontrado
 *   patch:
 *     tags:
 *       - Payments
 *     summary: Actualizar un pago por su ID
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
 *             $ref: '#/components/schemas/PaymentInput'
 *     responses:
 *       '200':
 *         description: Pago actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Payment'
 *   delete:
 *     tags:
 *       - Payments
 *     summary: Eliminar un pago por su ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Pago eliminado exitosamente
 *       '404':
 *         description: Pago no encontrado
 */
PaymentRouter.patch("/:id", updatePayment);
PaymentRouter.delete("/:id", deletePayment);
PaymentRouter.get("/:id", showPayment);

export default PaymentRouter;

/**
 * @swagger
 * components:
 *   schemas:
 *     Payment:
 *       type: object
 *       properties:
 *         amount:
 *           type: number
 *         paymentDate:
 *           type: string
 *           format: date-time
 *         status:
 *           type: integer
 *         paymentMethod:
 *           type: integer
 *         receipt:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     PaymentInput:
 *       type: object
 *       properties:
 *         amount:
 *           type: number
 *         paymentDate:
 *           type: string
 *           format: date-time
 *         status:
 *           type: integer
 *         paymentMethod:
 *           type: integer
 *         receipt:
 *           type: string
 *       required:
 *         - amount
 *         - paymentDate
 *         - status
 *         - paymentMethod
 */
