import { model, Model, Schema } from "mongoose";
import { IUser } from "../types/user-types";

const userSchema: Schema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        employee_code: {
            type: Number,
            required: [true, "กรุณาใส่รหัสพนักงาน"],
            unique: true,
        },
        email: {
            type: String,
        },
        department: {
            type: String,
        },
        password: {
            type: String,
            min: [6, "รหัสผ่านขั้นต่ำ 6 ตัว"],
        },
        role: {
            type: String,
        },
    },
    {
        timestamps: true,
        collection: "users"
    }
)

export const UserModel: Model<IUser> = model<IUser>("User", userSchema)