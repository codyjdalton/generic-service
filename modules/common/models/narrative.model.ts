import { Document, Schema, model } from "mongoose";

export interface INarrative extends Document {
    id: string;
    key: string;
    title: string;
}

export const NarrativeSchema = new Schema({
    id: {
        unique: true,
        type: String,
        required: true
    },
    key: {
        unique: true,
        type: String
    },
    title: {
        type: String,
        required: true
    }
});

export const Narrative = model<INarrative>('Narrative', NarrativeSchema);