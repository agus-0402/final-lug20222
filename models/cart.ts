import { Schema, model } from "mongoose";

// declaro la estructura que va a tener mi esquema/documento/tabla.
const cartSchema = new Schema({
  name: {type: String, required: true},
  details: {type: Array, required: true},
  total: {type:Number, required:true}
});

// exporto mi modelo, el cual me permite acceder a los metodos de la bd.
export default model("Carrito", cartSchema);