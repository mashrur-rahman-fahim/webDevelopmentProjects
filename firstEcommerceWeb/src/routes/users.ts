import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import { adminMiddleware } from "../middleware/admin";
import { errorHandler } from "../errorHandler";
import { addAddress, deleteAddress, listAddress, updateUser } from "../controllers/address";

const addressRoute:Router=Router()
addressRoute.post('/address',authMiddleware,errorHandler(addAddress))
addressRoute.delete('/address/:id',authMiddleware,errorHandler(deleteAddress))
addressRoute.get('/address/',authMiddleware,errorHandler(listAddress))
addressRoute.put('/',authMiddleware,errorHandler(updateUser))
export default addressRoute