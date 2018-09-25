import { expect } from 'chai';

import { TestBed, LitComponentTest } from '@litstack/core/dist/testing';
import { Injector } from 'super-injector';

import { KnotComponent } from './knot.component';
import { Knot, IKnot } from '../../../common/models/knot.model';
import { KnotService } from '../../../common/services/knot.service';
import { NarrativeService } from '../../../common/services/narrative.service';
import { Narrative, INarrative } from '../../../common/models/narrative.model';

describe('KnotComponent', () => {

    let component: LitComponentTest;
    let knotService: KnotService;
    let narrativeService: NarrativeService;

    beforeEach(() => {
        
        component = TestBed.start(KnotComponent);
        knotService = Injector.resolve(KnotService);
        narrativeService = Injector.resolve(NarrativeService);
    });

    afterEach((done) => {

        // rollback changes
        Knot.deleteMany({})
            .then(() => {

                Narrative.deleteMany({})
                    .then(() => {
                        TestBed.stop();
                        done();
                    });
            });
    });

    it('should allow creating a knot', (done) => {
        
        narrativeService.create('testKey', 'test title')
            .subscribe((narrative: INarrative) => {
                component.post('/')
                    .send({ narrativeId: narrative.id, key: 'test knot', title: 'test title' })
                    .expect(201)
                    .end((err, res: IKnot) => {
                        if (err) return done(err);
                        knotService.findById(res.id)
                            .then((knot: IKnot) => {
                                expect(knot.id).to.equal(res.id)
                                done();
                            })
                            .catch((err) => done(err));
                    });
            }, (err) => done(err));
    });

    it('should require all required fields', (done) => {
        
        narrativeService.create('testKey', 'test title')
            .subscribe((narrative: INarrative) => {
                component.post('/')
                    .send({ narrativeId: narrative.id })
                    .expect(400)
                    .end((err, res: IKnot) => {
                        if (err) return done(err);
                        done();
                    });
            }, (err) => done(err));
    });

    it('should throw an error if a narrative is not associated with a knot', (done) => {
        
        component.post('/')
            .send({ narrativeId: 'does-not-exist', key: 'test-key', title: 'test-title' })
            .expect(400)
            .end((err, res: IKnot) => {
                if (err) return done(err);
                knotService.findById(res.id)
                    .then((knot: IKnot) => {
                        expect(knot.id).to.equal(res.id)
                        done();
                    })
                    .catch((err) => done(err));
            });
    });

    it('should allow deleting a knot', (done) => {

        narrativeService.create('testKey', 'test title')
            .subscribe((narrative: INarrative) => {
                knotService.create(narrative.id, 'testKey', 'title')
                    .then((knot) => {
                        component.delete('/' + knot.id)
                            .expect(204)
                            .end((err) => {
                                if (err) return done(err);
                                done();
                            });
                    });
            }, (err) => done(err));
    });

    it('should update patched fields', (done) => {
        narrativeService.create('testKey', 'test title')
            .subscribe((narrative: INarrative) => {
                knotService.create(narrative.id, 'testKey', 'title')
                    .then((knot) => {
                        component.patch('/' + knot.id)
                            .send({ title: 'anothertesttitle' })
                            .expect(200)
                            .end((err) => {
                                if (err) return done(err);
                                done();
                            });
                    });
            }, (err) => done(err));
    });

    it('should throw an error when updating patched fields fails', (done) => {
        component.patch('/noexist')
            .send({ key: '' })
            .expect(400)
            .end((err) => {
                if (err) return done(err);
                done();
            });
    });
});