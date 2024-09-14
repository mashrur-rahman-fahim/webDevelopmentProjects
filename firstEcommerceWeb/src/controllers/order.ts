import { Request ,Response} from "express";
import { prismaClinet } from "..";
import exp from "constants";

export const createOrder=async(req:Request,res:Response)=>{
    
     return prismaClinet.$transaction   (async(tx)=>{
        const cartItems=await tx.cartItem.findMany({
            where:{
                userId:(req as any).user.id
            },
            include:{
                product:true
            }
        })
        if(cartItems.length==0){
            return res.json("cart is empty")
        }
        const price=cartItems.reduce((prev,curr)=>{
            return prev+(curr.quantity*+curr.product.price)
        },0)
        const address=await tx.address.findFirst({
            where:{
                id:(req as any).user.shippingAddress
            }
        })
        const order=await tx.order.create({
            data:{
                userId:(req as any).user.id,
                netAmount:price,
                address: `${address?.lineOne}${address?.lineTwo ? `, ${address.lineTwo}` : ''}, ${address?.city}, ${address?.pinCode}`,
                orderProduct:{
                    create:cartItems.map((cart)=>{
                        return{
                            productId:cart.productId,
                            quantity:cart.quantity
                            
                        }
                    })

                    
                },
                orderEvent:{
                    create:{
                        status:'PENDING'
                    }
                        
                    

                    
                }

                
                
            },
            include:{
                orderProduct:true,
                orderEvent:true
            }
        })
        res.send(order)
     })

}
export const listOrder=async(req:Request,res:Response)=>{
    const orders=await prismaClinet.order.findMany({
        where:{
            userId:(req as any).user.id
        },
    include:{
       
        orderEvent:true
    }
    })
    res.send(orders)

}
export const cancelOrder=async(req:Request,res:Response)=>{
   const order=await prismaClinet.order.update({
    where:{
        id:+req.params.id,
        userId:(req as any).user.id
    },
    data:{
        orderEvent:{
            updateMany:{
                where:{
                        // orderId:+req.params.id
                },
               
                  data:{
                    status:'CANCELLED'
                  }
            }
        }
            
        
    }
   })
   res.send(order)

}
export const getOrderById=async(req:Request,res:Response)=>{
  
    const order=await prismaClinet.order.findFirstOrThrow({
    where:{
        id:+req.params.id,
        
    },
    include:{
           orderProduct:true,
           orderEvent:true 
    }
   })
   res.send(order)

}
