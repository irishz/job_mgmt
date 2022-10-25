import mongoose from 'mongoose';
import { model } from 'mongoose';
import { Model } from 'mongoose';
import { Schema } from 'mongoose';
import { IJobTrans } from '../types/jobtrans-types';

const jobTransSchema = new Schema(
    {
        job_id: {
            type: mongoose.Schema.Types.ObjectId
        },
        approved_by: {
            type: mongoose.Schema.Types.ObjectId,
        },
        approved_at: {
            type: Date
        }
    },
    {
        timestamps: true,
        collection: 'job_trans'
    }
)

export const JobTransModel: Model<IJobTrans> = model<IJobTrans>("JobTrans", jobTransSchema)