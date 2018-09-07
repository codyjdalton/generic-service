import { Document, Schema, model } from "mongoose";

export interface IOutcome extends Document {
    id: string;
    narrativeId: string;
    knotId: string;
    key: string; // usually POSITIVE, NEGATIVE, NEUTRAL
    outcome: string; // a knot.key or DONE or END
}

export const OutcomeSchema = new Schema({
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
    key: {
        type: String,
        required: true
    },
    outcome: {
        type: String,
        required: true
    }
});

export const Outcome = model<IOutcome>('Outcome', OutcomeSchema);