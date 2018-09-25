import { Observable, from } from 'rxjs';

import { LitService } from "@litstack/core";
import { ResourceService } from "./resource.service";
import { Model, Document } from 'mongoose';
import * as uuid from 'uuid';

import { IThread, Thread } from "../models/thread.model";

@LitService()
export class ThreadService extends ResourceService {

    model: Model<IThread> = Thread;

    constructor() {
        super();
    }

    public create(narrativeId: string, knotId: string, outcomeId: string, title: string, headline: string, builders: string[],
        photoBackground: string, photoIcon: string, photoInList: boolean): Observable<IThread> {
        
        const aThread: IThread = new Thread({
            id: uuid.v4(),
            narrativeId: narrativeId,
            knotId: knotId,
            outcomeId: outcomeId,
            title: title,
            headline: headline,
            builders: builders,
            photoBackground: photoBackground,
            photoIcon: photoIcon,
            photoInList: Boolean(photoInList)
        });

        // ensure knot id exists
        return from(aThread.save());
    }
}