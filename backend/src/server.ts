import express from 'express'
import { config } from 'dotenv'
import * as bodyParser from 'body-parser'
import userRoute from './routes/user-routes'
import jobRoute from './routes/job-routes'
import programRoute from './routes/program-routes'
import mongoose, { mongo } from 'mongoose'
import cors, { CorsOptions } from 'cors'
import DBConnection from './db'

config()
const { port, db_uri } = process.env

mongoose.Promise = global.Promise
// mongoose.connect(`${db_uri}`)
DBConnection();

const allowedOrigins = ['http://127.0.0.1:5173', 'http://192.168.2.197:5173'];
const options: CorsOptions = {
    origin: allowedOrigins,
}

const app = express()

app.use(cors(options))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))

app.use("/users", userRoute)
app.use("/job", jobRoute)
app.use("/program", programRoute)

app.listen(port, () => {
    console.log(`Server running on port: ${port}`)
})