import { Component, computed, inject } from '@angular/core';
import { NgClass } from '@angular/common';
import { D11LionLightImgComponent } from '@app/shared/img/d11-lion-light-img/d11-lion-light-img.component';
import { SvgIconComponent } from '@app/shared/svg-icon/svg-icon.component';
import { PageContextService } from '@app/core/page-context/page-context.service';
import { RouterService } from '@app/core/router/router.service';
import { NavbarLinkComponent } from '@app/feature/navigation/navbar-link/navbar-link.component';
import { UtilityBarComponent } from '@app/feature/navigation/utility-bar/utility-bar.component';
import { BACKGROUND } from '@app/app.theme';
import { AvatarModule } from 'primeng/avatar';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  imports: [
    NgClass,
    D11LionLightImgComponent,
    SvgIconComponent,
    NavbarLinkComponent,
    UtilityBarComponent,
    AvatarModule,
  ],
  host: { style: 'display: block' },
})
export class HeaderComponent {
  protected readonly backgroundColor = computed(() => this.pageContextService.backgroundColor());
  protected readonly effectiveBackgroundColor = computed(
    () => this.backgroundColor() || BACKGROUND,
  );
  protected readonly hasStack = computed(() => this.routerService.hasStack());
  protected readonly headerClasses = computed(() => {
    const classes: string[] = [];
    const textClass = this.pageContextService.textClass();
    if (textClass) classes.push(textClass);
    if (this.backgroundColor()) classes.push('app-hero-background');
    return classes;
  });
  protected readonly subtitle = computed(() => this.pageContextService.subtitle());
  protected readonly title = computed(() => this.pageContextService.title());

  private readonly pageContextService = inject(PageContextService);
  private readonly routerService = inject(RouterService);

  protected navigateToPrevious(): void {
    this.routerService.navigateToPrevious();
  }
}
