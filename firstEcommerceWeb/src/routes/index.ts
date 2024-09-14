import { Router } from "express";
import authRoute from "./auth";
import productRoute from "./product";
import addressRoute from "./users";

const rootRouter=Router()
rootRouter.use('/auth',authRoute)
rootRouter.use('/products',productRoute)
rootRouter.use('/users',addressRoute)

export default rootRouter