import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

//connect our database
export const connect = () => {
    try {
        mongoose.connect(process.env.MONGO_URL)
            .then(() => console.log("database connected"))
    } catch (error) {
        console.log("database not connected")
    }

}
