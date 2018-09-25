// threads.module.ts
import { LitModule } from '@litstack/core';
import { ThreadComponent } from './components/thread/thread.component';


@LitModule({
    path: 'threads',
    exports: [
        ThreadComponent
    ]
})
export class ThreadsModule {

}