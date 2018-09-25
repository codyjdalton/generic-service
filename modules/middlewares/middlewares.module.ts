// app.module.ts
import { LitModule } from '@litstack/core';
import { AllRequestsComponent } from './components/all-requests/all-requests.component';

@LitModule({
    exports: [
        AllRequestsComponent
    ]
})
export class MiddlewaresModule {

}