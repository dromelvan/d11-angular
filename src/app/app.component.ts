import { Component } from '@angular/core';
import { BreakpointService } from './shared/services/breakpoint.service';

@Component({
    selector: 'd11-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {

    title = 'D11';

    constructor(protected breakpointService: BreakpointService) { }

}
