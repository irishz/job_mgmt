import mongoose from "mongoose";
import { config } from 'dotenv'

config()
const { DB_URI } = process.env

const DBConnection = async () => {
    try {
        const res = await mongoose.connect(`${DB_URI}`)
        if (res) {
            console.log('Connected to Database Successfully!')
        }
    } catch (error) {
        console.log('Database connection failed!', error)
    }
}

export default DBConnection