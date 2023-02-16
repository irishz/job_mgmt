import mongoose, { model, Model, Schema } from "mongoose";
import { IJob } from "../types/job-types";

const jobSchema = new Schema(
    {
        job_no: {
            type: String,
            required: true,
        },
        topic: {
            type: String,
            required: true,
        },
        job_type: {
            type: String,
        },
        job_detail_1: {
            type: String,
        },
        job_detail_2: {
            type: String,
        },
        staff_req: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        department_req: {
            type: String,
            required: true,
        },
        attachments: {
            type: Array,
        },
        ref_loss_cost_reduction: {
            type: String,
        },
        share_cost: {
            type: Number,
        },
        approved_by: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        control_by: {
            type: String,
        },
        customize_cost: {
            type: Number,
        },
        responsible_staff: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        est_finish_date: {
            type: Date,
        },
        act_finish_date: {
            type: Date,
        },
        status: {
            type: String,
        },
        progress: {
            type: Number,
        },
        delay_reason: {
            type: String,
        },
    }, {
    timestamps: true,
    collection: 'job'
}
)

export const JobModel: Model<IJob> = model<IJob>("Job", jobSchema)