import { NextFunction,Request,Response } from "express";
import { httpExceptions } from "../exceptions/root";

export const errorMiddleware=(error:httpExceptions,req:Request,res:Response,next:NextFunction)=>{
   res.status(error.statusCode).json({
    messege:error.message,
    errorCode:error.errorCode,
    errors:error.errors
   })
}