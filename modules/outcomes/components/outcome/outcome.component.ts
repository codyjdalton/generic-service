/**
 * outcome.component
 */
import { LitComponent } from '@litstack/core';
import { HttpRequest, HttpResponse } from '@litstack/core/dist/http';
import { PostMapping } from '@litstack/core/dist/http/mappings';

import { IOutcome } from '../../../common/models/outcome.model';
import { OutcomeService } from '../../../common/services/outcome.service';
import { ResourceComponent } from '../../../common/components/resource/resource.component.class';


@LitComponent()
export class OutcomeComponent extends ResourceComponent  {

    constructor(protected mainService: OutcomeService) {
        super();
    }

    @PostMapping()
    createOne(req: HttpRequest, res: HttpResponse): void {
        const body: IOutcome = req.body;
        this.mainService.create(body.narrativeId, body.knotId, body.key, body.outcome)
            .then((outcome: IOutcome) => res.success(outcome, 201))
            .catch(() => res.errored(400));
    }
}