import { request, Request, Response } from "express"
import productModel from "../models/productos"


const productController = {
    get: async (req: Request, res: Response) =>{
        try
        {
            //Intenta buscar todos los productos en el DB
            const allProducts = await productModel.find()

            //Muestra todos los productos que están en el DB
            res.status(200).send("Dentro de la base de datos, se encontraron los siguientes productos:\n\n"+allProducts)
        }

        //En caso de algun error
        catch (error)
        {
            res.status(500).send("Ha ocurrido un error. Por favor vuelva a intentarlo")
        }
    },
    add: async (req: Request, res: Response) =>{
        try {

            //Primero busca si el producto ya se encuentra en la base de datos
            const isInProducts = await productModel.findOne({name: req.body.name})
            
            //En el caso de que sí esté en la base de datos, le avisa
            if (isInProducts) {

                res.send('Este producto ya se encuentra en la Base de Datos')

             //En el caso de que no esté
            } else {

                //Intenta agregar el producto escrito en Postman en el DB
                const newProduct = new productModel({...req.body})
                
                //Guarda la nueva información
                await newProduct.save()

               //Le avisa al usuario que se ha podido agregar con éxito
               res.send("El producto '"+newProduct.name+"' se ha agregado correctamente. Sus datos son:\n\nNombre: "+newProduct.name+"\nStock: "+newProduct.stock+"\nPrecio c/u: "+newProduct.price)
            }
        
        //En el caso de que haya algun error
        } catch (error) {
            res.status(500).send("Ha ocurrido un error. Por favor vuelva a intentarlo")
        }
    },

    delete: async(req: Request, res: Response) => {
        try {

            //Se busca el producto en la base de datos
            const isInProducts = await productModel.findOne({name: req.body.name})

            //En el caso de que no esté, le avisa
            if (!isInProducts) {

                res.send("No se encontro el producto ingresado")

            //En el caso de que sí esté  
            } else {
                
                //Intenta eliminar el producto escrito en Postman en el DB
                const deleteproduct = await productModel.findOneAndDelete({name: req.body.name})

                //Le avisa que se ha podido eliminar
                res.send(`Se elimino ${deleteproduct?.name}`)   
            }

        //En caso de algun error inesperado     
        } catch(error){

            res.status(500).send(error)

        }
    },

    update: async(req:Request, res: Response) => {
        try {

           //Se busca el producto en la base de datos
           const isInProducts = await productModel.findOne({name: req.body.name})

           //Verifica que el precio y el stock sean numeros
           const util = require('util')
           const numeroPrice =  util.isNumber(req.body.price)
           const numeroStock =  util.isNumber(req.body.stock)

            //En el caso de que no esté, le avisa
            if (!isInProducts) {

                res.send("No se encuentra el producto ingresado")

            //En el caso de que el precio y el stock no sean numeros, le avisa    
            } else if(!numeroPrice || !numeroStock) {

                res.send("Por favor complete todos los campos o asegurese de ingresar el stock y el precio con numeros")

            //En el caso de que todo este correcto
            } else {          

                //Intenta modificar el producto escrito en Postman en el DB
                isInProducts.price = req.body.price
                isInProducts.stock = req.body.stock
                
                //Guardas los nuevos datos
                isInProducts.save()
                //Le avisa que se ha podido modificar
                res.send("Se actualizo correctamente " + isInProducts.name + "\n Nombre:" + isInProducts.name + "\n Precio:" + isInProducts.price + "\n Disponibles:" + isInProducts.stock)
            }
          
        //En caso de algun error inesperado   
        } catch (error) {

            res.send("Ha ocurrido un error. Por favor vuelva a intentarlo")

        }
    }
}

export default productController 