import { Component, inject } from '@angular/core';
import { LoadingService } from '@app/core/loading/loading.service';
import { ProgressBarModule } from 'primeng/progressbar';

@Component({
  selector: 'app-loading',
  imports: [ProgressBarModule],
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.css',
})
export class LoadingComponent {
  loadingService = inject(LoadingService);
}
