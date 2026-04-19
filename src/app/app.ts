import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Toast } from 'primeng/toast';
import { LoadingComponent } from '@app/feature/loading/loading/loading.component';
import { FooterComponent } from '@app/feature/page/footer/footer.component';
import { HeaderComponent } from '@app/feature/page/header/header.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, FooterComponent, LoadingComponent, Toast],
  templateUrl: './app.html',
})
export class App {}
