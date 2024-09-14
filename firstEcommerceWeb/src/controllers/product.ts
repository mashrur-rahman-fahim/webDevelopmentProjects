import { NextFunction, Request,Response } from "express"
import { prismaClinet } from ".."

export const createProduct= async (req:Request,res:Response,next:NextFunction)=>{
    const product=req.body
    const newProduct=await prismaClinet.products.create({
        data:{
        ...product,
        tags:req.body.tags.join(',')
 } })
 res.send(newProduct)

}
export const updateProduct=async (req:Request,res:Response,next:NextFunction)=>{
    const updateProduct=await prismaClinet.products.update({
        where:{
            id:+req.params.id
        },
        data:req.body
    })
    res.send(updateProduct)
    
}
export const deleteProduct =async (req:Request,res:Response)=>{
    const deleteProduct=await prismaClinet.products.delete({
        where:{
            id:+req.params.id
        },
        
    })
    res.send(deleteProduct)
}
export const listProduct=async (req:Request,res:Response)=>{
    const skip=req.query.skip?+req.query.skip:0
    const products=await prismaClinet.products.findMany({
        
        skip: skip,
        take:2
    })
    const count=await prismaClinet.products.count
    res.json({count:count,data:products})
}
export const findById =async (req:Request,res:Response)=>{
    const product=await prismaClinet.products.findFirst({
        where:{
            id:+req.params.id
        }
    })
    res.send(product)
}