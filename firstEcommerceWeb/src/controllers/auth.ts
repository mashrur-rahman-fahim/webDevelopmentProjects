import { NextFunction, Request,Response } from "express"
import { prismaClinet } from ".."
import {compareSync, hashSync} from 'bcrypt'
import * as jwt from 'jsonwebtoken'
import { JWT_SECRET } from "../secrets"
import { BadRequestException } from "../exceptions/badRequest"
import { errorCode } from "../exceptions/root"
import { signUpSchema } from "../schema/user"
import { UnprocessableEntity } from "../exceptions/validation"
import { NotFoundException } from "../exceptions/norFound"

export const signUp=async (req:Request,res:Response,next:NextFunction)=>{
    signUpSchema.parse(req.body)
    const {name,email,password}=req.body
   let user=await prismaClinet.user.findFirst({
    where:{
        email:email
    }
   }) 
   if(user){
       throw (new BadRequestException('user already exist',errorCode.USER_ALREADY_EXISTS))
   }
   user= await prismaClinet.user.create({
    data:{
        name:name,
        email:email,
        password:hashSync(password,10)
    }
   })
   res.json(user)

    

}
export const login=async (req:Request,res:Response,next:NextFunction)=>{
   const {email,password}=req.body
   console.log('done')
   let user=await prismaClinet.user.findFirst({
    where:{
        email:email
    }
   }) 
   if(!user){
     throw new NotFoundException("user doesnot exist",errorCode.USER_NOT_FOUND)
   }
   if(!compareSync(password,user.password)){
    throw (new BadRequestException("password incorrect",errorCode.INCORRECT_PASSSWORD))
   }
  const token= jwt.sign({
    userId:user.id
   },JWT_SECRET)
   
   
   res.json({user,token})

}
export const me=(req:Request,res:Response)=>{
    res.json((req).user)
}