import { Router } from "express";
import cartDetailsController from "../../controllers/cartDetailsTEST";

const router = Router();

router.get("/", cartDetailsController.get);






export default router;