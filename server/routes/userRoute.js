
import express from 'express'
import { allFavResidencies, bookVisit, cancleBookings, createUser, favResidencies, getAllBooking } from '../controllers/userCntrl.js'
const router = express.Router()

router.post("/register", createUser)
router.post("/bookVisits/:id", bookVisit)
router.post("/allBookings", getAllBooking)
router.post("/cancelBooking/:id", cancleBookings)
router.post("/favResidencies/:rid", favResidencies)
router.post("/allFavResidencies/", allFavResidencies)

export {router as userRoute}