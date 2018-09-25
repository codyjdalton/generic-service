// app.module.ts
import { LitModule } from '@litstack/core';

import { AppComponent } from './app.component';
import { KnotsModule } from './knots/knots.module';
import { NarrativesModule } from './narratives/narratives.module';
import { OutcomesModule } from './outcomes/outcomes.module';
import { MiddlewaresModule } from './middlewares/middlewares.module';
import { ThreadsModule } from './threads/threads.module';

@LitModule({
    exports: [
        AppComponent
    ],
    imports: [
        MiddlewaresModule,
        ThreadsModule,
        NarrativesModule,
        KnotsModule,
        OutcomesModule
    ]
})
export class AppModule {

}