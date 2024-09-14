import { Request, Response } from "express";
import { AddressSchema } from "../schema/user";
import { prismaClinet } from "..";
import { NotFoundException } from "../exceptions/norFound";
import { errorCode } from "../exceptions/root";
import { User } from "@prisma/client";

export const addAddress =async (req:Request, res:Response) => {
    AddressSchema.parse(req.body)
    let user:User
    try{
         user=await prismaClinet.user.findFirstOrThrow({
            where:{
                id:req.body.userId
            }
        })
    }
    catch (err){
        throw new NotFoundException("User not found",errorCode.USER_NOT_FOUND)



    }
    const address =await prismaClinet.address.create({
        data:{
            ...req.body,
            userId:user.id
        }
    })
    res.json({user:user,address:address})
    
}
