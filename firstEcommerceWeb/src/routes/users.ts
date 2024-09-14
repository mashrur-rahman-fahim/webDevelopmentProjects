import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import { adminMiddleware } from "../middleware/admin";
import { errorHandler } from "../errorHandler";
import { addAddress } from "../controllers/address";

const addressRoute:Router=Router()
addressRoute.get('/address',authMiddleware,adminMiddleware,errorHandler(addAddress))
export default addressRoute