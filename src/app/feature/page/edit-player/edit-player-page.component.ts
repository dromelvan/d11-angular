import { Component, input, numberAttribute } from '@angular/core';
import { EditPlayerComponent } from '@app/feature/component/edit-player/edit-player.component';

@Component({
  selector: 'app-edit-player-page',
  imports: [EditPlayerComponent],
  templateUrl: './edit-player-page.component.html',
})
export class EditPlayerPageComponent {
  playerId = input.required({ transform: numberAttribute });
}
