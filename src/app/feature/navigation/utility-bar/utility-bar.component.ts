import { Component, ViewChild } from '@angular/core';
import { SearchAutocompleteComponent } from '@app/feature/component/search/search-autocomplete/search-autocomplete.component';
import { SearchDrawerComponent } from '@app/feature/component/search/search-drawer/search-drawer.component';
import { UserSessionComponent } from '@app/feature/component/user-session/user-session.component';
import { IconButtonComponent } from '@app/shared/button/icon-button/icon-button.component';

@Component({
  selector: 'app-utility-bar',
  imports: [
    UserSessionComponent,
    SearchAutocompleteComponent,
    SearchDrawerComponent,
    IconButtonComponent,
  ],
  templateUrl: './utility-bar.component.html',
})
export class UtilityBarComponent {
  @ViewChild(SearchDrawerComponent) private searchDrawer!: SearchDrawerComponent;

  protected openSearch(): void {
    this.searchDrawer.open();
  }
}
