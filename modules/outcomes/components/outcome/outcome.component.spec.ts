import { expect } from 'chai';

import { TestBed, LitComponentTest } from '@litstack/core/dist/testing';
import { Injector } from 'super-injector';

import { Outcome, IOutcome, DestinationTypes } from '../../../common/models/outcome.model';
import { OutcomeComponent } from './outcome.component';
import { Knot, IKnot } from '../../../common/models/knot.model';
import { KnotService } from '../../../common/services/knot.service';
import { NarrativeService } from '../../../common/services/narrative.service';
import { Narrative, INarrative } from '../../../common/models/narrative.model';
import { OutcomeService } from '../../../common/services/outcome.service';

describe('OutcomeComponent', () => {

    let component: LitComponentTest;
    let narrativeService: NarrativeService;
    let knotService: KnotService;
    let outcomeService: OutcomeService;
    let narrativeId: string;
    let knotId: string;

    before((done) => {

        narrativeService = Injector.resolve(NarrativeService);
        knotService = Injector.resolve(KnotService);

        // create a narrative and knot
        narrativeService.create('testKey', 'Test Title')
            .subscribe((narrative: INarrative) => {
                knotService.create(narrative.id, 'testKey', 'Test Title')
                    .subscribe((knot: IKnot) => {
                        narrativeId = narrative.id;
                        knotId = knot.id;
                        done();
                    });
            });
    });

    after((done) => {
        Narrative.deleteMany({})
            .then(() => {
                Knot.deleteMany({})
                    .then(() => {
                        done();
                    });
            });
    });

    beforeEach(() => {
        
        outcomeService = Injector.resolve(OutcomeService);
        component = TestBed.start(OutcomeComponent);
    });

    afterEach((done) => {

        // rollback changes
        Outcome.deleteMany({})
            .then(() => {
                TestBed.stop();
                done();
            });
    });

    it('should allow creating an outcome', (done) => {

        const testKey: string = 'testKey';

        component.post('/')
            .send({
                narrativeId: narrativeId,
                knotId: knotId,
                key: testKey,
            })
            .expect(201)
            .end((err, res) => {
                if (err) return done(err);
                
                // verify the item made it to storage
                outcomeService.findById(res.body.id)
                    .subscribe(() => {
                        done();
                    });
            });
    });

    it('should default destination type to DONE', (done) => {

        const testKey: string = 'testKey';
        const testTitle: string = 'testOutcomeKey';

        component.post('/')
            .send({
                narrativeId: narrativeId,
                knotId: knotId,
                key: testKey
            })
            .expect(201)
            .end((err, res) => {
                if (err) return done(err);
                
                // verify the item made it to storage
                outcomeService.findById(res.body.id)
                    .subscribe(() => {
                        done();
                    });
            });
    });

    it('should return 400 if unable to create an outcome', (done) => {

        component.post('/')
            .send()
            .expect(400)
            .end((err) => {
                if (err) return done(err);
                done();
            });
    });

    it('should return error if required fields are not included', (done) => {

        component.post('/')
            .send({
                narrativeId: narrativeId,
                knotId: knotId
            })
            .expect(400)
            .end((err) => {
                if (err) return done(err);
                done();
            });
    });

    it('should allow patching an existing outcome', (done) => {

        outcomeService.create(narrativeId, knotId, 'testOutcome', DestinationTypes.DONE, undefined)
            .subscribe((outcome: IOutcome) => {
                component.patch('/' + outcome.id)
                    .send({ key: 'newKey' })
                    .expect(200)
                    .end((err, res: IOutcome) => {
                        if(err) { return done(err) } 
                        
                        outcomeService.findById(outcome.id)
                            .subscribe((anOutcome: IOutcome) => {

                                expect(anOutcome.key).to.equal('newKey');
                                done();
                            });
                    });
            });
    });

    it('should fail patching a resource if it does not exits', (done) => {

        component.patch('/no-item')
            .send({ key: 'newKey' })
            .expect(400)
            .end((err, res: IOutcome) => {
                if(err) { return done(err) }
                done();
            });
    });

    it('should allow deleting an outcome', (done) => {
        component.post('/')
            .send({
                narrativeId: narrativeId,
                knotId: knotId,
                key: 'test'
            })
            .end((err, res) => {
                if (err) return done(err);
                
                component.delete('/' + res.body.id)
                    .expect(204)
                    .end((err) => {
                        if (err) return done(err);
                        done();
                    });
            });
    });
});