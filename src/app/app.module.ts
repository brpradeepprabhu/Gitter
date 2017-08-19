import { AppGridModule } from './appgrid/appgrid.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { DataTableModule, PanelMenuModule, MenuItem, DialogModule, ButtonModule, TabViewModule, InputTextModule, GrowlModule } from 'primeng/primeng';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { GitService } from './git.service';
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    AppGridModule,
    BrowserAnimationsModule,
    BrowserModule,
    ButtonModule,
    FormsModule,
    HttpModule,
    DataTableModule,
    DialogModule,
    InputTextModule,
    TabViewModule,
    PanelMenuModule,
    GrowlModule

  ],
  providers: [GitService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
