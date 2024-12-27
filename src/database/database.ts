import mongoose from 'mongoose';
import config from "../config";

export const dbConnection = async () => {

    try {
        const db = await mongoose.connect(config.DB_CNN_STRING)

        console.log("Base de datos conectada a:", db.connection.name);

    } catch (error) {
        console.log(error);
        throw new Error('Error en la base de datos - vea logs')
    }
}