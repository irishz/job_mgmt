import { Document } from "mongoose";

export interface IUser extends Document {
    name: String,
    employee_code: Number,
    email: String,
    department: String,
    password: String,
    role: String,
}