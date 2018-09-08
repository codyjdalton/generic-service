import { expect } from 'chai';

import { TestBed, LitComponentTest } from '@litstack/core/dist/testing';
import { Injector } from 'super-injector';

import { Outcome, IOutcome } from '../../../common/models/outcome.model';
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
            .then((narrative: INarrative) => {
                knotService.create(narrative.id, 'testKey', 'Test Title')
                    .then((knot: IKnot) => {
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
        const testTitle: string = 'testOutcomeKey';

        component.post('/')
            .send({
                narrativeId: narrativeId,
                knotId: knotId,
                key: testKey,
                outcome: testTitle
            })
            .expect(201)
            .end((err, res) => {
                if (err) return done(err);
                
                // verify the item made it to storage
                outcomeService.findById(res.body.id)
                    .then(() => {
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

    it('should return error the narrative id does not match the knot id', (done) => {

        const testKey: string = 'testKey';
        const testTitle: string = 'testOutcomeKey';

        component.post('/')
            .send({
                narrativeId: 'does-not-match',
                knotId: knotId,
                key: testKey,
                outcome: testTitle
            })
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
});