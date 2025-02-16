import express from "express";
import {
  createTenant,
  updateTenant,
  deleteTenant,
  showTenant,
  showTenants,
} from "../../controllers/users/tenant";

const TenantRouter = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Tenants
 *     description: Operaciones relacionadas con los inquilinos
 */

/**
 * @swagger
 * /api/tenant:
 *   get:
 *     tags:
 *       - Tenants
 *     summary: Obtener todos los inquilinos
 *     responses:
 *       '200':
 *         description: Lista de inquilinos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Tenant'
 *       '404':
 *         description: No se encontraron inquilinos
 */
TenantRouter.get("/", showTenants);

/**
 * @swagger
 * /api/tenant/{id}:
 *   get:
 *     tags:
 *       - Tenants
 *     summary: Obtener un inquilino por su ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del inquilino
 *     responses:
 *       '200':
 *         description: Inquilino encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tenant'
 *       '404':
 *         description: No se encontró el inquilino
 */
TenantRouter.get("/:id", showTenant);

/**
 * @swagger
 * /api/tenant:
 *   post:
 *     tags:
 *       - Tenants
 *     summary: Crear un nuevo inquilino
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TenantInput'
 *     responses:
 *       '201':
 *         description: Inquilino creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tenant'
 */
TenantRouter.post("/", createTenant);

/**
 * @swagger
 * /api/tenant/{id}:
 *   patch:
 *     tags:
 *       - Tenants
 *     summary: Actualizar un inquilino por su ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del inquilino
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TenantInput'
 *     responses:
 *       '200':
 *         description: Inquilino actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tenant'
 *       '404':
 *         description: No se encontró el inquilino
 */
TenantRouter.patch("/:id", updateTenant);

/**
 * @swagger
 * /api/tenant/{id}:
 *   delete:
 *     tags:
 *       - Tenants
 *     summary: Eliminar un inquilino por su ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del inquilino
 *     responses:
 *       '200':
 *         description: Inquilino eliminado exitosamente
 *       '404':
 *         description: No se encontró el inquilino
 */
TenantRouter.delete("/:id", deleteTenant);

export default TenantRouter;

/**
 * @swagger
 * components:
 *   schemas:
 *     Tenant:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *           description: Número de cédula del inquilino
 *         authID:
 *           type: string
 *           description: ID de autenticación único
 *         idType:
 *           type: string
 *           description: Tipo de documento del inquilino
 *         firstName:
 *           type: string
 *           description: Nombre del inquilino
 *         lastName:
 *           type: string
 *           description: Apellido del inquilino
 *         gender:
 *           type: string
 *           description: Género del inquilino
 *           enum:
 *             - Masculino
 *             - Femenino
 *         phone:
 *           type: string
 *           description: Número de teléfono del inquilino
 *         email:
 *           type: string
 *           description: Correo electrónico del inquilino
 *         avatar:
 *           type: string
 *           description: URL del avatar del inquilino
 *         age:
 *           type: number
 *           description: Edad del inquilino
 *           minimum: 18
 *         maritalStatus:
 *           type: string
 *           description: Estado civil del inquilino
 *           enum:
 *             - Soltero
 *             - Casado
 *             - Viudo
 *             - Divorciado
 *             - Unión Libre
 *         salary:
 *           type: number
 *           description: Salario actual del inquilino
 *           minimum: 0
 *         contractType:
 *           type: string
 *           description: Tipo de contrato laboral del inquilino
 *         industry:
 *           type: string
 *           description: Industria en la que trabaja el inquilino
 *         avgRating:
 *           type: number
 *           description: Calificación promedio del inquilino
 *           minimum: 0
 *           maximum: 10
 *         previousContracts:
 *           type: number
 *           description: Número de contratos previos del inquilino
 *         avgContractDuration:
 *           type: number
 *           description: Duración promedio de contratos previos en meses
 *         isFamily:
 *           type: boolean
 *           description: Indica si el inquilino es parte de una familia
 *         tenure:
 *           type: number
 *           description: Antigüedad del inquilino en la plataforma en días
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de última actualización
 *     TenantInput:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *           description: Número de cédula del inquilino
 *         authID:
 *           type: string
 *           description: ID de autenticación único
 *         idType:
 *           type: string
 *           description: Tipo de documento del inquilino
 *         firstName:
 *           type: string
 *           description: Nombre del inquilino
 *         lastName:
 *           type: string
 *           description: Apellido del inquilino
 *         gender:
 *           type: string
 *           description: Género del inquilino
 *           enum:
 *             - Masculino
 *             - Femenino
 *         phone:
 *           type: string
 *           description: Número de teléfono del inquilino
 *         email:
 *           type: string
 *           description: Correo electrónico del inquilino
*/