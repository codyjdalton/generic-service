import { Document, Schema, model } from "mongoose";

export interface IResource extends Document {
    id: string;
    name: string;
}

export const ResourceSchema = new Schema({
    id: {
        unique: true,
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    }
});

export const Resource = model<IResource>('Resource', ResourceSchema);