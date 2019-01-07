// app.module.ts
import { LitModule } from '@litstack/core';

import { AppComponent } from './app.component';
import { MiddlewaresModule } from './middlewares/middlewares.module';

@LitModule({
    exports: [
        AppComponent
    ],
    imports: [
        MiddlewaresModule,
    ]
})
export class AppModule {

}