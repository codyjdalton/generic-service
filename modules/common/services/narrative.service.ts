import { Observable, from } from 'rxjs';
import { concatMap, tap } from 'rxjs/operators';

import { Model } from 'mongoose';
import * as uuid from 'uuid';

import { Thread } from '../models/thread.model';
import { Narrative, INarrative } from '../models/narrative.model';
import { Knot } from '../models/knot.model';
import { Outcome } from '../models/outcome.model';
import { LitService } from "@litstack/core";
import { ResourceService } from "./resource.service";


@LitService()
export class NarrativeService extends ResourceService {

    model: Model<INarrative> = Narrative;

    /**
     * @method create
     * @param {string} key 
     * @param {string} title
     * @return {Observable<INarrative>}
     */
    public create(key: string, title: string): Observable<INarrative> {

        const aNarrative: INarrative = new Narrative({
            id: uuid.v4(),
            key: key,
            title: title
        });

        return from(aNarrative.save());
    }

    /**
     * @method deleteById
     * @param {string} id
     * @return {Observable<any>}
     */
    public deleteById(id: string): Observable<any> {
        let anItem: INarrative;
        return from(this.model.findOne({ id: id })).pipe(
            tap((item: INarrative) => anItem = item),
            concatMap(() => from(Thread.deleteMany({ narrativeId: anItem.id }))),
            concatMap(() => from(Outcome.deleteMany({ narrativeId: anItem.id }))),
            concatMap(() => from(Knot.deleteMany({ narrativeId: anItem.id }))),
            concatMap(() => from(anItem.remove()))
        );
    }
}