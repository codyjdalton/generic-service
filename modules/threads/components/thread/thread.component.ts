/**
 * outcome.component
 */
import { LitComponent } from '@litstack/core';
import { HttpRequest, HttpResponse } from '@litstack/core/dist/http';
import { PostMapping, PatchMapping } from '@litstack/core/dist/http/mappings';
import { ResourceComponent } from '../../../common/components/resource/resource.component.class';

import { Thread, IThread } from '../../../common/models/thread.model';
import { ThreadService } from '../../../common/services/thread.service';


@LitComponent()
export class ThreadComponent extends ResourceComponent  {

    constructor(public mainService: ThreadService) {
        super();
    }

    @PostMapping()
    createOne(req: HttpRequest, res: HttpResponse): void {
        const body: IThread = req.body;
        this.mainService.create(
            body.narrativeId,
            body.knotId,
            body.outcomeId,
            body.title,
            body.headline,
            body.builders,
            body.photoBackground,
            body.photoIcon,
            body.photoInList
        )
        .subscribe(
            (outcome: IThread) => res.success(outcome, 201),
            () => res.errored(400)
        );
    }

    @PatchMapping({
        path: ':id'
    })
    public update(req: HttpRequest, res: HttpResponse): void {

        const body: IThread = req.body;

        const updateBody: object = {
            title: body.title,
            headline: body.headline,
            builders: body.builders,
            photoBackground: body.photoBackground,
            photoIcon: body.photoIcon,
            photoInList: body.photoInList
        };

        this.mainService.updateByIdObservable(req.params.id, updateBody)
            .subscribe(
                (outcome: IThread) => res.success(outcome),
                (err) => res.errored(400, err)
            );
    }
}