import { Document, Schema, model } from "mongoose";

export interface IThread extends Document {
    id: string;
    narrativeId: string;
    knotId: string;
    outcomeId: string;
    title: string;
    headline: string;
    builders: string[];
    photoBackground: string;
    photoIcon: string;
    photoInList: boolean;
}

export const ThreadSchema: Schema = new Schema({
    id: {
        unique: true,
        type: String,
        required: true
    },
    narrativeId: {
        type: String,
        required: true
    },
    knotId: {
        type: String,
        required: true
    },
    outcomeId: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    headline: {
        type: String,
        required: true
    },
    builders: {
        type: Array
    },
    photoBackground: {
        type: String,
        required: false
    },
    photoIcon: {
        type: String,
        required: false
    },
    photoInList: {
        type: Boolean,
        required: false,
        default: false
    },
});

export const Thread = model<IThread>('Threads', ThreadSchema);