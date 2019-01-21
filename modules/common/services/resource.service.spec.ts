
import { expect } from 'chai';
import { Model } from "mongoose";
import { Injector } from 'super-injector';
import { ResourceService } from './resource.service';
import { from } from "rxjs";

import { Resource, IResource } from '../models/resource.model';

describe('Service:ResourceService', () => {

    class ResourceServiceStub extends ResourceService {
        model: Model<IResource> = Resource;

        create(id: string, name: string) {

            const aNarrative: IResource = new Resource({
                id: id,
                name: name
            });

            return from(aNarrative.save());
        }
    }

    let service: ResourceServiceStub;

    beforeEach(() => {

        service = Injector.resolve(ResourceServiceStub);
    });

    afterEach((done) => {

        Resource.deleteMany({})
            .then(() => {
                done();
            });
    });

    it('should return all results for a given resource', (done) => {

        const expectedResult = {
            id: 'test-id',
            name: 'test name'
        };

        service.create('test-id', 'test name')
            .subscribe(
                () => {
                    // verify the item is returned
                    service.findAll()
                        .subscribe(
                            (res) => {
                                const result = JSON.parse(JSON.stringify(res[0]));

                                // remove id and version
                                delete result['__v'];
                                delete result['_id'];
                                expect(result).deep.equals(expectedResult);
                                done();
                            }
                        );
                }
            );
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

    it('should allow updating a record by id', (done) => {

        const expectedName: string = 'test name 2';

        service.create('test-id', 'test name')
            .subscribe(
                (res) => {

                    // update the id
                    service.updateByIdObservable('test-id', {
                        name: expectedName
                    })
                    .subscribe(
                        (res2: any) => {
                            expect(res2.name).equal(expectedName);
                            done();
                        }
                    );
                });
    });

    it('should NOT allow updating the id of a record', (done) => {

        service.create('test-id', 'test name')
            .subscribe(
                (res) => {

                    // update the id
                    service.updateByIdObservable('test-id', {
                        id: 'no-id'
                    })
                    .subscribe(
                        (res2: any) => {
                            expect(res2.id).equal('test-id');
                            done();
                        }
                    );
                });
    });

    it('should allow finding an item by id', (done) => {
        service.create('test-id', 'test name')
            .subscribe(
                (res) => {
                    
                    service.findById('test-id')
                        .subscribe(
                            (item) => {
                                expect(item).to.not.be.null;
                                done();
                            }
                        );
                });

    });

    it('should err if no item is found', (done) => {
        service.create('test-id', 'test name')
            .subscribe(
                (res) => {
                    service.findById('test-id-1')
                        .subscribe(
                            (item) => {},
                            (err) => {
                                expect(err).to.not.be.null;
                                done();
                            }
                        );
                });

    });

    it('should allow removing an item by id', (done) => {
        service.create('test-id', 'test name')
            .subscribe(
                (res) => {
                    service.deleteById('test-id')
                        .subscribe(
                            () => {
                                service.findById('test-id')
                                    .subscribe(
                                        (item) => {},
                                        (err) => {
                                            expect(err).to.not.be.null;
                                            done();
                                        }
                                    );
                            }
                        );
                });

    });
});

