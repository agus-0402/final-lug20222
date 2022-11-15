import { Router } from "express";
import productsController from "../../controllers/producto";

const router = Router();

router.post("/", productsController.add);
router.get("/", productsController.get);
router.delete("/", productsController.delete);
router.put("/", productsController.update);

export default router;