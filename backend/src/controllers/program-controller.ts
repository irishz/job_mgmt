import { NextFunction, Request, Response } from "express";
import { ProgramTypeModel } from "../models/program-schema";
import IProgram from "../types/program-types";

const createProgramType = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { type }: IProgram = req.body

        const createRes: IProgram | null = await ProgramTypeModel.create({
            type
        })

        if (createRes) {
            res.json({
                msg: 'เพิ่มประเภทสำเร็จ',
                data: createRes
            })
        }
    } catch (error) {
        next(error)
    }
}

const getAllType = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const queryRes: IProgram[] | null = await ProgramTypeModel.find()

        if (queryRes) {
            res.json(queryRes)
        }
    } catch (error) {
        next(error)
    }
}

export {
    createProgramType,
    getAllType
}