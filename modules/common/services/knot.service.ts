import { Observable, from } from 'rxjs';
import { concatMap, tap } from 'rxjs/operators';

import { LitService } from "@litstack/core";
import { ResourceService } from "./resource.service";
import { Model, Document } from 'mongoose';
import * as uuid from 'uuid';

import { NarrativeService } from './narrative.service';
import { Knot, IKnot } from '../models/knot.model';
import { IThread, Thread } from '../models/thread.model';
import { Outcome } from "../models/outcome.model";

@LitService()
export class KnotService extends ResourceService {

    model: Model<IKnot> = Knot;

    constructor(private narrativeService: NarrativeService) {
        super();
    }

    create(narrativeId: string, key: string, title: string): Observable<IKnot> {

        const aKnot: IKnot = new Knot({
            id: uuid.v4(),
            narrativeId: narrativeId,
            key: key,
            title: title
        });

        // ensure knot id exists
        return from(aKnot.save());
    }

    public deleteById(id: string): Observable<any> {
        let anItem: IKnot;
        return from(this.model.findOne({ id: id })).pipe(
            tap((item: IKnot) => anItem = item),
            concatMap(() => from(Thread.deleteMany({ narrativeId: anItem.id }))),
            concatMap(() => from(Outcome.deleteMany({ narrativeId: anItem.id }))),
            concatMap(() => from(anItem.remove()))
        );
    }
}