import { LitService } from "@litstack/core";
import { ResourceService } from "./resource.service";
import { Model, Document } from 'mongoose';
import * as uuid from 'uuid';

import { NarrativeService } from './narrative.service';
import { Knot, IKnot } from '../models/knot.model';

@LitService()
export class KnotService extends ResourceService {

    model: Model<IKnot> = Knot;

    constructor(private narrativeService: NarrativeService) {
        super();
    }

    create(narrativeId: string, key: string, title: string): Promise<IKnot> {
        return new Promise((resolve, reject) => {

            const aKnot: IKnot = new Knot({
                id: uuid.v4(),
                narrativeId: narrativeId,
                key: key,
                title: title
            });

            // ensure knot id exists
            this.narrativeService.findById(narrativeId)
                .then(() => {
                    aKnot.save()
                        .then((knot: IKnot) => resolve(knot))
                        .catch(() => reject());
                })
                .catch(() => reject());
        });
    }
}