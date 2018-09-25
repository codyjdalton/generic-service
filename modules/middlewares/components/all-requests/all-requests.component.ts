/**
 * all-requests.component
 */
import { LitComponent } from '@litstack/core';
import { HttpRequest, HttpResponse, HttpNext } from '@litstack/core/dist/http';
import { RequestMapping } from '@litstack/core/dist/http/mappings';

@LitComponent()
export class AllRequestsComponent {
    
    @RequestMapping()
    home(req: HttpRequest, res: HttpResponse, next: HttpNext): void {
        // allow all headers and origins
        res.setHeaders('Access-Control-Allow-Origin', '*');
        res.setHeaders('Access-Control-Allow-Headers', '*');
        res.setHeaders('Access-Control-Allow-Methods', '*');
        next();
    }
}