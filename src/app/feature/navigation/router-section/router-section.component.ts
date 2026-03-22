import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs';

@Component({
  selector: 'app-router-section',
  imports: [],
  templateUrl: './router-section.component.html',
})
export class RouterSectionComponent {
  private readonly router = inject(Router);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  protected readonly section = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => {
        let route = this.router.routerState.snapshot.root;
        while (route.firstChild) {
          route = route.firstChild;
        }
        return (route.data['section'] as string) ?? null;
      }),
    ),
  );
}
