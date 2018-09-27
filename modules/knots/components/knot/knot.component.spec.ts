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
    let aNarrative: INarrative;

    before((done) => {
        knotService = Injector.resolve(KnotService);
        narrativeService = Injector.resolve(NarrativeService);

        narrativeService.create('testKey', 'test title')
            .subscribe(
                (narrative: INarrative) => {
                    aNarrative = narrative;
                    done();
                }
            );
    });

    beforeEach(() => {
        
        component = TestBed.start(KnotComponent);
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
        component.post('/')
            .send({ narrativeId: aNarrative.id, key: 'test knot', title: 'test title' })
            .expect(201)
            .end((err, res) => {
                if (err) return done(err);
                knotService.findById(res.body.id)
                    .subscribe(
                        (knot: IKnot) => {  
                            expect(knot.id).to.equal(res.body.id)
                            done();
                        },
                        (err) => done(err)
                    );
            });
    });

    it('should require all required fields', (done) => {
        component.post('/')
            .send({ narrativeId: aNarrative.id })
            .expect(400)
            .end((err) => {
                if (err) return done(err);
                done();
            });
    });

    it('should allow deleting a knot', (done) => {
        knotService.create(aNarrative.id, 'testKey', 'title')
            .subscribe((knot) => {
                component.delete('/' + knot.id)
                    .expect(204)
                    .end((err) => {
                        if (err) return done(err);
                        done();
                    });
            });
    });

    it('should update patched fields', (done) => {
        knotService.create(aNarrative.id, 'testKey', 'title')
            .subscribe((knot) => {
                component.patch('/' + knot.id)
                    .send({ title: 'anothertesttitle' })
                    .expect(200)
                    .end((err) => {
                        if (err) return done(err);
                        done();
                    });
            });
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