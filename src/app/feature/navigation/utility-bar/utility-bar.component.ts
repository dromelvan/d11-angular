import { Component } from '@angular/core';
import { SearchAutocompleteComponent } from '@app/feature/search/search-autocomplete/search-autocomplete.component';
import { UserSessionComponent } from '@app/feature/authentication/user-session/user-session.component';
import { ButtonIconComponent } from '@app/shared/form';

@Component({
  selector: 'app-utility-bar',
  imports: [UserSessionComponent, SearchAutocompleteComponent, ButtonIconComponent],
  templateUrl: './utility-bar.component.html',
})
export class UtilityBarComponent {}
