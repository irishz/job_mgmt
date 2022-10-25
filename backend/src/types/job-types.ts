import { Types } from "mongoose";

export interface IJob {
    topic: string,
    job_type: string,
    job_detail_1: string,
    job_detail_2: string,
    staff_req: string,
    department_req: string,
    attachments: File[],
    ref_loss_cost_reduction: string,
    share_cost: number,
    approved_by: Types.ObjectId,
    control_by: string,
    customize_cost: number,
    responsible_staff: Types.ObjectId,
    est_finish_date: Date,
    act_finish_date: Date,
    status: string,
    progress: number,
    delay_reason: string,
}