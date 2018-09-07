import { LitService } from "@litstack/core";
import { ResourceService } from "./resource.service";
import { Model } from 'mongoose';
import * as uuid from 'uuid';

import { Narrative, INarrative } from '../models/narrative.model';

@LitService()
export class NarrativeService extends ResourceService {

    model: Model<INarrative> = Narrative;

    create(key: string, title: string): Promise<INarrative> {

        return new Promise((resolve, reject) => {

            const aNarrative: INarrative = new Narrative({
                id: uuid.v4(),
                key: key,
                title: title
            });

            aNarrative.save()
                .then((narrative: INarrative) => resolve(narrative))
                .catch(() => reject());
        });
    }
}