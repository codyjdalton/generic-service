
import { HttpResponse, HttpRequest } from '@litstack/core/dist/http';
import { GetMapping, DeleteMapping } from '@litstack/core/dist/http/mappings';
import { Document } from "mongoose";

import { ResourceService } from '../../services/resource.service';

export abstract class ResourceComponent {

    protected mainService: ResourceService;

    @GetMapping()
    public findAll(res: HttpResponse): void {
        this.mainService.findAll()
            .then((items: Document[]) => res.success(items));
    }

    @GetMapping({
        path: ':id'
    })
    public findOne(req: HttpRequest, res: HttpResponse): void {
        this.mainService.findById(req.params.id)
            .then((item: Document) => res.success(item))
            .catch(() => res.errored(404));
    }

    @DeleteMapping({
        path: ':id'
    })
    public deleteById(req: HttpRequest, res: HttpResponse): void {
        this.mainService.deleteById(req.params.id)
            .then(() => res.success({}, 204))
            .catch(() => res.errored(404));
    }
}