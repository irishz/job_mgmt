import { Types } from 'mongoose';
export interface IJobTrans {
    job_id: Types.ObjectId,
    approved_by: Types.ObjectId,
    approved_at: Date,
}