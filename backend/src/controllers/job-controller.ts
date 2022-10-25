import { JobModel } from './../models/job-schema';
import { IJob } from './../types/job-types';
import { NextFunction, Request, Response } from "express";

const createJob = async (req: Request, res: Response) => {
    const { topic, job_detail_1, job_detail_2, staff_req, department_req, ref_loss_cost_reduction, share_cost, status, job_type }: IJob = req.body
    // console.log(req.body)
    console.log(req.files)
    // Find next job number
    const jobCount = await nextJobNo()
    JobModel.create({
        job_no: `COM${String(jobCount).padStart(4, "0")}`,
        topic,
        job_detail_1,
        job_detail_2,
        staff_req,
        department_req,
        ref_loss_cost_reduction,
        share_cost,
        status,
        job_type,
    }, (err, createdJob) => {
        if (req.files) {
            //TODO insert files to attachments field
            createdJob.save()
        }
        res.statusCode === 200 ? res.json({ msg: 'เพิ่มข้อมูลสำเร็จ' }) : res.json({ msg: 'เกิดข้อผิดพลาด ไม่สามารถเพิ่มข้อมูล' })
    })
    // if (jobCreateRes) {
    //     res.status(200).json({
    //         msg: 'เพิ่มคำร้องของานใหม่สำเร็จ',
    //     })
    //     return
    // }
}

async function nextJobNo(): Promise<number> {
    const jobCount: number = await JobModel.countDocuments().exec()
    return jobCount + 1
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
    createJob,
    getAllJob,
    getOneJobById,
    getJobResponseBy,
    getJobWaitApprove,
    updateJobById,
    deleteJobById,
    getJobByUserId,
}