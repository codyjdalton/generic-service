import { expect } from 'chai';

import { Observable, from, of } from "rxjs";
import { map, concatMap, tap, concat } from 'rxjs/operators';

import { TestBed, LitComponentTest } from '@litstack/core/dist/testing';
import { Injector } from 'super-injector';

import { KnotService } from '../../../common/services/knot.service';
import { NarrativeComponent } from './narrative.component';
import { Narrative, INarrative } from '../../../common/models/narrative.model';
import { NarrativeService } from '../../../common/services/narrative.service';
import { IKnot } from '../../../common/models/knot.model';

describe('NarrativeComponent', () => {

    let component: LitComponentTest;
    let narrativeService: NarrativeService;
    let knotService: KnotService;

    beforeEach(() => {
        
        component = TestBed.start(NarrativeComponent);
        narrativeService = Injector.resolve(NarrativeService);
        knotService = Injector.resolve(KnotService);
    });

    afterEach((done) => {

        // rollback changes
        Narrative.deleteMany({})
            .then(() => {
                TestBed.stop();
                done();
            });
    });

    it('should return a single resource', (done) => {
        const testKey: string = 'testKey';
        const testTitle: string = 'Test Title';
        
        narrativeService.create(testKey, testTitle)
            .subscribe((narrative) => {
                component.get('/' + narrative.id)
                    .expect(200)
                    .expect((res) => {
                        expect(res.body.id).equal(narrative.id);
                    })
                    .end((err, res) => {
                        if (err) return done(err);
                        done();
                    });
            }, () => done(new Error('Unable to create narrative')));
    });

    it('should 404 when a single resource is not found', (done) => {

        component.get('/does-not-exist')
            .expect(404)
            .end((err) => {
                if (err) return done(err);
                done();
            });
    });

    it('should list resources', (done) => {

        const testKey: string = 'testKey';
        const testTitle: string = 'Test Title';
        
        narrativeService.create(testKey, testTitle)
            .subscribe(() => {
                component.get('/')
                    .expect(200)
                    .expect((res) => {
                        expect(res.body.length).equal(1);
                    })
                    .end((err, res) => {
                        if (err) return done(err);
                        done();
                    });
            }, (err) => done(err));
    });

    it('should allow creating a resource', (done) => {

        const testKey: string = 'testKey';
        const testTitle: string = 'Test Title';
        
        component.post('/')
            .send({ key: testKey, title: testTitle })
            .expect(201)
            .expect((res) => {
                expect(res.body.key).to.equal(testKey);
            })
            .end((err, res) => {
                if (err) return done(err);
                
                narrativeService.findById(res.body.id)
                    .subscribe(
                        (narrative) => {
                            expect(narrative.id).to.equal(res.body.id);
                            done();
                        },
                        (err) => done(err)
                    );
            });
    });

    it('should throw an error if a key is duplicated', (done) => {

        const testKey: string = 'testKey';
        const testTitle: string = 'Test Title';

        narrativeService.create(testKey, testTitle)
            .subscribe(() => {
                component.post('/')
                    .send({ key: testKey, title: testTitle })
                    .expect(400)
                    .end((err) => {
                        if (err) return done(err);
                        done();
                    });
            }, (err) => done(err))
    });

    it('should allow deleting a resource', (done) => {

        const testKey: string = 'testKey';
        const testTitle: string = 'Test Title';
        
        narrativeService.create(testKey, testTitle)
            .subscribe((narrative) => {
                
                component.delete('/' + narrative.id)
                    .expect(204)
                    .end((err) => {
                        if (err) return done(err);
                        done();
                    });
            }, (err) => done(err));
    });

    it('should 404 when a resource to be deleted is not found', (done) => {

        component.delete('/does-not-exist')
            .expect(404)
            .end((err) => {
                if (err) return done(err);
                done();
            });
    });

    it('should allow updating a resource', (done) => {

        const testKey: string = 'testKey';
        const testTitle: string = 'Test Title';
        const newTitle: string = 'New Title';
        
        narrativeService.create(testKey, testTitle)
            .subscribe((narrative) => {
                component.patch('/' + narrative.id)
                    .send({ title: newTitle })
                    .expect(200)
                    .end((err) => {
                        if (err) return done(err);
                        narrativeService.findById(narrative.id)
                            .subscribe(
                                (checkNarrative: INarrative) => {
                                    expect(checkNarrative.title).to.equal(newTitle);
                                    done();
                                },
                                () => done(new Error('Unable to find patched narrative'))
                            );
                    });
            }, () => done(new Error('Unable to create narrative')));
    });

    it('should throw an error when patching invalid fields', (done) => {

        const testKey: string = 'testKey';
        const testTitle: string = 'Test Title';
        const newKey: string = 'testKey';
        
        narrativeService.create('newKey', testTitle)
            .subscribe(() => {
                narrativeService.create(testKey, testTitle)
                    .subscribe((narrative) => {
                        component.patch('/' + narrative.id)
                            .send({ key: 'newKey' })
                            .expect(400)
                            .end((err) => {
                                if (err) return done(err);
                                done();
                            });
                    }, () => done(new Error('Unable to create narrative')));
            });
    });

    it('should return 400 if a resource update was not successful', (done) => {
                
        component.patch('/not-found')
            .send({})
            .expect(400)
            .end((err) => {
                done();
            });
    });

    it('should cascade delete', (done) => {

        let aNarrative: INarrative;

        from(narrativeService.create('test', 'title'))
            .pipe(
                tap((narrative: INarrative) => aNarrative = narrative),
                concatMap(() => knotService.create(aNarrative.id, 'testKey', 'test title'))
            )
            .subscribe(
                (knot: IKnot) => {
                    component.delete('/' + aNarrative.id)
                        .expect(204)
                        .end(() => {
                            knotService.findById(knot.id)
                                .subscribe(
                                    () => {},
                                    () => done()
                                );
                        });
                }
            );
    });
});
