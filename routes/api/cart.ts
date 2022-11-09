import { Router } from "express";
import cartController from "../../controllers/cart";

const router = Router();

router.post("/", cartController.add);
router.get("/", cartController.get);
router.delete("/", cartController.delete);






export default router;