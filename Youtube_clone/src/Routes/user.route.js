import { Router } from "express";
import { upload } from "../Middlewares/multer.middleware.js";
import { asyncHandler } from "../Utils/asyncHandler.js";
import { changePassword, getChannel, getWatchHistory, login, logout, registerUser, updateUser } from "../Controllers/user.controller.js";
import { verifyUser } from "../Middlewares/auth.middleware.js";

export const userRoute=Router()
userRoute.post('/signUp',upload.fields([
    {
        name:"avatar",
        maxCount:1
    },{
        name:"coverImage",
        maxCount:1
    }
]),asyncHandler(registerUser))
userRoute.post('/login',login)
userRoute.get('/logout',verifyUser,logout)
userRoute.post('/changePassword',verifyUser,changePassword)
userRoute.put('/updateUser',verifyUser,updateUser)
userRoute.get('/getChannel/:userName',verifyUser,getChannel)
userRoute.get('/watchHistory',verifyUser,getWatchHistory)

