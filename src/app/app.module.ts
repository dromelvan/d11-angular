import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { D11MainComponent } from './component/d11-main/d11-main.component';
import { SidenavComponent } from './component/sidenav/sidenav.component';
import { ToolbarMenuComponent } from './component/toolbar/toolbar-menu/toolbar-menu.component';
import { ToolbarSidenavComponent } from './component/toolbar/toolbar-sidenav/toolbar-sidenav.component';
import { ToolbarTopNavComponent } from './component/toolbar/toolbar-top-nav/toolbar-top-nav.component';
import { ToolbarBottomNavComponent } from './component/toolbar/toolbar-bottom-nav/toolbar-bottom-nav.component';
import { HomeComponent } from './view/home/home.component';

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        D11MainComponent,
        SidenavComponent,
        ToolbarMenuComponent,
        ToolbarSidenavComponent,
        HomeComponent,
        ToolbarBottomNavComponent,
        ToolbarTopNavComponent,
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
