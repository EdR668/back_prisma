import express from "express";
import UserRouter from "./users/user";
import ContractRouter from "./contract/contract";
import TenantRouter from "./users/tenant";
import PropertyRouter from  "./properties/property";
import PropertyMediaRouter from  "./properties/propertyMedia";
import ApplicationRouter from "./processes/application";
import PaymentRouter from "./processes/payment";
import RepairRouter from "./processes/repair";
import ReviewRouter from "./processes/review";
import AuthRouter from "./auth/auth";
import LandlordRouter from "./users/landlord";
import TenantPreferenceRouter from "./preferences/tenant";
import AppointmentRouter from "./appointments/appointments";



const router = express.Router();

router.use("/user", UserRouter);
router.use("/tenant", TenantRouter);
router.use("/landlord", LandlordRouter);
router.use("/property", PropertyRouter);
router.use("/propertyMedia", PropertyMediaRouter);
router.use("/application", ApplicationRouter);
router.use("/contract", ContractRouter);
router.use("/payment", PaymentRouter);
router.use("/repair", RepairRouter);
router.use("/review", ReviewRouter);
router.use("/auth", AuthRouter);
router.use("/tenant-preferences", TenantPreferenceRouter);
router.use("/landlord-preferences", TenantPreferenceRouter);
router.use("/contracts", ContractRouter);
router.use("/appointment", AppointmentRouter);
export default router;