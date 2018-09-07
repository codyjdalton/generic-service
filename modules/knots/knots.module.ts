// knots.module.ts
import { LitModule } from '@litstack/core';

import { KnotComponent } from './components/knot/knot.component';

@LitModule({
    path: 'knots',
    exports: [
        KnotComponent
    ],
})
export class KnotsModule {

}