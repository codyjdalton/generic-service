// narratives.module.ts
import { LitModule } from '@litstack/core';

import { NarrativeComponent } from './components/narrative/narrative.component';

@LitModule({
    path: 'narratives',
    exports: [
        NarrativeComponent
    ],
})
export class NarrativesModule {

}