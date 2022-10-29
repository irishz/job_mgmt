import express from 'express'
import dotenv from 'dotenv'
dotenv.config()
import * as bodyParser from 'body-parser'
import userRoute from './routes/user-routes'
import jobRoute from './routes/job-routes'
import jobTransRoute from './routes/jobtrans-routes'
import programRoute from './routes/program-routes'
import mongoose from 'mongoose'
import cors, { CorsOptions } from 'cors'
import DBConnection from './db'

const { port, DB_URI } = process.env

mongoose.Promise = global.Promise
// mongoose.connect(`${db_uri}`)
DBConnection();

const allowedOrigins = [
    'http://192.168.2.13:9090',
    'http://127.0.0.1:9090',
    'http://localhost:9090',
    "http://192.168.2.13:5173",
    "http://localhost:5173"
];

const options: CorsOptions = {
    origin: allowedOrigins,
    credentials: true,
    allowedHeaders: ["Origin", "Content-Type"],
    methods: ['GET', 'POST', 'PUT', 'PATCH' , 'DELETE', 'OPTIONS'],
}

const app = express()
// app.use(cors())

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))


app.get("/", (req, res) => {
    res.send(`Database URI: ${DB_URI}`);
})

app.use("/users", userRoute)
app.use("/job", jobRoute)
app.use("/jobtrans", jobTransRoute)
app.use("/program", programRoute)

app.listen(port, () => {
    console.log(`Server running on port: ${port}`)
})