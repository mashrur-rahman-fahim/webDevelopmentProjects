import { Response,Request } from "express";
import { cartItemSchema, changeQuantitySchema } from "../schema/cart";
import { prismaClinet } from "..";
import { NotFoundException } from "../exceptions/norFound";
import { errorCode } from "../exceptions/root";

export const addCart=async (req:Request,res:Response)=>{
    cartItemSchema.parse(req.body)
    try{
        await prismaClinet.products.findFirstOrThrow({
            where:{
                id:+req.body.productId
            }
        })
    }catch(err){
        throw new NotFoundException("Product not found",errorCode.PRODUCT_NOT_FOUND)
    }
    const cart=await prismaClinet.cartItem.create({
        data:{
            ...req.body,
            userId:(req as any).user.id,

        }
    })
    res.send(cart)
}
export const deleteCart= async (req:Request,res:Response)=>{
    const cart=await prismaClinet.cartItem.delete({
        where:{
            userId:(req as any).user.id,
            id:+req.params.id
            
        }
    })
    res.send(cart)
}
export const changeQuantity=async (req:Request,res:Response)=>{
    changeQuantitySchema.parse(req.body)
    const cart = await prismaClinet.cartItem.update({
        where:{
            userId:(req as any).user.id,
            id:+req.params.id
        },
        data:{
            quantity:req.body.quantity
        }
    })
    console.log(typeof cart)
    res.send(cart)
}
export const getCart= async (req:Request,res:Response)=>{

    const cart=await prismaClinet.cartItem.findMany({
        where:{
            userId:(req as any).user.id
        },
        include:{
            product:true
        }
    })
    res.send(cart)
}

