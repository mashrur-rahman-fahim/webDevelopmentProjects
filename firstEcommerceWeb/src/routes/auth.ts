import { Router } from "express";
import {  login, me, signUp } from "../controllers/auth";

import { authMiddleware } from "../middleware/auth";
import { errorHandler } from "../errorHandler";
const authRoute:Router=Router()
authRoute.post('/signUp',errorHandler(signUp))
authRoute.post('/login',errorHandler(login))
authRoute.post('/me',authMiddleware,errorHandler(me))

export default authRoute