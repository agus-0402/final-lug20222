import { Request, Response } from "express";
import cartDetailModel from "../models/cartDetails"
import productoModel from "../models/productos"
import cartModel from "../models/cart"

const cartController = {
    get: async (req: Request, res: Response) =>{
        try
        {
            //Obtiene los datos del carrito y sus detalles dentro
            const cartDetails = await cartDetailModel.findOne()

            const cartExist = await cartModel.findOne()

            if (!cartDetails) {
            //En el caso de que haya productos en el carrito (no hay detalles)
            const myCart = await cartModel.find()

                res.send("Actualmente su carrito está vacio.\nPruebe agragar algún producto.")
            } else if(!cartExist) {
                res.send("El carrito no existe")
            } else {
                //Establezco variables
                let i
                let totalPrices = 0
                let price = 0
                let cant = 0
                //Busca todos los detalles que están en el carrito
                const cart = await cartDetailModel.find()
            //Se fija por todo el carrito y se ven los datos que tiene
            for (i=0; i < cart.length; i++)
            {
                //Se obtiene el precio de cada producto
                price = cart[i].price
                //Se obtiene la cantidad de productos que se han agregado
                cant = cart[i].amount
                //Se calcula el precio total de todos los productos que están en el carrito
                totalPrices = totalPrices + (cant*price)
            }
            //Me aseguro de encontrar mi carrito
            const myCart = await cartModel.findOne()

            if(myCart) {
                //Actualizo este con los detalles calculados anteriormente
                myCart.total = totalPrices
                //Guardo los nuevos datos
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
            //Primero me fijo si hay un carrito creado
            const cartExist = await cartModel.findOne()

            if (!cartExist) {
                //En caso de que no exista, lo crea
                const newCart = new cartModel({name: "Carrito", details: [], total: 0})
                await newCart.save()

            }
            //Busca que el producto esté en la base de datos
            const isInProducts = await productoModel.findOne({name: req.body.name})
            //Busca que el producto esté en el carrito
            const isInCartDetails = await cartDetailModel.findOne({name: req.body.name})
            
            //En el caso que el producto insertado NO esté en la base de datos
            if(!isInProducts) {
                res.send('Este producto no se encuentra entre nuestros productos')
            //En caso de que no haya stock disponible para el producto    
            } else if (isInProducts.stock <= 0) { 
                res.send(`"No hay stock disponible para: "${isInProducts.name}"`)

            }
            //En el caso de que no haya detalles del producto en el carrito
             else if (!isInCartDetails) {
                //Tomo los detalles del producto
                const newProductInCart = new cartDetailModel({name: isInProducts.name, amount: 1, price: isInProducts.price}) 
                //Disminuyo el stock que tiene
                isInProducts.stock=isInProducts.stock-1;   
                //Guardo los detalles del producto a la base de datos
                newProductInCart.save()
                //Guardo el cambio del stock en la base de datos
                isInProducts.save()

                //Encuentro los detalles y el carrito
                const cartDetails = await cartDetailModel.find()
                const myCart = await cartModel.findOne()
                //Eliminaré el array "details" que tengo en mi carrito
                await myCart?.details.splice(0,myCart.details.length)
                //Actualiza el array anterior con los nuevos detalles
                await myCart?.details.push(cartDetails)
                //Guardos estos cambios en mi carrito
                await myCart?.save()

                //Le aviso que el producto se agregó al carrito
                res.send("Se ha podido agregar un '" +newProductInCart.name+ "' al carrito con éxito!\nLos datos del producto dentro del carrito ahora son:\n\nNombre: "+newProductInCart.name+"\nCantidad: "+newProductInCart.amount+"\nPrecio: "+newProductInCart.price);
            
            //En el caso de que el producto esté en el carrito
            } else if (isInCartDetails) {
                
               //Tomos los valores del producto que está en el carrito
               const producto = isInCartDetails
               //Aumento la cantidad de unidades del mismo dentro del carrito
               await producto.amount++
               //Disminuyo el stock que tiene
               await isInProducts.stock--
               //Guardo los cambios en la base de datos 
               await isInProducts.save()
               await producto.save()

               //Encuentro los detalles y el carrito 
               const cartDetails = await cartDetailModel.find()
               const myCart = await cartModel.findOne()

               //Eliminaré el array "details" que tengo en mi carrito
               await myCart?.details.splice(0, myCart.details.length) 

               //Actualizaré el array anterior con los nuevos detalles 
               await myCart?.details.push(cartDetails)

               //Guardos estos cambios en mi carrito
               await myCart?.save()
               //Le aviso que el producto se agregó al carrito 
               res.send("Se ha agregado una unidad adicional de '" +isInProducts.name+ "'.\nLos datos del producto dentro del carrito ahora son:\n\nCantidad: "+ producto.amount)
                
            }

        } catch (error) {
            //En caso de algun error inesperado
            res.send("Ha ocurrido un error")
        }
    },

    delete:async (req:Request, res: Response) => {

        try {

            //Busca que el producto esté en la base de datos
            const isInProducts = await productoModel.findOne({name: req.body.name})

            //Busca que los detalles del producto esté en el carrito
            const isInCart = await cartDetailModel.findOne({name: req.body.name})

           //En el caso que el producto no esté en la base de datos
            if(!isInProducts) {
                res.send('Este producto no se encuentra entre nuestros productos')

            //En el caso de que el producto no esté en el carrito, le avisa
            } else if (!isInCart) {
                res.send('No se encuentra el prducto en el carrito')

            //En el caso de que el producto esté en el carrito y haya solo una unidad del producto en el carrito
            } else if (isInCart && isInCart.amount == 1) {
            
                //Obtengo los datos de mi producto dentro del carrito
                const producto = isInCart
               //Declaro que no hay más unidades de este en el carrito
               producto.amount = 0
               await producto.save()
            
               //Al encontrar el nombre dentro del carrito, lo elimina
               const deleteProduct = await cartDetailModel.findOneAndDelete({name: req.body.name})

               //Aumento el stock del producto dentro de la base de datos 
               await isInProducts.stock++
               //Guardo ese nuevo valor de stock en la base de datos
               await isInProducts.save()

               //Encuentro los detalles y el carrito
               const cartDetails = await cartDetailModel.find()
               const myCart = await cartModel.findOne()

               //Eliminaré el array "details" que tengo en mi carrito
               await myCart?.details.splice(0, myCart.details.length) 
               //Actualizaré el array anterior con los nuevos detalles
               await myCart?.details.push(cartDetails)
               //Guardos estos cambios en mi carrito
               await myCart?.save()

               res.send("Se ha eliminado el producto '" + deleteProduct?.name + "' totalmente del carrito.")
                
            } else if (isInCart) {
                //En el caso de que haya más de una unidad del producto en el carrito
                //Obtengo los datos de mi producto dentro del carrito
                const producto = isInCart
                
               //Disminuyo la cantidad de estos dentro del carrito 
               await producto.amount--

               //Aumento el stock del producto dentro de la base de datos
               await isInProducts.stock++

               //Guardo ese nuevo valor de stock en la base de datos
               isInProducts.save();

               //Guardo los nuevos datos dentro del carrito
               await producto.save()
               
               //Encuentro los detalles y el carrito
               const cartDetails = await cartDetailModel.find()
               const myCart = await cartModel.findOne()

               //Eliminaré el array "details" que tengo en mi carrito
               await myCart?.details.splice(0, myCart.details.length) 
               
               //Actualizaré el array anterior con los nuevos detalles
               await myCart?.details.push(cartDetails)
               
               //Guardos estos cambios en mi carrito
               await myCart?.save()

               //Le aviso que se ha eliminado una unidad del carrito
               res.send("Se ha eliminado el producto: " + producto.name + "\n Ahora hay " + producto.amount + " " + producto.name +" en el carrito")

            }

        //En caso de algun error inesperado
        } catch (error) {
            res.status(500).send(error)
        }

        
    }

}

export default cartController