import asyncHandler from 'express-async-handler'
import {prisma} from '../config/prismaConfig.js'


export const createUser = asyncHandler(async(req, res)=>{
    console.log("creating a user")

    let {email} = req.body;
    const userExits = await prisma.user.findUnique({where: {email:email}})
    if(!userExits){
        const user = await prisma.user.create({data:req.body});
        res.send({
            message:"user registered successfully", user:user,
        })
    }
    else{
        res.status(201).send({message: 'user already registered'})
    }

    console.log(email)
})