import { JobModel } from '../models/job-schema';
import { IJob } from '../types/job-types';
import { NextFunction, Request, Response } from "express";
import { JobTransModel } from '../models/jobtrans-schema';

const createJobTrans = async (req: Request, res: Response) => {
    const createdJobTrans = await JobTransModel.create(req.body)
    if (createdJobTrans) {
        res.status(200).json({
            msg: 'เพิ่มข้อมูล job transaction สำเร็จ'
        })
        return
    }
    res.status(400).json({msg: 'เพิ่มข้อมูล job transaction ล้มเหลว!'})
}


const getAllJob = async (req: Request, res: Response) => {
    const queryRes: IJob[] | null = await JobModel.find().populate(["responsible_staff", "staff_req", "approved_by"])
    if (queryRes) {
        res.json(queryRes)
        return
    }
    console.log("Error occured, Cannot get job!");
}

const getOneJobById = async (req: Request, res: Response) => {
    const queryRes: IJob | null = await JobModel.findById(req.params.id)

    if (queryRes) {
        res.json(queryRes)
        return
    }
    console.log("Error occured, One Job not found!");
}

const getJobResponseBy = async (req: Request, res: Response) => {
    const queryRes: IJob[] | null = await JobModel.find({ responsible_staff: req.params.id }).populate(["responsible_staff", "staff_req", "approved_by"])

    if (queryRes) {
        res.json(queryRes)
        return
    }
    console.log("Error occured, Not found data!");
}

const getJobWaitApprove = async (req: Request, res: Response, next: NextFunction) => {
    const status: String = "wait for approve"
    try {
        const queryRes: IJob[] | null = await JobModel.find({ status })

        if (queryRes) {
            res.json(queryRes)
            return
        }
    } catch (error) {
        next(error)
    }
}

const getJobByUserId = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const queryRes: IJob[] | null = await JobModel.find({ staff_req: req.params.id }).populate("staff_req")
        if (queryRes) {
            res.json(queryRes)
            return
        }
    } catch (error) {
        next(error)
    }
}

const updateJobById = async (req: Request, res: Response) => {
    if (req.body.act_finish_date === "Invalid date") {
        req.body.act_finish_date = ""
    }
    const queryRes: IJob | null = await JobModel.findByIdAndUpdate(req.params.id, { $set: req.body })

    if (queryRes) {
        res.json({
            msg: 'อัพเดทข้อมูลสำเร็จ',
            queryRes
        })
        return
    }
    console.log("Error occured, Cannot update job!");
}

const deleteJobById = async (req: Request, res: Response) => {
    const queryRes: IJob | null = await JobModel.findByIdAndRemove(req.params.id)

    if (queryRes) {
        res.json({
            msg: 'ลบข้อมูลสำเร็จ',
        })
        return
    }
    console.log("Error occured, Cannot delete job!");
}

export {
    createJobTrans,
}