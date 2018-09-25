import { expect } from 'chai';

import { TestBed, LitComponentTest } from '@litstack/core/dist/testing';
import { Injector } from 'super-injector';

import { Outcome, IOutcome, DestinationTypes } from '../../../common/models/outcome.model';
import { ThreadComponent } from './thread.component';
import { Knot, IKnot } from '../../../common/models/knot.model';
import { KnotService } from '../../../common/services/knot.service';
import { NarrativeService } from '../../../common/services/narrative.service';
import { Narrative, INarrative } from '../../../common/models/narrative.model';
import { OutcomeService } from '../../../common/services/outcome.service';
import { ThreadService } from '../../../common/services/thread.service';
import { Thread, IThread } from '../../../common/models/thread.model';

describe('ThreadComponent', () => {

    let component: LitComponentTest;
    let narrativeService: NarrativeService;
    let knotService: KnotService;
    let outcomeService: OutcomeService;
    let threadService: ThreadService;
    let narrativeId: string;
    let knotId: string;
    let outcomeId: string;

    before((done) => {

        narrativeService = Injector.resolve(NarrativeService);
        knotService = Injector.resolve(KnotService);
        outcomeService = Injector.resolve(OutcomeService);
        threadService = Injector.resolve(ThreadService);

        // create a narrative and knot
        narrativeService.create('testKey', 'Test Title')
            .subscribe((narrative: INarrative) => {
                knotService.create(narrative.id, 'testKey', 'Test Title')
                    .then((knot: IKnot) => {
                        narrativeId = narrative.id;
                        knotId = knot.id;
                        outcomeService.create(narrativeId, knotId, 'testKey', DestinationTypes.DONE, 'testid')
                            .then((outcome: IOutcome) => {
                                outcomeId = outcome.id;
                                done();
                            });
                    });
            });
    });

    after((done) => {
        narrativeService.deleteById(narrativeId)
            .subscribe(() => done());
    });

    beforeEach(() => {
        component = TestBed.start(ThreadComponent);
    });

    afterEach((done) => {

        // rollback changes
        Thread.deleteMany({})
            .then(() => {
                TestBed.stop();
                done();
            });
    });

    it('should allow creating a thread', (done) => {
        component.post('/')
            .send({
                narrativeId: narrativeId,
                knotId: knotId,
                outcomeId: outcomeId,
                title: 'test title',
                headline: 'test headline',
                builders: [],
                photoBackground: 'test-background',
                photoIcon: 'test-icon',
                photoInList: 'test'
            })
            .expect(201)
            .end((err, res) => {
                if (err) return done(err);
                
                // verify the item made it to storage
                threadService.findById(res.body.id)
                    .then(() => {
                        done();
                    });
            });
    });

    it('should fail if unable to create a thread', (done) => {
        component.post('/')
            .send({})
            .expect(400)
            .end((err, res) => {
                if (err) return done(err);
                done();
            });
    });

    it('should allow updating a thread', (done) => {

        component.post('/')
            .send({
                narrativeId: narrativeId,
                knotId: knotId,
                outcomeId: outcomeId,
                title: 'test title',
                headline: 'test headline',
                builders: [],
                photoBackground: 'test-background',
                photoIcon: 'test-icon',
                photoInList: 'test'
            })
            .end((err, res) => {
                if (err) return done(err);
                
                component.patch('/' + res.body.id)
                    .send({ title: 'another title' })
                    .expect(200)
                    .end((err, res2) => {
                        expect(res2.body.title).to.equal('another title');
                        done();
                    });
            });
    });

    it('should fail if unable to update a thread', (done) => {

        component.patch('/asdads')
            .send({ narrativeId: '' })
            .expect(400)
            .end((err, res2) => {
                if (err) return done(err);
                done();
            });
    });

    it('should allow deleting a thread', (done) => {
        component.post('/')
            .send({
                narrativeId: narrativeId,
                knotId: knotId,
                outcomeId: outcomeId,
                title: 'test title',
                headline: 'test headline',
                builders: [],
                photoBackground: 'test-background',
                photoIcon: 'test-icon',
                photoInList: 'test'
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