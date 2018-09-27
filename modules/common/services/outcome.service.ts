import { Observable, from } from 'rxjs';
import { concatMap, tap } from 'rxjs/operators';

import { LitService } from "@litstack/core";
import { ResourceService } from "./resource.service";
import { Model } from 'mongoose';
import * as uuid from 'uuid';

import { Outcome, IOutcome, DestinationTypes } from '../models/outcome.model';
import { Thread } from '../models/thread.model';

@LitService()
export class OutcomeService extends ResourceService {

    model: Model<IOutcome> = Outcome;

    /**
     * @method create
     * @param {string} narrativeId 
     * @param {string} knotId 
     * @param {string} key 
     * @param {DestinationTypes} destinationType 
     * @param {string} destinationId 
     */
    public create(narrativeId: string, knotId: string, key: string, 
        destinationType: DestinationTypes, destinationId: string): Observable<IOutcome> {

        const anOutcome: IOutcome = new Outcome({
            id: uuid.v4(), narrativeId: narrativeId, knotId: knotId, key: key, 
            destinationType: destinationType, destinationId: destinationId
        });

        return from(anOutcome.save());
    }

    /**
     * @method
     * @param id 
     */
    public deleteById(id: string): Observable<any> {
        let anItem: IOutcome;
        return from(this.model.findOne({ id: id })).pipe(
            tap((item: IOutcome) => anItem = item),
            concatMap(() => from(Thread.deleteMany({ narrativeId: anItem.id }))),
            concatMap(() => from(anItem.remove()))
        );
    }
}