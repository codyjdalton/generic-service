import { Document, Schema, model } from "mongoose";

export interface IKnot extends Document {
    id: string;
    narrativeId: string;
    key: string;
    title: string;
}

export const KnotSchema = new Schema({
    id: {
        unique: true,
        type: String,
        required: true
    },
    narrativeId: {
        type: String,
        required: true
    },
    key: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    }
});

export const Knot = model<IKnot>('Knot', KnotSchema);