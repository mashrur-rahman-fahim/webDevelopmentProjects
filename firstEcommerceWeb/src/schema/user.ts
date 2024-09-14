import {z} from 'zod'

export const   signUpSchema=z.object({
    name:z.string(),
    email:z.string().email(),
    password:z.string().min(6)
})
export const AddressSchema=z.object({
    lineOne:z.string(),
    lineTwo:z.string().optional(),
    city:z.string(),
    pinCode:z.string().length(6),
    

})
export const updateUserSchema=z.object({
    billingAddress:z.number().optional(),
    shippingAddress:z.number().optional()
})