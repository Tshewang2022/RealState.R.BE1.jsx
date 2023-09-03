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

// function to get all the bookings for the user

export const getAllBooking = asyncHandler(async(req, res)=>{
    const {email} = req.body

    try{
        const bookings = await prisma.user.findUnique({
            where: {email},
            select: {bookedVisits: true}
        })
        res.status(202).send(bookings)
    }catch(err){
        throw new Error(err.message)
    }
})

// function to cancle the bookings(cancleBookings)

 export const cancleBookings = asyncHandler(async(req, res)=>{
    const {email} = req.body;
    const {id} = req.params

    try{
        const user = await prisma.user.findUnique({
            where: {email: email},
            select: {bookedVisits: true}
        })
        const index = user.bookedVisits.findIndex((visit)=>visit.id===id)
        if(index === -1){
            res.status(404).json({message: "Booking not found"})
        }else{
            user.bookedVisits.splice(index, 1)
            await prisma.user.update({where: {email},
            data: {bookedVisits: user.bookedVisits}
        })
        res.send("Booking cancelled successfully")
        }
    }catch(err){
        throw new Error(err.message)
    }
 })

 // the function to add the favResidencies

 export const favResidencies = asyncHandler(async(req, res)=>{
    const {email} = req.body; // so we are using the property access expression (dot)
    const {rid} = req.params;

    try{
        const user = await prisma.user.findUnique({where:{email}})
        if(user.favResidenciesID.includes(rid)){
            const updateUser = await prisma.user.update({
                where: {email},
                data: {
                    favResidenciesID :{
                        set: user.favResidenciesID.filter((id)=>id !==rid)
                    }
                }
            })
            res.send({message: "Removed from the favorites", user: updateUser})
        }else{
            const updateUser = await prisma.user.update({
                where: {email},
                data: {
                    favResidenciesID: {
                        push: rid
                    }
                }
            })
            res.send({message: "updated favorites", user: updateUser })
        }
    }catch(err){
        throw new Error(err.message)
    }
 })

 // The functions to get allFavorites Residencies
 export const allFavResidencies = asyncHandler(async(req, res)=>{
    const {email} = req.body
    try {
        const favResd = await prisma.user.findUnique({
            where : {email},
            select : {favResidenciesID: true}
        })
        res.status(200).send(favResd)
    }catch(err){
        throw new Error(err.message)
    }
 })