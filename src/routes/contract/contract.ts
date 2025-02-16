import express from "express";
import {
  getAllContracts,
  getContractById,
  getContractsByProperty,
  getContractsByPropertyAndUser,
  updateContract,
  deleteContract,
  createContract,
  getContractsByTenant,
  getActiveContractsByTenant,
} from "../../controllers/contract/contract";

const ContractRouter = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Contracts
 *     description: Operaciones relacionadas con contratos
 */

/**
 * @swagger
 * /api/contracts:
 *   get:
 *     tags:
 *       - Contracts
 *     summary: Obtener todos los contratos
 *     responses:
 *       '200':
 *         description: Lista de contratos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Contract'
 */
ContractRouter.get("/", getAllContracts);

/**
 * @swagger
 * /api/contracts:
 *   post:
 *     tags:
 *       - Contracts
 *     summary: Crear un contrato
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ContractInput'
 *     responses:
 *       '201':
 *         description: Contrato creado exitosamente
 */
ContractRouter.post("/", createContract);

/**
 * @swagger
 * /api/contracts/{id}:
 *   get:
 *     tags:
 *       - Contracts
 *     summary: Obtener un contrato por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Contrato encontrado
 *       '404':
 *         description: Contrato no encontrado
 */
ContractRouter.get("/:id", getContractById);

/**
 * @swagger
 * /api/contracts/tenant/{id}:
 *   get:
 *     tags:
 *       - Contracts
 *     summary: Obtener contratos por inquilino
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Lista de contratos del inquilino
 *       '404':
 *         description: No se encontraron contratos
 */
ContractRouter.get("/tenant/:id", getContractsByTenant);

/**
 * @swagger
 * /api/contracts/tenant/active/{id}:
 *   get:
 *     tags:
 *       - Contracts
 *     summary: Obtener contratos activos por inquilino
 */
ContractRouter.get("/tenant/active/:id", getActiveContractsByTenant);

/**
 * @swagger
 * /api/contracts/property/{propertyId}:
 *   get:
 *     tags:
 *       - Contracts
 *     summary: Obtener contratos por propiedad
 */
ContractRouter.get("/property/:propertyId", getContractsByProperty);

/**
 * @swagger
 * /api/contracts/property/{propertyId}/user/{tenantId}:
 *   get:
 *     tags:
 *       - Contracts
 *     summary: Obtener contratos por propiedad y usuario
 */
ContractRouter.get("/property/:propertyId/user/:tenantId", getContractsByPropertyAndUser);

/**
 * @swagger
 * /api/contracts/{id}:
 *   put:
 *     tags:
 *       - Contracts
 *     summary: Actualizar un contrato
 */
ContractRouter.put("/:id", updateContract);

/**
 * @swagger
 * /api/contracts/{id}:
 *   delete:
 *     tags:
 *       - Contracts
 *     summary: Eliminar un contrato
 */
ContractRouter.delete("/:id", deleteContract);

export default ContractRouter;

/**
 * @swagger
 * components:
 *   schemas:
 *     Contract:
 *       type: object
 *       properties:
 *         propertyId:
 *           type: string
 *         tenant:
 *           type: string
 *         startDate:
 *           type: string
 *           format: date
 *         endDate:
 *           type: string
 *           format: date
 *         monthlyRent:
 *           type: number
 *         status:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     ContractInput:
 *       type: object
 *       properties:
 *         propertyId:
 *           type: string
 *         tenant:
 *           type: string
 *         startDate:
 *           type: string
 *           format: date
 *         endDate:
 *           type: string
 *           format: date
 *         monthlyRent:
 *           type: number
 *         status:
 *           type: string
 */
