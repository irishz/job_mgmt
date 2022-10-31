import * as bcrypt from 'bcryptjs';
import { IUser } from '../types/user-types';
import { Request, Response } from "express";
import { UserModel } from "../models/user-schema";
import * as Jwt from 'jsonwebtoken';

const registerUser = async (req: Request, res: Response): Promise<void> => {
    const { name, role, department, employee_code, password }: IUser = req.body
    // Check user exists
    const userExist: IUser | null = await UserModel.findOne({ employee_code })
    if (userExist) {
        res.json({ msg: 'รหัสพนักงานนี้มีในระบบอยู่แล้ว' })
        return
    }

    // Hash Password
    let salt: string = bcrypt.genSaltSync(10)
    let hashedPassword: string = bcrypt.hashSync(`${password}`, salt)

    //Create User
    const userCreateRes: IUser | null = await UserModel.create({
        name,
        role,
        department,
        password: hashedPassword,
        employee_code,
    })
    if (userCreateRes) {
        res.json({
            msg: 'เพิ่มผู้ใช้งานสำเร็จ',
            data: userCreateRes
        })
    } else {
        res.json({
            msg: 'Data not found!',
        })
        // throw new Error("Data not found!")
    }
}

const loginUser = async (req: Request, res: Response): Promise<any> => {
    const { employee_code, password }: IUser = req.body
    const user = await UserModel.findOne({ employee_code })

    // Check User
    if (user && bcrypt.compareSync(`${password}`, `${user.password}`)) {
        return res.json({
            msg: "Login User",
            data: {
                _id: user.id,
                employee_code: user.employee_code,
                name: user.name,
                role: user.role,
                token: generateToken(user._id)
            }
        })
    }
    res.status(400).json({ msg: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' })
}

function generateToken(userId: String | null) {
    if (userId) {
        return Jwt.sign({ userId }, `${process.env.JWT_TOKEN}`, {
            expiresIn: '6d',
        })
    }
    console.log('not found userId')
}

const getAllUsers = async (req: Request, res: Response): Promise<void> => {
    const users: IUser[] = await UserModel.find()
    if (users) {
        res.json(users)
        return
    }
    throw new Error('Error occured!')
}

const getComputerUsers = async (req: Request, res: Response) => {
    const compUsers: IUser[] = await UserModel.find({ department: { $in: ['COMPUTER', 'Computer', 'computer'] } })
    if (compUsers) {
        res.status(200).json(compUsers)
        return
    }
    res.status(400).json({ msg: 'ไม่พบข้อมูล' })
}

const getOneUser = async (req: Request, res: Response): Promise<void> => {
    const user = await UserModel.findById(req.params.id)
    if (user) {
        res.json(user)
        return
    }

    res.json({
        msg: 'เกิดข้อผิดพลาด, ไม่พบผู้ใช้!'
    })
}

const getUserByEmpCode = async (req: Request, res: Response): Promise<void> => {
    const userExist: IUser | null = await UserModel.findOne({ employee_code: req.params.emp_code })
    if (!userExist) {
        res.json({ msg: 'เกิดข้อผิดพลาด, ไม่พบผู้ใช้!' })
        return
    }
    res.json(userExist)
}

const updateUser = async (req: Request, res: Response): Promise<void> => {
    UserModel.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true }, (error, data) => {
        if (data) {
            res.json({
                msg: 'อัพเดทข้อมูลสำเร็จ',
                data
            })
        }
        res.json({ msg: 'Error occured, Cannot update user!', error })
    })
}

const deleteUser = async (req: Request, res: Response): Promise<void> => {
    UserModel.findByIdAndRemove(req.params.id, {}, (error, data) => {
        if (error) {
            res.status(400).json({ error })
            return
        }
        res.json({ msg: 'ลบผู้ใช้สำเร็จ' })
    })
}

type IPasswordReset = {
    employee_code: number,
    new_password: string,
    confirm_password: string,
}

const resetUserPassword = async (req: Request, res: Response) => {
    const { employee_code, new_password }: IPasswordReset = req.body
    const user = await UserModel.findOne(({ employee_code }))

    // Hash Password
    let salt: string = bcrypt.genSaltSync(10)
    let hashedPassword: string = bcrypt.hashSync(`${new_password}`, salt)

    if (user) {
        const updatedUser = await UserModel.findByIdAndUpdate(user?._id, { $set: { password: hashedPassword } })
        if (updatedUser) {
            res.json({
                msg: 'เปลี่ยนรหัสผ่านสำเร็จ'
            })
            return
        }
        res.status(400).json({ msg: 'เปลี่ยนรหัสผ่าน ไม่สำเร็จ!' })
    }
}

export {
    getAllUsers,
    getComputerUsers,
    getOneUser,
    getUserByEmpCode,
    registerUser,
    loginUser,
    updateUser,
    deleteUser,
    resetUserPassword
}