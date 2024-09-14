import { NextFunction,Response,Request } from "express";
import { Unauthorization } from "../exceptions/unauthorization";
import { errorCode } from "../exceptions/root";
import * as jwt from 'jsonwebtoken'
import { JWT_SECRET } from "../secrets";
import { prismaClinet } from "..";

export const authMiddleware=async(req:Request,res:Response,next:NextFunction)=>{
    const token=req.headers.authorization
    if(!token){
        return next(new Unauthorization("Unauthorized",errorCode.UNAUTHORIZED))

    }
    try{
        const payload=  jwt.verify(token,JWT_SECRET) as any
        const user= await prismaClinet.user.findFirst({
            where:{
                id:payload.userId
            }
        })
        if(!user){
            return next(new Unauthorization("Unauthorized",errorCode.UNAUTHORIZED))
        }
        req.user=user
        // res.locals.user=user
         next();

    }catch(err){
         next(new Unauthorization("Unauthorized",errorCode.UNAUTHORIZED))

    }


}