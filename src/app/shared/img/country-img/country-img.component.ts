import { Component, computed, input } from '@angular/core';
import { Country } from '@app/core/api';
import { ImgComponent } from '@app/shared/img/img.component';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-country-img',
  imports: [ImgComponent],
  templateUrl: './country-img.component.html',
})
export class CountryImgComponent {
  country = input.required<Country>();
  extension = input<string>('png');
  size = input<number>(24);

  protected imageUrl = computed(
    () => `${environment.imageHost}/images/country/${this.country().iso}.${this.extension()}`,
  );
}
