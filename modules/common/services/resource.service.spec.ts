
import { expect } from 'chai';
import { Model } from "mongoose";
import { Injector } from 'super-injector';
import { ResourceService } from './resource.service';

import { Narrative, INarrative } from '../models/narrative.model';

describe('Service:ResourceService', () => {

    class ResourceServiceStub extends ResourceService {
        model: Model<INarrative> = Narrative;
    }

    let service: ResourceService;

    beforeEach(() => {

        service = Injector.resolve(ResourceServiceStub);
    });

    it('should throw an error when unable to find by params', (done) => {

        const disruptor: any = 1;

        service.findByParams(disruptor)
            .subscribe(
                () => {},
                () => done()
            );
    });

    it('should throw an error when unable to find by id', (done) => {

        const disruptor: any = {};

        service.findById(disruptor)
            .subscribe(
                () => {},
                () => done()
            );
    });
});

