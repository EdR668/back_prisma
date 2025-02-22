import express from "express";
import { assignRole } from "../../controllers/auth/roles";
import { verifyProfile } from "../../controllers/auth/hasProfile";

const AuthRouter = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Operaciones relacionadas con autenticación y roles
 */

/**
 * @swagger
 * /api/auth/assignRole:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Asignar un rol a un usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: ID del usuario (Auth0) al que se le asignará el rol
 *               roleName:
 *                 type: string
 *                 description: Nombre del rol que se desea asignar
 *             required:
 *               - userId
 *               - roleName
 *     responses:
 *       '200':
 *         description: Rol asignado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensaje de éxito
 *       '400':
 *         description: Solicitud inválida (faltan parámetros requeridos)
 *       '404':
 *         description: Rol no encontrado
 *       '500':
 *         description: Error interno del servidor
 */
AuthRouter.post("/assignRole", assignRole);


/**
 * @swagger
 * /api/auth/verifyProfile:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Verificar si un usuario tiene un perfil
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: ID del usuario a verificar
 *             required:
 *               - userId
 *     responses:
 *       '200':
 *         description: Resultado de la verificación del perfil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 hasProfile:
 *                   type: boolean
 *                   description: Indica si el usuario tiene un perfil
 *                 role:
 *                   type: string
 *                   nullable: true
 *                   description: Rol del usuario (Tenant o Landlord) o `null` si no tiene perfil
 *       '500':
 *         description: Error en el servidor
 */
AuthRouter.post("/verifyProfile", verifyProfile);

export default AuthRouter;

/**
 * @swagger
 * components:
 *   schemas:
 *     AssignRoleRequest:
 *       type: object
 *       properties:
 *         userId:
 *           type: string
 *           description: ID del usuario (Auth0)
 *         roleName:
 *           type: string
 *           description: Nombre del rol
 *       required:
 *         - userId
 *         - roleName
 *     VerifyProfileRequest:
 *       type: object
 *       properties:
 *         userId:
 *           type: string
 *           description: ID del usuario a verificar
 *       required:
 *         - userId
 *     VerifyProfileResponse:
 *       type: object
 *       properties:
 *         hasProfile:
 *           type: boolean
 *           description: Indica si el usuario tiene un perfil
 *         role:
 *           type: string
 *           nullable: true
 *           description: Rol del usuario (Tenant o Landlord) o `null` si no tiene perfil
 */

