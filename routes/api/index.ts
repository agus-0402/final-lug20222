import { Router } from "express";
import productsRoutes from "./productos"
import cartRoutes from "./cart"




const router = Router();

router.use("/productos", productsRoutes)
router.use("/carrito", cartRoutes)





export default router;
