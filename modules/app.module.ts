// app.module.ts
import { LitModule } from '@litstack/core';

import { AppComponent } from './app.component';
import { KnotsModule } from './knots/knots.module';
import { NarrativesModule } from './narratives/narratives.module';
import { OutcomesModule } from './outcomes/outcomes.module';

@LitModule({
    exports: [
        AppComponent
    ],
    imports: [
        NarrativesModule,
        KnotsModule,
        OutcomesModule
    ]
})
export class AppModule {

}