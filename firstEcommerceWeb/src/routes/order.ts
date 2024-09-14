import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import { cancelOrder, createOrder, getOrderById, listOrder } from "../controllers/order";
import { errorHandler } from "../errorHandler";
import { adminMiddleware } from "../middleware/admin";

export const orderRoute:Router=Router()

orderRoute.post('/',authMiddleware,errorHandler(createOrder))
orderRoute.get('/list',authMiddleware,errorHandler(listOrder))
orderRoute.put('/:id',authMiddleware,errorHandler(cancelOrder))
orderRoute.get('/:id',authMiddleware,adminMiddleware,errorHandler(getOrderById))
