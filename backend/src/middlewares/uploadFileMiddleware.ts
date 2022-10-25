import mongoose, { Connection } from 'mongoose';
import multer from 'multer';
import { GridFsStorage } from 'multer-gridfs-storage';
import {config} from 'dotenv'
import Grid from 'gridfs-stream'

config()
const {DB_URI} = process.env

//Initial GFS
let gfs
const connection: Connection = mongoose.connection
connection.once('open', () => {
    gfs = Grid(connection.db, mongoose.mongo)
    gfs.collection('uploads')
})

//Create storage engine
const storage = new GridFsStorage({
    url : `${DB_URI}`,
})

let uploadFileMiddleware = multer({ storage })

export default uploadFileMiddleware