import dotenv from "dotenv";
import express, { Express } from "express";
import mongoose from "mongoose";
import apiRoutes from "./routes/api/index";

// carga las variables de entorno para poder leerlas accediendo a process.env["variable"]
dotenv.config();

const app: Express = express();

app.use(express.json({ limit: "10mb" }));

app.use(express.urlencoded({ extended: true }));

//Le decimos la ruta que nuestra app Express va a utilizar
app.use("/api", apiRoutes);

// Configuramos el puerto de conexion del localhost
app.listen(process.env.PORT, () => {

  console.log(`El servidor se inicializo en el puerto: ${process.env.PORT}`);

});

//Conecta con la DB
connectToDb()
  .then(() => console.log("La base de datos esta conectada!"))
  .catch((err) => console.log(err));

async function connectToDb() {

  // cheque si la variable de entorno esta definida.
  if (process.env.DB_CONNECTION_STRING) {

    // intenta conectar con la bd.
    await mongoose.connect(process.env.DB_CONNECTION_STRING);

  // en caso que la var no se haya cargado correctamente, loguea un mensaje en la consola.
  } else {

    console.log("Connection string is missing");

  }
}

app.get("/", (req,res) => {

  res.send("Esta es la pagina principal en modo GET")

})