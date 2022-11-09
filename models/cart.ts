import { Schema, model } from "mongoose";

const cartSchema = new Schema({
  name: {type: String, required: true},
  details: {type: Array, required: true},
  total: {type:Number, required:true}
});

export default model("Carrito", cartSchema);
