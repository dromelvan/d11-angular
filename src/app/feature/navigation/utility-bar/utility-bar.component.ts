import { Component, ViewChild } from '@angular/core';
import { SearchAutocompleteComponent } from '@app/feature/component/search/search-autocomplete/search-autocomplete.component';
import { SearchDrawerComponent } from '@app/feature/component/search/search-drawer/search-drawer.component';
import { UserSessionComponent } from '@app/feature/component/user-session/user-session.component';
import { SvgIconComponent } from '@app/shared/svg-icon/svg-icon.component';

@Component({
  selector: 'app-utility-bar',
  imports: [
    UserSessionComponent,
    SearchAutocompleteComponent,
    SearchDrawerComponent,
    SvgIconComponent,
  ],
  templateUrl: './utility-bar.component.html',
})
export class UtilityBarComponent {
  @ViewChild(SearchDrawerComponent) private searchDrawer!: SearchDrawerComponent;

  protected openSearch(): void {
    this.searchDrawer.open();
  }
}
