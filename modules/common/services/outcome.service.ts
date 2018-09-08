import { LitService } from "@litstack/core";
import { ResourceService } from "./resource.service";
import { Model, Document } from 'mongoose';
import * as uuid from 'uuid';

import { Outcome, IOutcome } from '../models/outcome.model';
import { KnotService } from './knot.service';
import { IKnot } from "../models/knot.model";

@LitService()
export class OutcomeService extends ResourceService {

    model: Model<IOutcome> = Outcome;

    constructor(private knotService: KnotService) {
        super();
    }

    public create(narrativeId: string, knotId: string, 
           key: string, outcome: string): Promise<IOutcome> {
        return new Promise((resolve, reject) => {

            const anOutcome: IOutcome = new Outcome({
                id: uuid.v4(),
                narrativeId: narrativeId,
                knotId: knotId,
                key: key,
                outcome: outcome
            });

            // verify the knot is found
            this.knotService.findById(knotId)
                .then((knot: IKnot) => {
                    if(knot.narrativeId === narrativeId) {
                        anOutcome.save()
                            .then((outcome: IOutcome) => resolve(outcome))
                            .catch(err => reject(err));
                    } else {
                        reject();
                    }
                })
                .catch(err => reject(err))
        });
    }
}