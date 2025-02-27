import express from "express";
import { 
    CreatePreference,
    MercadoPagoCallback,
    CreateLandlordPreference,
 } from "../../controllers/mercado_pago/mercado_pago";
const MercadoPagoRouter = express.Router();

/**
 * @swagger
 * tags:
 *   - name: MercadoPago Preference
 *     description: Operaciones relacionadas con MercadoPago Preference
*/

/**
 * @swagger
 * /api/mercado-pago/create-preference:
 *   post:
 *     tags:
 *       - MercadoPago Preference
 *     summary: Crear una preferencia de pago
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Preference'
 *     responses:
 *       '201':
 *         description: Preferencia de pago creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 init_point:
 *                   type: string
 *                   description: URL de Mercado Pago para realizar el pago
 *                   example: "https://www.mercadopago.com/checkout/v1/payment"
 *       '400':
 *         description: Error en la solicitud (parámetros incorrectos)
 *       '500':
 *         description: Error interno del servidor
 */
MercadoPagoRouter.post("/create-preference", CreatePreference);

MercadoPagoRouter.get("/callback", MercadoPagoCallback);

/**
 * @swagger
 * /api/mercado-pago/create-landlord-preference:
 *   post:
 *     tags:
 *       - MercadoPago Preference
 *     summary: Crear una preferencia de pago para la subscripción del arrendador
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LandlordPreference'
 *     responses:
 *       '201':
 *         description: Preferencia de pago creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 init_point:
 *                   type: string
 *                   description: URL de Mercado Pago para realizar el pago
 *                   example: "https://www.mercadopago.com/checkout/v1/payment"
 *       '400':
 *         description: Error en la solicitud (parámetros incorrectos)
 *       '500':
 *         description: Error interno del servidor
 */

MercadoPagoRouter.post("/create-landlord-preference", CreateLandlordPreference);

export default MercadoPagoRouter;

/**
 * @swagger
 * components:
 *   schemas:
 *     Preference:
 *       type: object
 *       required:
 *         - contractId
 *         - tenantId
 *       properties:
 *         contractId:
 *           type: string
 *           description: ID del contrato
 *         tenantId:
 *           type: string
 *           description: ID del inquilino
 *       example:
 *         contractId: "1"
 *         tenantId: "1"
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     LandlordPreference:
 *       type: object
 *       required:
 *         - landlordId
 *       properties:
 *         landlordId:
 *           type: string
 *           description: ID del arrendador
 *       example:
 *         landlordId: "1"
 */



