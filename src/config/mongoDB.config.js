import mongoose from "mongoose";
import ENVIRONMENT from "./environment.config.js";

async function connectMongoDB() {
    if (mongoose.connection.readyState >= 1) return;
    try {
        await mongoose.connect(ENVIRONMENT.MONGO_DB_CONNECTION_STRING);
        console.log("Conexion exitosa");
    }
    catch (error) {
        console.log("Error de conexion", error);
    };
};

export default connectMongoDB;