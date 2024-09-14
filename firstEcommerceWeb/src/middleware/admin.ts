import { NextFunction, Request, Response } from "express";
import { Unauthorization } from "../exceptions/unauthorization";
import { errorCode } from "../exceptions/root";

export const adminMiddleware = (req:Request,res:Response,next:NextFunction)=>{
    const user=(req as any).user

    if (user.role=="ADMIN"){
            next()
    }
    else{
        next (new Unauthorization("you are not admin",errorCode.UNAUTHORIZED))
        next();
    }

}