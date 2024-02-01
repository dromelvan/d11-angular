import { Component } from '@angular/core';
import { D11ButtonComponent } from '../../component/d11-button/d11-button.component';
import { BreakpointService } from '../../shared/services/breakpoint.service';
import { NgIf } from '@angular/common';

@Component({
    selector: 'd11-home',
    imports: [D11ButtonComponent, NgIf],
    standalone: true,
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
    constructor(protected breakpointService: BreakpointService) {}
}
