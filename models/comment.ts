import { Schema, model } from "mongoose";


const commentSchema = new Schema({
  date: Date,
  content: String
});

export default model("Comment", commentSchema);
