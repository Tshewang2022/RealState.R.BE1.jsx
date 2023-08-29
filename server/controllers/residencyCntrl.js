import asyncHandler from 'express-async-handler'
import { prisma } from '../config/prismaConfig.js'

export const createResidency = asyncHandler(async (req, res) => {
  const { title, price, address, city, country, image, facilities, userEmail } = req.body.data

  console.log(req.body.data);
  
  try {
    const residency = await prisma.residency.create({
      data: {
        title,
        price,
        address,
        city,
        country,
        image,
        facilities,
        owner: { connect: { email: userEmail } } // Connect the owner using the correct field name
      }
    });
    res.send({ message: "Residency created successfully", residency });
  } catch (err) {
    if (err.code === "P2022") {
      throw new Error("A residency with the same address already exists");
    }
    throw new Error(err.message);
  }
});
