import { Model } from 'mongoose';
import { model } from 'mongoose';
import { Schema } from 'mongoose';
import IProgram from '../types/program-types';

const programTypeSchema = new Schema(
    {
        type: {
            type: String,
            required: true,
        }
    },
    {
        timestamps: true,
        collection: 'programtype'
    }
)

export const ProgramTypeModel: Model<IProgram> = model<IProgram>("ProgramType", programTypeSchema)
