import { Router } from "express";
import { createProduct, deleteProduct, findById, listProduct, updateProduct } from "../controllers/product";
import { errorHandler } from "../errorHandler";
import { authMiddleware } from "../middleware/auth";
import { adminMiddleware } from "../middleware/admin";
const productRoute:Router =Router()

productRoute.post('/',authMiddleware,adminMiddleware,errorHandler( createProduct))
productRoute.put('/:id',authMiddleware,adminMiddleware,errorHandler(updateProduct))
productRoute.delete('/:id',authMiddleware,adminMiddleware,errorHandler(deleteProduct))
productRoute.get('/',authMiddleware,adminMiddleware,errorHandler(listProduct))
productRoute.get('/:id',authMiddleware,adminMiddleware,errorHandler(findById))
export default productRoute