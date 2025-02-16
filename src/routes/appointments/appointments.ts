import express from "express";
import { createAppointment, showAppointment, showAllThisYearAppointmentsByLandlord, showAllThisYearAppointmentsByTenant } from "../../controllers/appointment/appointment";

const AppointmentRouter = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Appointments
 *     description: Operaciones relacionadas con citas
*/

/**
 * @swagger
 * /api/appointment:
 *   post:
 *     tags:
 *       - Appointments
 *     summary: Crear una nueva cita
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Appointment'
 *     responses:
 *       '201':
 *         description: Cita creada exitosamente
 */


AppointmentRouter.post("/", createAppointment);

/**
 * @swagger
 * /api/appointment/{id}:
 *   get:
 *     tags:
 *       - Appointments
 *     summary: Obtener una cita por ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID de la cita
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Cita encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Appointment'
 *       '404':
 *         description: Cita no encontrada
 */


AppointmentRouter.get("/:id", showAppointment);


/**
 * @swagger
 * /api/appointment/landlord/{landLordAuthID}:
 *   get:
 *     tags:
 *       - Appointments
 *     summary: Obtener todas las citas de un arrendador en el año actual
 *     parameters:
 *       - name: landLordAuthID
 *         in: path
 *         required: true
 *         description: ID del arrendador
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Lista de citas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Appointment'
 */


AppointmentRouter.get("/landlord/:landLordAuthID", showAllThisYearAppointmentsByLandlord);

/**
 * @swagger
 * /api/appointment/tenant/{tenantAuthID}:
 *   get:
 *     tags:
 *       - Appointments
 *     summary: Obtener todas las citas de un arrendatario en el año actual
 *     parameters:
 *       - name: tenantAuthID
 *         in: path
 *         required: true
 *         description: ID del arrendatario
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Lista de citas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Appointment'
 */


AppointmentRouter.get("/tenant/:tenantAuthID", showAllThisYearAppointmentsByTenant);

export default AppointmentRouter;

/**
 * @swagger
 * components:
 *   schemas:
 *     Appointment:
 *       type: object
 *       properties:
 *         landLordAuthID:
 *           type: string
 *         tenantAuthID:
 *           type: string
 *         propertyID:
 *           type: string
 *         title:
 *           type: string
 *         date:
 *           type: string
 *         time:
 *           type: string
 *         description:
 *           type: string
 */



