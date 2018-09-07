/**
 * knot.component
 */
import { LitComponent } from '@litstack/core';
import { HttpResponse, HttpRequest } from '@litstack/core/dist/http';
import { GetMapping, DeleteMapping, PostMapping, RequestMapping } from '@litstack/core/dist/http/mappings';

import { KnotService } from '../../../common/services/knot.service';
import { IKnot } from '../../../common/models/knot.model';
import { ResourceComponent } from '../../../common/components/resource/resource.component.class';

@LitComponent()
export class KnotComponent extends ResourceComponent {

    constructor(protected mainService: KnotService) {
        super();
    }

    @PostMapping()
    public createOne(req: HttpRequest, res: HttpResponse): void {
        this.mainService.create(req.body.narrativeId, req.body.key, req.body.title)
            .then((knot: IKnot) => res.success(knot, 201))
            .catch(() => res.errored(400));
    }
}