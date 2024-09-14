import { internalException } from "./exceptions/internalExcp";
import { errorCode, httpExceptions } from "./exceptions/root";

import { Response,Request,NextFunction } from "express";
export const errorHandler=(method:Function)=>{
    return async (req:Request,res:Response,next:NextFunction)=>{
        try{
            await method(req,res,next);
        }
        catch(err:any){
            let exception:httpExceptions
            if(err instanceof httpExceptions){
                exception=err
            }
            else{
                exception=new internalException("something went wrong",err,errorCode.INTERNAL_EXCEPTION)

            }
            next(exception)
            // res.send(err)
            
        }
    }

}