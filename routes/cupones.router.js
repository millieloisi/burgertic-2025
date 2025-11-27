import Router from "express";
import CuponesController from "../controllers/cupones.controller.js";
import { verifyAdmin, verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

// Create coupon (admin only)
router.post("/", verifyToken, verifyAdmin, CuponesController.createCupon);

// List coupons (admin)
router.get("/", verifyToken, verifyAdmin, CuponesController.listCupones);

// Public: validate coupon by code
router.get("/validate/:codigo", CuponesController.validateCupon);

export default router;
