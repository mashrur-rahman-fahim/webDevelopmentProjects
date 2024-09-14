import { Router } from "express";
import authRoute from "./auth";
import productRoute from "./product";
import addressRoute from "./users";
import cartRoute from "./cart";
import { orderRoute } from "./order";

const rootRouter=Router()
rootRouter.use('/auth',authRoute)
rootRouter.use('/products',productRoute)
rootRouter.use('/users',addressRoute)
rootRouter.use('/cart',cartRoute)
rootRouter.use('/order',orderRoute)

export default rootRouter