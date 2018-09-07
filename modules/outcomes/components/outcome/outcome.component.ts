/**
 * outcome.component
 */
import { LitComponent } from '@litstack/core';
import { HttpResponse, HttpRequest } from '@litstack/core/dist/http';
import { GetMapping, DeleteMapping, PostMapping } from '@litstack/core/dist/http/mappings';

import { OutcomeService } from '../../../common/services/outcome.service';
import { ResourceComponent } from '../../../common/components/resource/resource.component.class';
import { IOutcome } from '../../../common/models/outcome.model';

@LitComponent()
export class OutcomeComponent extends ResourceComponent  {

    constructor(protected mainService: OutcomeService) {
        super();
    }

    @PostMapping()
    public createOne(req: HttpRequest, res: HttpResponse): void {
        this.mainService.create(req.body.narrativeId, req.body.knotId, req.body.key, req.body.outcome)
            .then((outcome: IOutcome) => res.success(outcome, 201))
            .catch(() => res.errored(400));
    }
}