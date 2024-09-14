import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import { errorHandler } from "../errorHandler";
import { addCart, changeQuantity, deleteCart, getCart } from "../controllers/cart";

const cartRoute:Router=Router()
cartRoute.post('/',authMiddleware,errorHandler(addCart))
cartRoute.delete('/:id',authMiddleware,errorHandler(deleteCart))
cartRoute.put('/:id',authMiddleware,errorHandler(changeQuantity))
cartRoute.get('/',authMiddleware,errorHandler(getCart))
export default cartRoute