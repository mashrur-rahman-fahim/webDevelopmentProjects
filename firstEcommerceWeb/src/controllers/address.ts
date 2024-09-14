import { Request, Response } from "express";
import { AddressSchema, updateUserSchema } from "../schema/user";
import { prismaClinet } from "..";
import { NotFoundException } from "../exceptions/norFound";
import { errorCode } from "../exceptions/root";
import { User } from "@prisma/client";
import exp from "constants";

export const addAddress =async (req:Request, res:Response) => {
    const check=AddressSchema.parse(req.body)
   const userId=(req as any).user.id
    const address=await prismaClinet.address.create({
        data:{
            lineOne:req.body.lineOne,
            lineTwo:req.body.lineTwo,
            city:req.body.city,
            pinCode:req.body.pinCode,

            userId:userId
        }
    })
   
    res.send(address)
    
}
export const deleteAddress=async (req:Request,res:Response)=>{
    const address=await prismaClinet.address.delete({
        where:{
            id:+req.params.id

        }
    })
    res.send(address)
}
export const listAddress=async(req:Request,res:Response)=>{
    const address=await prismaClinet.address.findMany({
        where:{
            userId:(req as any).user.id
        }
    })
    res.send(address)
}
export const updateUser=async (req:Request,res:Response)=>{
    updateUserSchema.parse(req.body)
    const user=await prismaClinet.user.update({
        where:{
            id:(req as any).user.id,
        },
        data:req.body
    })
    res.send(user)

}
