import { Request, Response } from "express";
import cartDetailsModel from "../models/cartDetails"

const cartDetailsController = {
    get: async (req: Request, res: Response) =>{
        try
        {
            const cartDetails = await cartDetailsModel.find()
            res.status(200).send(cartDetails)
        }
        catch (error)
        {
            res.status(500).send(error)
        }
    }
}

export default cartDetailsController //import userController from "../../../controllers/User/User";