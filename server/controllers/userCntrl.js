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
});


// function to book a visit a resident
export const bookVisit = asyncHandler(async(req, res)=>{
    const {email, date} = req.body;
    const {id} = req.params;

    try{
        const alreadyBooked = await prisma.user.findUnique({
            where:{email: email},
            select:{bookedVisits: true}
        })
        if(alreadyBooked.bookedVisits.some((visit)=>visit.id===id)){
            res.status(404).json({message: "this residency is already booked by you"})
        }else{
            await prisma.user.update({
                where: {email: email},
                data: {bookedVisits:{push:{id, date
                }}}
            })
            res.send("your visit booked successfully")
        }
    }catch(err){
        throw new Error(err.message)
    }
})
