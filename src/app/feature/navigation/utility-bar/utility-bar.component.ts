import { Component, ViewChild } from '@angular/core';
import { SearchAutocompleteComponent } from '@app/feature/search/search-autocomplete/search-autocomplete.component';
import { SearchDrawerComponent } from '@app/feature/search/search-drawer/search-drawer.component';
import { UserSessionComponent } from '@app/feature/authentication/user-session/user-session.component';
import { ButtonIconComponent } from '@app/shared/form';

@Component({
  selector: 'app-utility-bar',
  imports: [
    UserSessionComponent,
    SearchAutocompleteComponent,
    SearchDrawerComponent,
    ButtonIconComponent,
  ],
  templateUrl: './utility-bar.component.html',
})
export class UtilityBarComponent {
  @ViewChild(SearchDrawerComponent) private searchDrawer!: SearchDrawerComponent;

  protected openSearch(): void {
    this.searchDrawer.open();
  }
}
