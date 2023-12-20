import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SidenavComponent } from './component/sidenav/sidenav.component';
import { ToolbarMdAndUpComponent } from './component/toolbar/toolbar-md-and-up/toolbar-md-and-up.component';
import { ToolbarSmAndDownComponent } from './component/toolbar/toolbar-sm-and-down/toolbar-sm-and-down.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SidenavComponent,
    ToolbarMdAndUpComponent,
    ToolbarSmAndDownComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
