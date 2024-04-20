import mongoose from 'mongoose'
import { DB_NAME } from '../constants'; 
const connectDB = async () => {

    try {

        const connection = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`\nMongoDB connected to Host: ${connection.connection.host}`);


    } catch (err) {
        console.log("Error while connecting to DB ", err)
        process.exit(1);
    }
}

export default connectDB 