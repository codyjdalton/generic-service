import { Document, Schema, model } from "mongoose";

export enum DestinationTypes {
    DONE = 'DONE',
    NARRATIVE = 'NARRATIVE',
    KNOT = 'KNOT'
}

export interface IOutcome extends Document {
    id: string;
    narrativeId: string;
    knotId: string;
    key: string;
    destinationType: DestinationTypes;
    destinationId: string;
}

export const OutcomeSchema: Schema = new Schema({
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
    destinationType: {
        type: String,
        required: true,
        default: DestinationTypes.DONE
    },
    destinationId: {
        type: String,
        required: false
    }
});

export const Outcome = model<IOutcome>('Outcome', OutcomeSchema);