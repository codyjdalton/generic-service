import { Observable, from } from 'rxjs';
import { concatMap, tap } from 'rxjs/operators';

import { LitService } from "@litstack/core";
import { ResourceService } from "./resource.service";
import { Model, Document } from 'mongoose';
import * as uuid from 'uuid';

import { Outcome, IOutcome, DestinationTypes } from '../models/outcome.model';
import { KnotService } from './knot.service';
import { Thread } from '../models/thread.model';

@LitService()
export class OutcomeService extends ResourceService {

    model: Model<IOutcome> = Outcome;

    constructor(private knotService: KnotService) {
        super();
    }

    public create(narrativeId: string, knotId: string, key: string, 
        destinationType: DestinationTypes, destinationId: string): Promise<IOutcome> {
        return new Promise((resolve, reject) => {

            const anOutcome: IOutcome = new Outcome({
                id: uuid.v4(),
                narrativeId: narrativeId,
                knotId: knotId,
                key: key,
                destinationType: destinationType,
                destinationId: destinationId
            });

            // verify the knot is found
            this.knotService.findById(knotId)
                .then(() => {
                    anOutcome.save()
                            .then((outcome: IOutcome) => resolve(outcome))
                            .catch(err => reject(err));
                })
                .catch(err => reject(err))
        });
    }

    public deleteById(id: string): Observable<any> {
        let anItem: IOutcome;
        return from(this.model.findOne({ id: id })).pipe(
            tap((item: IOutcome) => anItem = item),
            concatMap(() => from(Thread.deleteMany({ narrativeId: anItem.id }))),
            concatMap(() => from(anItem.remove()))
        );
    }
}