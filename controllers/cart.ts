import { Request, Response } from "express";
import cartDetailModel from "../models/cartDetails"
import productoModel from "../models/productos"
import cartModel from "../models/cart"

const cartController = {
    get: async (req: Request, res: Response) =>{
        try
        {
            const cartDetails = await cartDetailModel.findOne()

            const cartExist = await cartModel.findOne()

            if (!cartDetails) {

            const myCart = await cartModel.find()

                res.send(myCart)
            } else if(!cartExist) {
                res.send("El carrito no existe")
            } else {

                let i
                let totalPrices = 0
                let price = 0
                let cant = 0
            
                const cart = await cartDetailModel.find()

            for (i=0; i < cart.length; i++)
            {
                price = cart[i].price
                cant = cart[i].amount

                totalPrices = totalPrices + (cant*price)
            }

            const myCart = await cartModel.findOne()

            if(myCart) {

                myCart.total = totalPrices
                myCart.save()
            }



             res.status(200).send(myCart)

            }
            
        }
        catch (error)
        {
            res.status(500).send(error)
        }
    },
    add: async (req: Request, res: Response) =>{
        try {
            
            const cartExist = await cartModel.findOne()

            if (!cartExist) {
                const newCart = new cartModel({name: "Carrito", details: [], total: 0})
                await newCart.save()

            }
            
            const isInProducts = await productoModel.findOne({name: req.body.name})

            const isInCartDetails = await cartDetailModel.findOne({name: req.body.name})

            


            if(!isInProducts) {
                res.send('Este producto no se encuentra entre nuestros productos')
            } else if (isInProducts.stock <= 0) {
                res.send(`"No hay stock disponible para: "${isInProducts.name}"`)

            }
             else if (!isInCartDetails) {
            
                const newProductInCart = new cartDetailModel({name: isInProducts.name, amount: 1, price: isInProducts.price}) 
                
                await isInProducts.stock--
            
                await newProductInCart.save()
                await isInProducts.save()


                const cartDetails = await cartDetailModel.find()

                const myCart = await cartModel.findOne()

                await myCart?.details.splice(0,myCart.details.length) //borra el array de carrito anterior

                await myCart?.details.push(cartDetails) // sube el array nuevo

                await myCart?.save()

                const carritoGet = await cartController.get(req, res)


                res.send(carritoGet)
            

            } else if (isInCartDetails) {


               const producto = isInCartDetails
                
               await producto.amount++
               await isInProducts.stock--

               await isInProducts.save()
               await producto.save()

               const cartDetails = await cartDetailModel.find()

                const myCart = await cartModel.findOne()

                await myCart?.details.splice(0, myCart.details.length) //borra el array de carrito anterior

                await myCart?.details.push(cartDetails) // sube el array nuevo

                await myCart?.save()

                const carritoGet = await cartController.get(req, res)





               
                res.send(carritoGet)
                
            }

    
        } catch (error) {
            res.status(500).send(error)
        }
    },

    delete:async (req:Request, res: Response) => {

        try {

            const isInProducts = await productoModel.findOne({name: req.body.name})

            const isInCart = await cartDetailModel.findOne({name: req.body.name})


            if(!isInProducts) {
                res.send('Este producto no se encuentra entre nuestros productos')
            } else if (!isInCart) {
            
                res.send('No se encuentra el prducto en el carrito')
            

            } else if (isInCart && isInCart.amount == 1) {
            
                const producto = isInCart
                
               producto.amount = 0
               await producto.save()
            

               
               await cartDetailModel.findOneAndDelete({name: req.body.name})

               await isInProducts.stock++
               await isInProducts.save()


               const cartDetails = await cartDetailModel.find()

               const myCart = await cartModel.findOne()

               await myCart?.details.splice(0, myCart.details.length) //borra el array de carrito anterior

               await myCart?.details.push(cartDetails) // sube el array nuevo

               await myCart?.save()

               
               if(myCart) {
                   
                   myCart.total = 0
                   myCart.save()
                }
                
                const carritoGet = await cartController.get(req, res)
          
                res.send(carritoGet)
                
            } else if (isInCart) {

                const producto = isInCart
                
               await producto.amount--
               await isInProducts.stock++
               
               await isInProducts.save()
               await producto.save()
               
               
               const cartDetails = await cartDetailModel.find()
               
               const myCart = await cartModel.findOne()
               
               await myCart?.details.splice(0, myCart.details.length) //borra el array de carrito anterior
               
               await myCart?.details.push(cartDetails) // sube el array nuevo
               
               await myCart?.save()

               const carritoGet = await cartController.get(req, res)

               

                res.send(carritoGet)

            }

    
        } catch (error) {
            res.status(500).send(error)
        }

        
    }

}

export default cartController