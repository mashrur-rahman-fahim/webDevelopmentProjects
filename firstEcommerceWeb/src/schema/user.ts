import {z} from 'zod'

export const   signUpSchema=z.object({
    name:z.string(),
    email:z.string().email(),
    password:z.string().min(6)
})
export const AddressSchema=z.object({
    lineOne:z.string(),
    lineTwo:z.string().nullable(),
    city:z.string(),
    pincode:z.string().length(6),
    userId:z.number()

})