import express from "express";
import {
  createLandlord,
  updateLandlord,
  deleteLandlord,
  showLandlord,
  showLandlords,
  getActiveTenantsByLandlord,
  validateMercadoPagoAccessToken,
  amountPaymentSubscription
} from "../../controllers/users/landlord";
import { showPropertiesAndCandidatesByLandlordId } from "../../controllers/properties/property";

const LandlordRouter = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Landlords
 *     description: Operaciones relacionadas con los arrendadores
 */

/**
 * @swagger
 * /api/landlord:
 *   get:
 *     tags:
 *       - Landlords
 *     summary: Obtener todos los arrendadores
 *     responses:
 *       '200':
 *         description: Lista de arrendadores
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Landlord'
 *       '404':
 *         description: No se encontraron arrendadores
 */
LandlordRouter.get("/", showLandlords);

/**
 * @swagger
 * /api/landlord/{id}:
 *   get:
 *     tags:
 *       - Landlords
 *     summary: Obtener un arrendador por su ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del arrendador
 *     responses:
 *       '200':
 *         description: Arrendador encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Landlord'
 *       '404':
 *         description: No se encontró el arrendador
 */
LandlordRouter.get("/:id", showLandlord);

/**
 * @swagger
 * /api/landlord:
 *   post:
 *     tags:
 *       - Landlords
 *     summary: Crear un nuevo arrendador
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LandlordInput'
 *     responses:
 *       '201':
 *         description: Arrendador creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Landlord'
 */
LandlordRouter.post("/", createLandlord);

/**
 * @swagger
 * /api/landlord/{id}:
 *   patch:
 *     tags:
 *       - Landlords
 *     summary: Actualizar un arrendador por su ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del arrendador
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LandlordInput'
 *     responses:
 *       '200':
 *         description: Arrendador actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Landlord'
 *       '404':
 *         description: No se encontró el arrendador
 */
LandlordRouter.patch("/:id", updateLandlord);

/**
 * @swagger
 * /api/landlord/{id}:
 *   delete:
 *     tags:
 *       - Landlords
 *     summary: Eliminar un arrendador por su ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del arrendador
 *     responses:
 *       '200':
 *         description: Arrendador eliminado exitosamente
 *       '404':
 *         description: No se encontró el arrendador
 */
LandlordRouter.delete("/:id", deleteLandlord);

/**
 * @swagger
 * /api/landlord/{id}/tenants/active:
 *   get:
 *     tags:
 *       - Landlords
 *     summary: Obtener los inquilinos activos de un arrendador por su ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del arrendador
 *     responses:
 *       '200':
 *         description: Lista de inquilinos activos
 *       '404':
 *         description: No se encontraron inquilinos activos
 */
LandlordRouter.get("/:id/tenants/active", getActiveTenantsByLandlord);

/**
 * @swagger
 * /api/property/landlord/{landlordId}:
 *   get:
 *     tags:
 *       - Properties
 *     summary: Obtener todas las propiedades y candidatos de un arrendador
 *     parameters:
 *       - in: path
 *         name: landlordId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Lista de propiedades y candidatos del arrendador
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 properties:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/PropertyWithMedia'
 *                 candidates:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Candidate'
 *       '404':
 *         description: No se encontraron propiedades o candidatos para el arrendador
 */
LandlordRouter.get("/:landlordId/candidates", showPropertiesAndCandidatesByLandlordId);

/**
 * @swagger
 * /api/landlord/mercado-pago/validate-access-token/{authID}:
 *   get:
 *     tags:
 *       - Landlords
 *     summary: Verificar si el landlord tiene un token de acceso de Mercado Pago
 *     parameters:
 *       - in: path
 *         name: authID
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del arrendador
 *     responses:
 *       '200':
 *         description: Validación exitosa
 *       '404':
 *         description: No se encuentra el token de acceso
 */
LandlordRouter.get("/mercado-pago/validate-access-token/:authID", validateMercadoPagoAccessToken);

/**
 * @swagger
 * /api/landlord/amount-payment-subscription:
 *   post:
 *     tags:
 *       - Landlords
 *     summary: Recuperar monto a pagar mensualmente por landlordId
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LandlordId'
 *     responses:
 *       '200':
 *         description: Monto a pagar mensualmente
 */
LandlordRouter.post("/amount-payment-subscription", amountPaymentSubscription);


export default LandlordRouter;

/**
 * @swagger
 * components:
 *   schemas:
 *     Landlord:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *           description: Número de cédula del arrendador
 *         authID:
 *           type: string
 *           description: ID de autenticación único
 *         firstName:
 *           type: string
 *           description: Nombre del arrendador
 *         lastName:
 *           type: string
 *           description: Apellido del arrendador
 *         gender:
 *           type: string
 *           description: Género del arrendador
 *           enum:
 *             - Masculino
 *             - Femenino
 *         phone:
 *           type: string
 *           description: Número de teléfono del arrendador
 *         email:
 *           type: string
 *           description: Correo electrónico del arrendador
 *         avatar:
 *           type: string
 *           description: URL del avatar del arrendador
 *         avgRating:
 *           type: number
 *           description: Calificación promedio del arrendador
 *           minimum: 0
 *           maximum: 10
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de última actualización
 *     LandlordInput:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *           description: Número de cédula del arrendador
 *         authID:
 *           type: string
 *           description: ID de autenticación único
 *         firstName:
 *           type: string
 *           description: Nombre del arrendador
 *         lastName:
 *           type: string
 *           description: Apellido del arrendador
 *         gender:
 *           type: string
 *           description: Género del arrendador
 *           enum:
 *             - Masculino
 *             - Femenino
 *         phone:
 *           type: string
 *           description: Número de teléfono del arrendador
 *         email:
 *           type: string
 *           description: Correo electrónico del arrendador
*/

/**
 * @swagger
 * components:
 *   schemas:
 *     LandlordId:
 *       type: object
 *       required:
 *         - landlordAuthID
 *       properties:
 *         landlordAuthID:
 *           type: string
 *           description: ID del arrendador
 *       example:
 *         landlordAuthID: "1"
 */