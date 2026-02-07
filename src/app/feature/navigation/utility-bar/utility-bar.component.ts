import { Component } from '@angular/core';
import { SearchAutocompleteComponent, UserSessionComponent } from '@app/feature';
import { ButtonIconComponent } from '@app/shared/form';

@Component({
  selector: 'app-utility-bar',
  imports: [UserSessionComponent, SearchAutocompleteComponent, ButtonIconComponent],
  templateUrl: './utility-bar.component.html',
})
export class UtilityBarComponent {}
