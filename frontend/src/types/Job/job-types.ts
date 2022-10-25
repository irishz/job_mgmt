import { MomentInput } from "moment";
import { iUserAPI } from "../user-types";

interface IJob {
    _id: string,
    job_no: string,
    topic: string,
    job_type: string,
    job_detail_1: string,
    job_detail_2: string,
    staff_req: iUserAPI,
    department_req: string,
    attachments: File[],
    ref_loss_cost_reduction: string,
    share_cost: number,
    approved_by: iUserAPI,
    control_by: string,
    customize_cost: number,
    responsible_staff: iUserAPI,
    est_finish_date: Date,
    act_finish_date: Date,
    status: string,
    progress: number,
    delay_reason: string,
    createdAt: Date | MomentInput,
    updatedAt: Date | MomentInput,
}

export default IJob