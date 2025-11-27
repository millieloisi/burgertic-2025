import Router from "express";
import ImagenesController from "../controllers/producto_imagenes.controller.js";
import { verifyToken, verifyAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/:id_plato", ImagenesController.getImages);
router.post("/", verifyToken, verifyAdmin, ImagenesController.addImage);
router.delete("/:id", verifyToken, verifyAdmin, ImagenesController.deleteImage);

export default router;
