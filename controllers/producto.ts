import { request, Request, Response } from "express";
import productModel from "../models/productos"


const productController = {
    get: async (req: Request, res: Response) =>{
        try
        {
            const allProducts = await productModel.find()
            res.status(200).send(allProducts)
        }
        catch (error)
        {
            res.status(500).send(error)
        }
    },
    add: async (req: Request, res: Response) =>{
        try {

            const isInProducts = await productModel.findOne({name: req.body.name})

            if (isInProducts) {

                res.send('Este producto ya se encuentra en la Base de Datos')

            } else {

                const newProduct = new productModel({...req.body})
                await newProduct.save()
                res.send(newProduct)
            }

        } catch (error) {
            res.status(500).send(error)
        }
    },

    delete: async(req: Request, res: Response) => {
        try {

            const isInProducts = await productModel.findOne({name: req.body.name})

            if (!isInProducts) {
                res.send("No se encontro el producto ingresado")
                
            } else {

                const productName = await productModel.findOneAndDelete({name: req.body.name})
                res.send(`Se elimino ${productName?.name}`)   
            }
            
        } catch(error){
            res.status(500).send(error)
        }
    },

    update: async(req:Request, res: Response) => {
        try {
            const isInProducts = await productModel.findOne({name: req.body.name})

            const util = require('util')


           const numeroPrice =  util.isNumber(req.body.price)
           const numeroStock =  util.isNumber(req.body.stock)


            if (!isInProducts) {
                res.send("No se encuentra el producto ingresado")

            } else if(!numeroPrice || !numeroStock) {
                res.send("Por favor complete todos los campos")

            } else {          

                isInProducts.price = req.body.price
                isInProducts.stock = req.body.stock
                isInProducts.save()

                res.send(`Se actualizo correctamente "${isInProducts.name}". \n Nombre: ${isInProducts.name} \n Precio: ${isInProducts.price} \n Disponibles: ${isInProducts.stock}`)
            }


        } catch (error) {
            res.status(500).send(error)

        }
    }
}

export default productController 