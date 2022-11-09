import { Router } from "express";

import productsRoutes from "./productos"
import cartRoutes from "./cart"
import cartDetalsRoutes from './cartDetails'



const router = Router();

router.use("/productos", productsRoutes)
router.use("/carrito", cartRoutes)
router.use("/carrito-details", cartDetalsRoutes)




export default router;
