// outcomes.module.ts
import { LitModule } from '@litstack/core';

import { OutcomeComponent } from './components/outcome/outcome.component';

@LitModule({
    path: 'outcomes',
    exports: [
        OutcomeComponent
    ],
})
export class OutcomesModule {

}