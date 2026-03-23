import { Component, inject } from '@angular/core';
import { RouterService } from '@app/core/router/router.service';

@Component({
  selector: 'app-router-section',
  imports: [],
  templateUrl: './router-section.component.html',
})
export class RouterSectionComponent {
  protected routerService = inject(RouterService);
}
