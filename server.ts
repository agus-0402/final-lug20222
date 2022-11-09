import dotenv from "dotenv";
import express, { Express } from "express";
import mongoose from "mongoose";
import apiRoutes from "./routes/api/index";

dotenv.config();

const app: Express = express();

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.use("/api", apiRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server is up and running at port ${process.env.PORT}`);
});

//Conecta con la DB
connectToDb()
  .then(() => console.log("Database connected successfully"))
  .catch((err) => console.log(err));

async function connectToDb() {
  if (process.env.DB_CONNECTION_STRING) {
    await mongoose.connect(process.env.DB_CONNECTION_STRING);
  } else {
    console.log("Connection string is missing");
  }
}

app.get("/", (req,res) => {

  res.send("Esta es la pagina principal en modo GET")
})