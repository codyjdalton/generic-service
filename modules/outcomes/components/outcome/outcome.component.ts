/**
 * outcome.component
 */
import { LitComponent } from '@litstack/core';
import { HttpRequest, HttpResponse } from '@litstack/core/dist/http';
import { PostMapping, PatchMapping } from '@litstack/core/dist/http/mappings';

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
        this.mainService.create(body.narrativeId, body.knotId, body.key, body.destinationType, body.destinationId)
            .then((outcome: IOutcome) => res.success(outcome, 201))
            .catch(() => res.errored(400));
    }

    @PatchMapping({
        path: ':id'
    })
    public update(req: HttpRequest, res: HttpResponse): void {

        const body: IOutcome = req.body;

        const updateBody: object = {
            narrativeId: body.narrativeId,
            knotId: body.knotId,
            key: body.key,
            destinationType: body.destinationType,
            destinationId: body.destinationId
        };

        this.mainService.updateById(req.params.id, updateBody)
            .then((outcome: IOutcome) => res.success(outcome))
            .catch((err) => res.errored(400, err));
    }
}