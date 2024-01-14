import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SidenavComponent } from './component/sidenav/sidenav.component';
import { ToolbarMenuComponent } from './component/toolbar/toolbar-menu/toolbar-menu.component';
import { ToolbarSidenavComponent } from './component/toolbar/toolbar-sidenav/toolbar-sidenav.component';

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        SidenavComponent,
        ToolbarMenuComponent,
        ToolbarSidenavComponent,
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
