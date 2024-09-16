import { Router } from "express";
import { upload } from "../Middlewares/multer.middleware.js";
import { asyncHandler } from "../Utils/asyncHandler.js";
import { registerUser } from "../Controllers/user.controller.js";

export const userRoute=Router()
const PORT=process.env.PORT
// userRoute.post('/',upload.fields([
//     {
//         name:"avatar",
//         maxCount:1
//     },{
//         name:"coverImage",
//         maxCount:1
//     }
// ]),asyncHandler(registerUser))

userRoute.post('/',asyncHandler(registerUser))